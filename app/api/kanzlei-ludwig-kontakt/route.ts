import { createHash } from "node:crypto";
import { ipAddress } from "@vercel/functions";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getUpstashRedis } from "@/lib/upstash-redis";

export const runtime = "nodejs";

const recipient = "hello@novalure.eu";
const maxBodyBytes = 12_000;
const windowSeconds = 600;
const limitScript = `
local ip = redis.call('INCR', KEYS[1])
if ip == 1 then redis.call('EXPIRE', KEYS[1], ARGV[1]) end
local total = redis.call('INCR', KEYS[2])
if total == 1 then redis.call('EXPIRE', KEYS[2], ARGV[1]) end
if ip > 5 or total > 50 then return 0 end
return 1
`;

function failure(error: string, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

async function readBoundedBody(request: NextRequest) {
  if (Number(request.headers.get("content-length") || 0) > maxBodyBytes) throw new Error("too large");
  if (!request.body) throw new Error("missing body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBodyBytes) {
      await reader.cancel();
      throw new Error("too large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function withinRateLimit(request: NextRequest) {
  // Vercel supplies the client address. Store only a one-way digest, not the IP.
  const ip = ipAddress(request);
  if (!ip) {
    if (!process.env.VERCEL_ENV) return true;
    throw new Error("Client address unavailable");
  }
  const digest = createHash("sha256").update(ip).digest("hex");
  const result = await getUpstashRedis().eval(limitScript,
    [`novalure:ludwig-demo:ip:${digest}`, "novalure:ludwig-demo:global"],
    [String(windowSeconds)]);
  return Number(result) === 1;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== request.nextUrl.origin || !request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return failure("Die Anfrage konnte nicht verarbeitet werden.", 403);
  }

  let body: unknown;
  try { body = await readBoundedBody(request); }
  catch { return failure("Bitte überprüfen Sie Ihre Eingaben.", 400); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return failure("Bitte überprüfen Sie Ihre Eingaben.", 400);
  const input = body as Record<string, unknown>;
  if (["concern", "name", "email", "message", "website"].some((key) => input[key] != null && typeof input[key] !== "string")) {
    return failure("Bitte überprüfen Sie Ihre Eingaben.", 400);
  }
  const clean = (key: string) => typeof input[key] === "string" ? (input[key] as string).trim() : "";
  if (clean("website")) return NextResponse.json({ ok: true });
  const concern = clean("concern");
  const name = clean("name");
  const email = clean("email");
  const message = clean("message");
  if (!name || name.length > 120 || /[\r\n]/.test(name) || !email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || concern.length > 120 || /[\r\n]/.test(concern) || message.length < 10 || message.length > 3000) {
    return failure("Bitte geben Sie Ihren Namen, eine gültige E-Mail-Adresse und eine Nachricht mit mindestens 10 Zeichen ein.", 400);
  }

  try {
    if (!(await withinRateLimit(request))) return failure("Zu viele Anfragen. Bitte versuchen Sie es später erneut.", 429);
  } catch {
    console.error("Ludwig preview: rate limit unavailable");
    return failure("Das Formular ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.", 503);
  }
  const apiKey = process.env.RESEND_API_KEY;
  const sender = process.env.CONTACT_SENDER_EMAIL || process.env.RESEND_FROM_EMAIL || "hello@novalure.eu";
  if (!apiKey) {
    console.error("Ludwig preview: email configuration missing");
    return failure("Das Formular ist vorübergehend nicht verfügbar. Bitte versuchen Sie es später erneut.", 503);
  }
  try {
    const { error } = await new Resend(apiKey).emails.send({
      from: sender,
      to: recipient,
      replyTo: email,
      subject: "Kontaktformular-Vorschau Kanzlei Ludwig",
      text: `Anfrage aus der Kontaktformular-Vorschau für Kanzlei Ludwig\n\nAnliegen: ${concern || "Nicht angegeben"}\nName: ${name}\nE-Mail: ${email}\n\nNachricht:\n${message}`
    });
    if (error) throw new Error("Email provider rejected the request");
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Ludwig preview: email delivery failed");
    return failure("Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.", 502);
  }
}
