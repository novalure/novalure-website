import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";

const root = process.cwd();
const host = "127.0.0.1";
const port = 4311;
const origin = `http://${host}:${port}`;
const routes = {
  de: [
    "/de", "/de/bautraeger", "/de/makler", "/de/playbooks", "/de/kontakt", "/de/systembeispiel",
    "/de/playbooks/danke", "/de/kontakt/danke", "/de/rechtliches/impressum", "/de/rechtliches/datenschutz",
    "/de/rechtliches/cookies"
  ],
  en: [
    "/en", "/en/developers", "/en/agents", "/en/playbooks", "/en/contact", "/en/system-example",
    "/en/playbooks/thank-you", "/en/contact/thank-you", "/en/legal/imprint", "/en/legal/privacy", "/en/legal/cookies"
  ],
  es: [
    "/es", "/es/promotores", "/es/agencias-inmobiliarias", "/es/playbooks", "/es/analisis-del-proyecto",
    "/es/ejemplo-del-sistema", "/es/playbooks/gracias", "/es/analisis-del-proyecto/gracias", "/es/aviso-legal",
    "/es/privacidad", "/es/cookies"
  ]
};
const commercialRoutes = new Set([
  "/de/bautraeger", "/de/makler", "/de/playbooks", "/de/kontakt", "/de/systembeispiel",
  "/en/developers", "/en/agents", "/en/playbooks", "/en/contact", "/en/system-example",
  "/es/promotores", "/es/agencias-inmobiliarias", "/es/playbooks", "/es/analisis-del-proyecto", "/es/ejemplo-del-sistema"
]);
const languageExpectations = {
  de: {
    navigation: "Systembeispiel ansehen",
    home: "NovaLure führt den Prozess operativ im System.",
    notice: "NovaLure betreibt den Lead- und Vertriebsprozess für Ihr Mandat.",
    selection: "Welcher Bereich beschreibt Ihre aktuelle Situation?",
    international: "Wir sprechen gezielt internationale Käufer an."
  },
  en: {
    navigation: "View system example",
    home: "NovaLure operates the process in the system on your behalf.",
    notice: "NovaLure operates the lead and sales process for each mandate.",
    selection: "Which area best describes your current situation?",
    international: "We actively target international buyers."
  },
  es: {
    navigation: "Ver ejemplo del sistema",
    home: "NovaLure opera el proceso dentro del sistema por cuenta del cliente.",
    notice: "NovaLure opera el proceso de captación y gestión comercial para cada encargo.",
    selection: "¿Qué opción describe mejor su situación actual?",
    international: "Nos dirigimos activamente a compradores internacionales."
  }
};
const forbidden = ["CRM-Login", "CRM login", "Acceso al CRM", "https://novalure-crm.app"];
const playbookFiles = [
  "novalure-project-demand-de.pdf",
  "novalure-owned-demand-de.pdf",
  "novalure-international-buyers-de.pdf",
  "novalure-project-demand-en.pdf",
  "novalure-owned-demand-en.pdf",
  "novalure-international-buyers-en.pdf",
  "novalure-project-demand-es.pdf",
  "novalure-owned-demand-es.pdf",
  "novalure-international-buyers-es.pdf"
];

const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
const server = spawn(process.execPath, [nextBin, "start", "--hostname", host, "--port", String(port)], {
  cwd: root,
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1", NEXT_PUBLIC_SITE_URL: origin },
  stdio: ["ignore", "pipe", "pipe"]
});

let serverOutput = "";
server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServer() {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next.js server exited early with code ${server.exitCode}.\n${serverOutput}`);
    try {
      const response = await fetch(`${origin}/en`, { redirect: "manual" });
      if (response.status === 200) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for Next.js server.\n${serverOutput}`);
}

async function verifyRoute(locale, route) {
  const response = await fetch(`${origin}${route}`);
  assert(response.status === 200, `${route} returned ${response.status}`);
  const html = await response.text();

  for (const phrase of forbidden) {
    assert(!html.includes(phrase), `${route} still contains forbidden public wording: ${phrase}`);
  }

  const expected = languageExpectations[locale];
  assert(html.includes(expected.navigation), `${route} is missing the localised system-example navigation label`);

  if (route === `/${locale}`) {
    assert(html.includes(expected.home), `${route} is missing the operated-service homepage explanation`);
    assert(html.includes(expected.selection), `${route} is missing the role-based playbook selector`);
    assert(html.includes(expected.international), `${route} is missing the international-buyer add-on`);
  }
  if (commercialRoutes.has(route)) {
    assert(html.includes(expected.notice), `${route} is missing the operated-service clarification`);
  }
  if (route === `/${locale}/playbooks`) {
    assert(html.includes(expected.selection), `${route} is missing the role-based playbook selector`);
    assert(html.includes(expected.international), `${route} is missing the international-buyer add-on`);
  }
}

async function verifyRootRedirect() {
  const response = await fetch(`${origin}/`, {
    redirect: "manual",
    headers: { "accept-language": "en-GB,en;q=0.9" }
  });
  assert(response.status >= 300 && response.status < 400, `/ returned ${response.status} instead of a redirect`);
  const location = response.headers.get("location") || "";
  assert(location.endsWith("/en"), `/ redirected to an unexpected location: ${location}`);
}

async function verifyPlaybooks() {
  for (const file of playbookFiles) {
    const response = await fetch(`${origin}/playbooks/${file}`);
    assert(response.status === 200, `${file} returned ${response.status}`);
    assert(response.headers.get("content-type")?.includes("application/pdf"), `${file} is not served as application/pdf`);
    const bytes = new Uint8Array(await response.arrayBuffer());
    assert(bytes.length > 20_000, `${file} is unexpectedly small`);
    assert(new TextDecoder("ascii").decode(bytes.slice(0, 4)) === "%PDF", `${file} does not have a PDF signature`);
  }
}

async function stopServer() {
  if (server.exitCode !== null) return;
  server.kill("SIGTERM");
  await Promise.race([once(server, "exit"), new Promise((resolve) => setTimeout(resolve, 5_000))]);
  if (server.exitCode === null) server.kill("SIGKILL");
}

try {
  await waitForServer();
  await verifyRootRedirect();
  for (const [locale, localeRoutes] of Object.entries(routes)) {
    for (const route of localeRoutes) await verifyRoute(locale, route);
  }
  await verifyPlaybooks();
  console.log("Managed-service and playbook verification passed for 33 pages and 9 canonical playbook PDFs.");
} finally {
  await stopServer();
}
