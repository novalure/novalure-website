import {
  claimResendImportCreation,
  markResendImportTerminal,
  releaseResendImportCreation,
  storeResendImportId,
  type ResendImportOutcome
} from "@/lib/resend-import-state";

const resendApiBaseUrl = "https://api.resend.com";
const requestTimeoutMs = 10_000;
const consumedTokenProperty = "doi_token_fingerprint";
const contactImportDeadlineMs = 20_000;
const contactImportReadTimeoutMs = 3_000;
const contactImportPollDelaysMs = [0, 250, 500, 1_000, 2_000, 4_000] as const;
const contactImportMaxPolls = contactImportPollDelaysMs.length;

type MarketingConfirmation = {
  email: string;
  playbook: string;
  confirmedAt: string;
  privacyPolicyVersion: string;
  tokenFingerprint: string;
};

type ResendContact = {
  id: string;
  email: string;
  unsubscribed: boolean;
  properties?: Record<string, unknown>;
};

type ResendTopic = {
  id: string;
  subscription: "opt_in" | "opt_out";
};

type ResendSegment = {
  id: string;
};

type ResendList<T> = {
  data: T[];
  hasMore: boolean;
};

type ContactImportCounts = {
  total: number;
  created: number;
  updated: number;
  skipped: number;
  failed: number;
};

type ContactImport = {
  id: string;
  status: "queued" | "in_progress" | "completed" | "failed";
  counts: ContactImportCounts;
};

export type MarketingConfirmationResult = {
  status: "confirmed" | "already_confirmed" | "suppressed";
  created: boolean;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

async function resendRequest(path: string, init: RequestInit, timeoutMs = requestTimeoutMs) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  headers.set("authorization", `Bearer ${apiKey}`);
  if (init.body instanceof FormData) {
    // Fetch must generate the multipart boundary. Setting Content-Type here
    // would produce an invalid upload.
    headers.delete("content-type");
  } else {
    headers.set("content-type", "application/json");
  }
  headers.set("user-agent", "novalure-website/1.0");

  return fetch(`${resendApiBaseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(timeoutMs)
  });
}

function assertSuccess(response: Response, operation: string) {
  if (!response.ok) {
    throw new Error(`Resend ${operation} failed with status ${response.status}`);
  }
}

async function readJson(response: Response, operation: string): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Resend ${operation} returned invalid JSON`, { cause: error });
  }
}

function parseContact(value: unknown, operation: string): ResendContact {
  if (
    !isRecord(value)
    || value.object !== "contact"
    || typeof value.id !== "string"
    || !value.id
    || typeof value.email !== "string"
    || !value.email
    || typeof value.unsubscribed !== "boolean"
    || (value.properties !== undefined && !isRecord(value.properties))
  ) {
    throw new Error(`Resend ${operation} returned an invalid contact`);
  }

  return {
    id: value.id,
    email: value.email,
    unsubscribed: value.unsubscribed,
    ...(value.properties ? { properties: value.properties } : {})
  };
}

function parseContactMutation(value: unknown, operation: string) {
  if (
    !isRecord(value)
    || value.object !== "contact"
    || typeof value.id !== "string"
    || !value.id
  ) {
    throw new Error(`Resend ${operation} returned an invalid result`);
  }

  return value.id;
}

function parseContactImportCreation(value: unknown) {
  if (
    !isRecord(value)
    || value.object !== "contact_import"
    || typeof value.id !== "string"
    || !value.id
  ) {
    throw new Error("Resend contact import creation returned an invalid result");
  }
  return value.id;
}

function parseContactImport(value: unknown, expectedId: string): ContactImport {
  if (
    !isRecord(value)
    || value.object !== "contact_import"
    || value.id !== expectedId
    || !["queued", "in_progress", "completed", "failed"].includes(String(value.status))
    || typeof value.created_at !== "string"
    || !value.created_at
    || (value.completed_at !== null && typeof value.completed_at !== "string")
    || !isRecord(value.counts)
  ) {
    throw new Error("Resend contact import retrieval returned an invalid result");
  }

  const countNames = ["total", "created", "updated", "skipped", "failed"] as const;
  const rawCounts = value.counts;
  const counts = Object.fromEntries(countNames.map((name) => [name, rawCounts[name]])) as ContactImportCounts;
  if (countNames.some((name) => !Number.isSafeInteger(counts[name]) || counts[name] < 0)) {
    throw new Error("Resend contact import retrieval returned invalid counts");
  }
  const processed = counts.created + counts.updated + counts.skipped + counts.failed;
  if (
    countNames.some((name) => counts[name] > 1)
    || counts.total > 1
    || processed > counts.total
    || counts.updated !== 0
    || (value.status !== "failed" && counts.failed !== 0)
    || (value.status === "completed" && (value.completed_at === null || !value.completed_at))
  ) {
    throw new Error("Resend contact import retrieval returned unsafe counts");
  }

  return {
    id: value.id,
    status: value.status as ContactImport["status"],
    counts
  };
}

function parseList<T>(
  value: unknown,
  operation: string,
  parseItem: (item: unknown) => T
): ResendList<T> {
  if (
    !isRecord(value)
    || value.object !== "list"
    || !Array.isArray(value.data)
    || typeof value.has_more !== "boolean"
  ) {
    throw new Error(`Resend ${operation} returned an invalid list`);
  }

  return {
    data: value.data.map(parseItem),
    hasMore: value.has_more
  };
}

function parseTopic(item: unknown): ResendTopic {
  if (
    !isRecord(item)
    || typeof item.id !== "string"
    || !item.id
    || (item.subscription !== "opt_in" && item.subscription !== "opt_out")
  ) {
    throw new Error("Resend topic retrieval returned an invalid topic");
  }

  return { id: item.id, subscription: item.subscription };
}

function parseSegment(item: unknown): ResendSegment {
  if (!isRecord(item) || typeof item.id !== "string" || !item.id) {
    throw new Error("Resend segment retrieval returned an invalid segment");
  }

  return { id: item.id };
}

function readStringProperty(
  properties: Record<string, unknown> | undefined,
  key: string
) {
  const value = properties?.[key];
  if (value === undefined) return undefined;
  if (typeof value === "string") return value;
  if (isRecord(value) && value.type === "string" && typeof value.value === "string") {
    return value.value;
  }
  throw new Error(`Resend contact retrieval returned an invalid ${key} property`);
}

async function getContact(encodedEmail: string, expectedEmail: string) {
  const response = await resendRequest(`/contacts/${encodedEmail}`, { method: "GET" });
  if (response.status === 404) {
    const error = await readJson(response, "missing contact retrieval");
    if (
      !isRecord(error)
      || error.name !== "not_found"
      || typeof error.message !== "string"
      || !error.message
    ) {
      throw new Error("Resend contact retrieval returned an invalid 404 response");
    }
    return null;
  }
  assertSuccess(response, "contact retrieval");
  const contact = parseContact(await readJson(response, "contact retrieval"), "contact retrieval");
  if (contact.email.trim().toLowerCase() !== expectedEmail) {
    throw new Error("Resend contact retrieval returned an invalid contact identity");
  }
  return contact;
}

async function getContactTopics(encodedEmail: string) {
  const response = await resendRequest(`/contacts/${encodedEmail}/topics`, { method: "GET" });
  assertSuccess(response, "topic retrieval");
  return parseList(await readJson(response, "topic retrieval"), "topic retrieval", parseTopic);
}

async function getContactSegments(encodedEmail: string) {
  const response = await resendRequest(`/contacts/${encodedEmail}/segments`, { method: "GET" });
  assertSuccess(response, "segment retrieval");
  return parseList(await readJson(response, "segment retrieval"), "segment retrieval", parseSegment);
}

async function assignSegment(encodedEmail: string, segmentId: string | undefined) {
  if (!segmentId) return;

  const segments = await getContactSegments(encodedEmail);
  if (segments.data.some((segment) => segment.id === segmentId)) return;
  if (segments.hasMore) {
    throw new Error("Resend segment retrieval was incomplete");
  }

  const response = await resendRequest(
    `/contacts/${encodedEmail}/segments/${encodeURIComponent(segmentId)}`,
    { method: "POST" }
  );
  assertSuccess(response, "segment assignment");
  const result = await readJson(response, "segment assignment");
  if (!isRecord(result) || result.id !== segmentId) {
    throw new Error("Resend segment assignment returned an invalid result");
  }
}

async function saveConfirmationProperties(
  encodedEmail: string,
  properties: Record<string, string>
) {
  const response = await resendRequest(`/contacts/${encodedEmail}`, {
    method: "PATCH",
    // Deliberately omit `unsubscribed`: a confirmation link must never clear a
    // global unsubscribe recorded after an earlier subscription.
    body: JSON.stringify({ properties })
  });
  assertSuccess(response, "contact property update");
  parseContactMutation(await readJson(response, "contact property update"), "contact property update");
}

function csvCell(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

async function startContactImport(
  normalizedEmail: string,
  properties: Record<string, string>,
  topicId: string,
  segmentId: string | undefined
) {
  const columns = {
    email: "Email",
    confirmedAt: "Confirmed At",
    source: "Source",
    privacyVersion: "Privacy Version",
    playbook: "Playbook",
    fingerprint: "Fingerprint"
  };
  const headers = Object.values(columns);
  const values = [
    normalizedEmail,
    properties.doi_confirmed_at,
    properties.doi_source,
    properties.privacy_policy_version,
    properties.requested_playbook,
    properties[consumedTokenProperty]
  ];
  const csv = `${headers.map(csvCell).join(",")}\r\n${values.map(csvCell).join(",")}\r\n`;
  const formData = new FormData();
  formData.append("file", new Blob([csv], { type: "text/csv;charset=utf-8" }), "novalure-doi.csv");
  formData.append("column_map", JSON.stringify({
    email: columns.email,
    properties: {
      doi_confirmed_at: { column: columns.confirmedAt, type: "string" },
      doi_source: { column: columns.source, type: "string" },
      privacy_policy_version: { column: columns.privacyVersion, type: "string" },
      requested_playbook: { column: columns.playbook, type: "string" },
      [consumedTokenProperty]: { column: columns.fingerprint, type: "string" }
    }
  }));
  // `skip` is the documented conflict mode that leaves an existing contact,
  // including global and topic opt-outs, completely untouched.
  formData.append("on_conflict", "skip");
  if (segmentId) formData.append("segments", JSON.stringify([{ id: segmentId }]));
  formData.append("topics", JSON.stringify([{ id: topicId, subscription: "opt_in" }]));

  const response = await resendRequest("/contacts/imports", {
    method: "POST",
    body: formData
  });
  assertSuccess(response, "contact import creation");
  return parseContactImportCreation(await readJson(response, "contact import creation"));
}

function isRetryableImportReadStatus(status: number) {
  return status === 404 || status === 408 || status === 429 || status >= 500;
}

async function pollContactImport(importId: string, startedAtMs: number) {
  const deadlineMs = startedAtMs + contactImportDeadlineMs;
  let lastError: unknown;

  for (const delayMs of contactImportPollDelaysMs) {
    const beforeDelayMs = Date.now();
    if (beforeDelayMs >= deadlineMs) break;
    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, Math.min(delayMs, deadlineMs - beforeDelayMs)));
    }

    const remainingMs = deadlineMs - Date.now();
    if (remainingMs <= 0) break;

    let statusResponse: Response;
    try {
      statusResponse = await resendRequest(
        `/contacts/imports/${encodeURIComponent(importId)}`,
        { method: "GET" },
        Math.max(1, Math.min(contactImportReadTimeoutMs, remainingMs))
      );
    } catch (error) {
      lastError = error;
      continue;
    }
    if (isRetryableImportReadStatus(statusResponse.status)) {
      lastError = new Error(`Resend contact import retrieval is pending: ${statusResponse.status}`);
      continue;
    }
    assertSuccess(statusResponse, "contact import retrieval");
    const contactImport = parseContactImport(
      await readJson(statusResponse, "contact import retrieval"),
      importId
    );

    if (contactImport.status === "failed") return "failed" as const;
    if (contactImport.status !== "completed") continue;

    const { total, created, updated, skipped, failed } = contactImport.counts;
    const createdOne = total === 1 && created === 1 && updated === 0 && skipped === 0 && failed === 0;
    const skippedOne = total === 1 && created === 0 && updated === 0 && skipped === 1 && failed === 0;
    if (!createdOne && !skippedOne) {
      throw new Error("Resend contact import returned an unsafe result");
    }
    return createdOne ? "created" as const : "skipped" as const;
  }

  throw new Error("Resend contact import is still pending", lastError ? { cause: lastError } : undefined);
}

async function pollAndRecordContactImport(
  tokenFingerprint: string,
  importPayload: unknown,
  importId: string,
  startedAtMs: number
) {
  const outcome = await pollContactImport(importId, startedAtMs);
  await markResendImportTerminal(tokenFingerprint, importPayload, importId, outcome);
  if (outcome === "failed") {
    throw new Error("Resend contact import failed");
  }
  return outcome;
}

export async function persistMarketingConfirmation({
  email,
  playbook,
  confirmedAt,
  privacyPolicyVersion,
  tokenFingerprint
}: MarketingConfirmation): Promise<MarketingConfirmationResult> {
  const topicId = process.env.RESEND_MARKETING_TOPIC_ID?.trim();
  const segmentId = process.env.RESEND_CONTACT_SEGMENT_ID?.trim();
  if (!topicId) {
    throw new Error("RESEND_MARKETING_TOPIC_ID is missing");
  }
  if (!tokenFingerprint) {
    throw new Error("Double opt-in token fingerprint is missing");
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error("Double opt-in email is invalid");
  }

  const encodedEmail = encodeURIComponent(normalizedEmail);
  const properties = {
    doi_confirmed_at: confirmedAt,
    doi_source: "novalure_playbook",
    privacy_policy_version: privacyPolicyVersion,
    requested_playbook: playbook,
    [consumedTokenProperty]: tokenFingerprint
  };

  // `confirmedAt` is the time of the current explicit POST and can differ on a
  // user retry. Exclude it from the durable import identity so the same signed
  // token always resumes its first asynchronous import instead of conflicting.
  const stableImportProperties = {
    doi_source: properties.doi_source,
    privacy_policy_version: properties.privacy_policy_version,
    requested_playbook: properties.requested_playbook,
    [consumedTokenProperty]: properties[consumedTokenProperty]
  };
  const importPayload = {
    email: normalizedEmail,
    properties: stableImportProperties,
    topic: { id: topicId, subscription: "opt_in" },
    ...(segmentId ? { segment: { id: segmentId } } : {})
  };

  const importState = await claimResendImportCreation(tokenFingerprint, importPayload);
  let contact: ResendContact | null = null;
  let importOutcome: Exclude<ResendImportOutcome, "failed"> | null = null;

  if (importState.status === "creating") {
    throw new Error("Resend contact import creation is still in progress");
  }
  if (importState.status === "terminal") {
    if (importState.outcome === "failed") {
      throw new Error("Resend contact import failed");
    }
    importOutcome = importState.outcome;
  } else if (importState.status === "import") {
    importOutcome = await pollAndRecordContactImport(
      tokenFingerprint,
      importPayload,
      importState.importId,
      Date.now()
    );
  } else {
    try {
      contact = await getContact(encodedEmail, normalizedEmail);
    } catch (error) {
      await releaseResendImportCreation(tokenFingerprint, importPayload, importState.claimId);
      throw error;
    }

    if (contact) {
      await releaseResendImportCreation(tokenFingerprint, importPayload, importState.claimId);
    } else {
      const importStartedAtMs = Date.now();
      // Once the POST starts, keep the durable creating marker on failure: a
      // transport error may hide an accepted asynchronous import. The stale
      // lease allows later recovery without inspecting a partial contact now.
      const importId = await startContactImport(normalizedEmail, properties, topicId, segmentId);
      await storeResendImportId(
        tokenFingerprint,
        importPayload,
        importState.claimId,
        importId
      );
      importOutcome = await pollAndRecordContactImport(
        tokenFingerprint,
        importPayload,
        importId,
        importStartedAtMs
      );
    }
  }

  const created = importOutcome === "created";
  if (importOutcome) {
    // Always re-read, including after a completed import. Import counters alone
    // do not prove the resulting global/topic state and are not enough to mark
    // consent as confirmed.
    contact = await getContact(encodedEmail, normalizedEmail);
    if (!contact) {
      throw new Error("Resend contact import completed and no contact was found");
    }
  }

  if (!contact) {
    throw new Error("Resend contact state is unavailable");
  }

  if (created) {
    if (contact.unsubscribed) {
      return { status: "suppressed", created: true };
    }
    const createdTopics = await getContactTopics(encodedEmail);
    if (createdTopics.hasMore) {
      throw new Error("Resend topic retrieval was incomplete");
    }
    const createdTopic = createdTopics.data.find((topic) => topic.id === topicId);
    if (createdTopic?.subscription !== "opt_in") {
      return { status: "suppressed", created: true };
    }
    if (readStringProperty(contact.properties, consumedTokenProperty) !== tokenFingerprint) {
      throw new Error("Resend contact creation did not persist the confirmation marker");
    }
    if (segmentId) {
      const createdSegments = await getContactSegments(encodedEmail);
      if (createdSegments.hasMore) {
        throw new Error("Resend segment retrieval was incomplete");
      }
      if (!createdSegments.data.some((segment) => segment.id === segmentId)) {
        throw new Error("Resend contact creation did not assign the requested segment");
      }
    }
    return { status: "confirmed", created: true };
  }

  if (contact.unsubscribed) {
    return { status: "suppressed", created: false };
  }

  const contactTopics = await getContactTopics(encodedEmail);
  if (contactTopics.hasMore) {
    throw new Error("Resend topic retrieval was incomplete");
  }
  const existingTopic = contactTopics.data.find((topic) => topic.id === topicId);

  // Preserve both explicit topic opt-outs and ambiguous/missing topic state.
  // Only a fresh contact or a contact already opted into this topic can be
  // confirmed by this endpoint; no confirmation link performs a re-subscribe.
  if (existingTopic?.subscription !== "opt_in") {
    return { status: "suppressed", created: false };
  }

  if (readStringProperty(contact.properties, consumedTokenProperty) === tokenFingerprint) {
    if (segmentId) {
      const segments = await getContactSegments(encodedEmail);
      if (segments.hasMore) {
        throw new Error("Resend segment retrieval was incomplete");
      }
      if (!segments.data.some((segment) => segment.id === segmentId)) {
        await assignSegment(encodedEmail, segmentId);
      }
    }
    return { status: "already_confirmed", created: false };
  }

  // The replay marker is written only after every optional segment operation
  // has succeeded. A transient Resend failure therefore leaves the link retryable.
  await assignSegment(encodedEmail, segmentId);
  await saveConfirmationProperties(encodedEmail, properties);

  const updatedContact = await getContact(encodedEmail, normalizedEmail);
  if (!updatedContact) {
    throw new Error("Resend contact disappeared after confirmation update");
  }
  if (updatedContact.unsubscribed) {
    return { status: "suppressed", created: false };
  }
  const updatedTopics = await getContactTopics(encodedEmail);
  if (updatedTopics.hasMore) {
    throw new Error("Resend topic retrieval was incomplete");
  }
  const updatedTopic = updatedTopics.data.find((topic) => topic.id === topicId);
  if (updatedTopic?.subscription !== "opt_in") {
    return { status: "suppressed", created: false };
  }
  if (readStringProperty(updatedContact.properties, consumedTokenProperty) !== tokenFingerprint) {
    throw new Error("Resend contact update did not persist the confirmation marker");
  }

  return { status: "confirmed", created: false };
}

export const resendMarketingConfiguration = {
  contactImportDeadlineMs,
  contactImportMaxPolls,
  contactImportPollDelaysMs,
  contactImportReadTimeoutMs
} as const;
