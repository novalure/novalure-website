const resendApiBaseUrl = "https://api.resend.com";
const requestTimeoutMs = 10_000;

type MarketingConfirmation = {
  email: string;
  playbook: string;
  confirmedAt: string;
  privacyPolicyVersion: string;
};

async function resendRequest(path: string, init: RequestInit) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const headers = new Headers(init.headers);
  headers.set("authorization", `Bearer ${apiKey}`);
  headers.set("content-type", "application/json");

  return fetch(`${resendApiBaseUrl}${path}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(requestTimeoutMs)
  });
}

function assertSuccess(response: Response, operation: string, allowedStatuses: number[] = []) {
  if (!response.ok && !allowedStatuses.includes(response.status)) {
    throw new Error(`Resend ${operation} failed with status ${response.status}`);
  }
}

export async function persistMarketingConfirmation({
  email,
  playbook,
  confirmedAt,
  privacyPolicyVersion
}: MarketingConfirmation) {
  const topicId = process.env.RESEND_MARKETING_TOPIC_ID?.trim();
  const segmentId = process.env.RESEND_CONTACT_SEGMENT_ID?.trim();
  if (!topicId) {
    throw new Error("RESEND_MARKETING_TOPIC_ID is missing");
  }

  const normalizedEmail = email.trim().toLowerCase();
  const encodedEmail = encodeURIComponent(normalizedEmail);
  const properties = {
    doi_confirmed_at: confirmedAt,
    doi_source: "novalure_playbook",
    privacy_policy_version: privacyPolicyVersion,
    requested_playbook: playbook
  };
  const topics = [{ id: topicId, subscription: "opt_in" }];

  const createResponse = await resendRequest("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email: normalizedEmail,
      unsubscribed: false,
      properties,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
      topics
    })
  });

  if (createResponse.ok) {
    return { created: true };
  }

  // Repeated confirmations are expected. Update the existing contact and make
  // every follow-up operation idempotent.
  if (createResponse.status !== 409) {
    assertSuccess(createResponse, "contact creation");
  }

  const updateResponse = await resendRequest(`/contacts/${encodedEmail}`, {
    method: "PATCH",
    body: JSON.stringify({
      unsubscribed: false,
      properties
    })
  });
  assertSuccess(updateResponse, "contact update");

  if (segmentId) {
    const segmentResponse = await resendRequest(
      `/contacts/${encodedEmail}/segments/${encodeURIComponent(segmentId)}`,
      { method: "POST" }
    );
    assertSuccess(segmentResponse, "segment assignment", [409]);
  }

  const topicResponse = await resendRequest(`/contacts/${encodedEmail}/topics`, {
    method: "PATCH",
    body: JSON.stringify(topics)
  });
  assertSuccess(topicResponse, "topic subscription");

  return { created: false };
}
