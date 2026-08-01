import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const importStateMocks = vi.hoisted(() => ({
  claim: vi.fn(),
  markTerminal: vi.fn(),
  release: vi.fn(),
  storeId: vi.fn()
}));

vi.mock("@/lib/resend-import-state", () => ({
  claimResendImportCreation: importStateMocks.claim,
  markResendImportTerminal: importStateMocks.markTerminal,
  releaseResendImportCreation: importStateMocks.release,
  storeResendImportId: importStateMocks.storeId
}));

import {
  persistMarketingConfirmation,
  resendMarketingConfiguration
} from "@/lib/resend-marketing";

const topicId = "topic-marketing";
const segmentId = "segment-playbook";
const tokenFingerprint = "f".repeat(64);
const importId = "479e3145-dd38-476b-932c-529ceb705947";
const importClaimId = "11111111-1111-4111-8111-111111111111";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function contact(overrides: Record<string, unknown> = {}) {
  return {
    object: "contact",
    id: "contact-1",
    email: "reader@example.com",
    unsubscribed: false,
    properties: {},
    ...overrides
  };
}

function topicList(subscription: "opt_in" | "opt_out" | null, hasMore = false) {
  return {
    object: "list",
    has_more: hasMore,
    data: subscription ? [{ id: topicId, subscription }] : []
  };
}

function segmentList(ids: string[] = [], hasMore = false) {
  return {
    object: "list",
    has_more: hasMore,
    data: ids.map((id) => ({ id }))
  };
}

function importCreated(id = importId) {
  return { object: "contact_import", id };
}

function importStatus(
  status: "queued" | "in_progress" | "completed" | "failed",
  counts = { total: 1, created: 1, updated: 0, skipped: 0, failed: 0 },
  id = importId
) {
  return {
    object: "contact_import",
    id,
    status,
    created_at: "2026-08-01T12:00:00.000Z",
    completed_at: status === "completed" || status === "failed"
      ? "2026-08-01T12:00:01.000Z"
      : null,
    counts
  };
}

function confirmation(overrides: Record<string, string> = {}) {
  return {
    email: "Reader@Example.com",
    playbook: "en-agent",
    confirmedAt: "2026-08-01T12:00:00.000Z",
    privacyPolicyVersion: "2026-08-01",
    tokenFingerprint,
    ...overrides
  };
}

let responses: Response[];
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.stubEnv("RESEND_MARKETING_TOPIC_ID", topicId);
  vi.stubEnv("RESEND_CONTACT_SEGMENT_ID", segmentId);
  importStateMocks.claim.mockResolvedValue({ status: "claimed", claimId: importClaimId });
  importStateMocks.markTerminal.mockImplementation(async (
    _token: string,
    _payload: unknown,
    id: string,
    outcome: "created" | "skipped" | "failed"
  ) => ({ status: "terminal", importId: id, outcome }));
  importStateMocks.release.mockResolvedValue("released");
  importStateMocks.storeId.mockImplementation(async (
    _token: string,
    _payload: unknown,
    _claim: string,
    id: string
  ) => ({ status: "import", importId: id }));
  responses = [];
  fetchMock = vi.fn(async () => {
    const response = responses.shift();
    if (!response) throw new Error("Unexpected Resend request");
    return response;
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("Resend marketing confirmation", () => {
  it("imports a fresh contact with conflict skipping, explicit topic consent and no global override", async () => {
    responses.push(
      jsonResponse({ name: "not_found", message: "missing" }, 404),
      jsonResponse(importCreated()),
      jsonResponse(importStatus("completed")),
      jsonResponse(contact({ properties: { doi_token_fingerprint: tokenFingerprint } })),
      jsonResponse(topicList("opt_in")),
      jsonResponse(segmentList([segmentId]))
    );

    await expect(persistMarketingConfirmation(confirmation())).resolves.toEqual({
      status: "confirmed",
      created: true
    });

    const [url, init] = fetchMock.mock.calls[1] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/contacts/imports");
    expect(init.body).toBeInstanceOf(FormData);
    const formData = init.body as FormData;
    expect(formData.get("on_conflict")).toBe("skip");
    expect(JSON.parse(String(formData.get("segments")))).toEqual([{ id: segmentId }]);
    expect(JSON.parse(String(formData.get("topics")))).toEqual([
      { id: topicId, subscription: "opt_in" }
    ]);
    const columnMap = JSON.parse(String(formData.get("column_map"))) as Record<string, unknown>;
    expect(columnMap).not.toHaveProperty("unsubscribed");
    const file = formData.get("file") as Blob;
    expect(await file.text()).toContain('"reader@example.com"');
    expect(await file.text()).not.toContain("Unsubscribed");
    expect(new Headers(init.headers).has("content-type")).toBe(false);
    expect(new Headers(init.headers).get("user-agent")).toBe("novalure-website/1.0");
  });

  it("resumes a durable import ID without starting a second import", async () => {
    importStateMocks.claim.mockResolvedValue({ status: "import", importId });
    responses.push(
      jsonResponse(importStatus("completed")),
      jsonResponse(contact({ properties: { doi_token_fingerprint: tokenFingerprint } })),
      jsonResponse(topicList("opt_in")),
      jsonResponse(segmentList([segmentId]))
    );

    await expect(persistMarketingConfirmation(confirmation())).resolves.toEqual({
      status: "confirmed",
      created: true
    });
    expect(fetchMock.mock.calls[0][0]).toBe(`https://api.resend.com/contacts/imports/${importId}`);
    expect(fetchMock.mock.calls.some(([url]) => url === "https://api.resend.com/contacts/imports")).toBe(false);
    expect(importStateMocks.storeId).not.toHaveBeenCalled();
    expect(importStateMocks.markTerminal).toHaveBeenCalledWith(
      tokenFingerprint,
      expect.any(Object),
      importId,
      "created"
    );
  });

  it("does not inspect a possibly partial contact while import creation is in progress", async () => {
    importStateMocks.claim.mockResolvedValue({
      status: "creating",
      claimId: importClaimId,
      claimedAtMs: Date.now()
    });
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/still in progress/);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(importStateMocks.release).not.toHaveBeenCalled();
  });

  it("uses one durable import identity across confirmation retries with different server timestamps", async () => {
    responses.push(
      jsonResponse(contact({ unsubscribed: true })),
      jsonResponse(contact({ unsubscribed: true }))
    );

    await expect(persistMarketingConfirmation(confirmation({
      confirmedAt: "2026-08-01T12:00:00.000Z"
    }))).resolves.toMatchObject({ status: "suppressed" });
    await expect(persistMarketingConfirmation(confirmation({
      confirmedAt: "2026-08-01T12:05:00.000Z"
    }))).resolves.toMatchObject({ status: "suppressed" });

    const firstStatePayload = importStateMocks.claim.mock.calls[0][1];
    const retryStatePayload = importStateMocks.claim.mock.calls[1][1];
    expect(firstStatePayload).toEqual(retryStatePayload);
    expect(firstStatePayload).not.toHaveProperty("properties.doi_confirmed_at");
  });

  it("resumes transient import-read failures within the bounded poll budget", async () => {
    vi.useFakeTimers();
    importStateMocks.claim.mockResolvedValue({ status: "import", importId });
    responses.push(
      jsonResponse({ name: "rate_limited" }, 429),
      jsonResponse({ name: "server_error" }, 500),
      jsonResponse(importStatus("completed", {
        total: 1,
        created: 0,
        updated: 0,
        skipped: 1,
        failed: 0
      })),
      jsonResponse(contact({ unsubscribed: true }))
    );

    const resultPromise = persistMarketingConfirmation(confirmation());
    await vi.runAllTimersAsync();
    await expect(resultPromise).resolves.toEqual({ status: "suppressed", created: false });
    expect(importStateMocks.markTerminal).toHaveBeenCalledWith(
      tokenFingerprint,
      expect.any(Object),
      importId,
      "skipped"
    );
    vi.useRealTimers();
  });

  it("preserves a global unsubscribe without any mutation", async () => {
    responses.push(jsonResponse(contact({ unsubscribed: true })));
    await expect(persistMarketingConfirmation(confirmation())).resolves.toEqual({
      status: "suppressed",
      created: false
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it.each([
    ["topic opt-out", topicList("opt_out")],
    ["missing topic", topicList(null)]
  ])("preserves an existing %s without a topic write", async (_name, topics) => {
    responses.push(jsonResponse(contact()), jsonResponse(topics));
    await expect(persistMarketingConfirmation(confirmation())).resolves.toMatchObject({
      status: "suppressed"
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.some(([, init]) => (init as RequestInit).method === "PATCH")).toBe(false);
  });

  it("fails closed when the topic list is incomplete", async () => {
    responses.push(jsonResponse(contact()), jsonResponse(topicList(null, true)));
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/incomplete/);
  });

  it("updates properties for an already opted-in contact without rewriting its topic", async () => {
    responses.push(
      jsonResponse(contact()),
      jsonResponse(topicList("opt_in")),
      jsonResponse(segmentList([segmentId])),
      jsonResponse({ object: "contact", id: "contact-1" }),
      jsonResponse(contact({ properties: { doi_token_fingerprint: tokenFingerprint } })),
      jsonResponse(topicList("opt_in"))
    );

    await expect(persistMarketingConfirmation(confirmation())).resolves.toEqual({
      status: "confirmed",
      created: false
    });

    const mutationCalls = fetchMock.mock.calls.filter(([, init]) =>
      ["PATCH", "POST"].includes(String((init as RequestInit).method))
    );
    expect(mutationCalls).toHaveLength(1);
    const [url, init] = mutationCalls[0] as [string, RequestInit];
    expect(url).toBe("https://api.resend.com/contacts/reader%40example.com");
    expect(JSON.parse(String(init.body))).toEqual({
      properties: {
        doi_confirmed_at: "2026-08-01T12:00:00.000Z",
        doi_source: "novalure_playbook",
        privacy_policy_version: "2026-08-01",
        requested_playbook: "en-agent",
        doi_token_fingerprint: tokenFingerprint
      }
    });
  });

  it("lists and adds an absent optional segment before storing the marker", async () => {
    responses.push(
      jsonResponse(contact()),
      jsonResponse(topicList("opt_in")),
      jsonResponse(segmentList()),
      jsonResponse({ id: segmentId }),
      jsonResponse({ object: "contact", id: "contact-1" }),
      jsonResponse(contact({ properties: { doi_token_fingerprint: tokenFingerprint } })),
      jsonResponse(topicList("opt_in"))
    );

    await expect(persistMarketingConfirmation(confirmation())).resolves.toMatchObject({ status: "confirmed" });
    expect(fetchMock.mock.calls[3][0]).toBe(
      "https://api.resend.com/contacts/reader%40example.com/segments/segment-playbook"
    );
    expect((fetchMock.mock.calls[3][1] as RequestInit).method).toBe("POST");
  });

  it("does not repeat operations for the same recorded fingerprint", async () => {
    responses.push(
      jsonResponse(contact({ properties: { doi_token_fingerprint: tokenFingerprint } })),
      jsonResponse(topicList("opt_in")),
      jsonResponse(segmentList([segmentId]))
    );
    await expect(persistMarketingConfirmation(confirmation())).resolves.toEqual({
      status: "already_confirmed",
      created: false
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls.some(([, init]) =>
      ["POST", "PATCH"].includes(String((init as RequestInit).method))
    )).toBe(false);
  });

  it("recognizes the wrapped string property format returned by current Resend APIs", async () => {
    responses.push(jsonResponse(contact({
      properties: {
        doi_token_fingerprint: { type: "string", value: tokenFingerprint }
      }
    })), jsonResponse(topicList("opt_in")), jsonResponse(segmentList([segmentId])));
    await expect(persistMarketingConfirmation(confirmation())).resolves.toEqual({
      status: "already_confirmed",
      created: false
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("never reports an existing marker as confirmed after a global opt-out", async () => {
    responses.push(jsonResponse(contact({
      unsubscribed: true,
      properties: { doi_token_fingerprint: tokenFingerprint }
    })));
    await expect(persistMarketingConfirmation(confirmation())).resolves.toEqual({
      status: "suppressed",
      created: false
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("fails closed for a malformed fingerprint property wrapper", async () => {
    responses.push(jsonResponse(contact({
      properties: {
        doi_token_fingerprint: { type: "number", value: 42 }
      }
    })), jsonResponse(topicList("opt_in")));
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/invalid.*fingerprint/);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("skips a concurrently created contact and preserves its global opt-out", async () => {
    responses.push(
      jsonResponse({ name: "not_found", message: "missing" }, 404),
      jsonResponse(importCreated()),
      jsonResponse(importStatus("completed", {
        total: 1,
        created: 0,
        updated: 0,
        skipped: 1,
        failed: 0
      })),
      jsonResponse(contact({ unsubscribed: true }))
    );
    await expect(persistMarketingConfirmation(confirmation())).resolves.toMatchObject({
      status: "suppressed"
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("rejects a completed create import when the contact still does not exist", async () => {
    responses.push(
      jsonResponse({ name: "not_found", message: "missing" }, 404),
      jsonResponse(importCreated()),
      jsonResponse(importStatus("completed")),
      jsonResponse({ name: "not_found", message: "still missing" }, 404)
    );
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/no contact was found/);
  });

  it("verifies the final contact state even after a successful create", async () => {
    responses.push(
      jsonResponse({ name: "not_found", message: "missing" }, 404),
      jsonResponse(importCreated()),
      jsonResponse(importStatus("completed")),
      jsonResponse(contact({
        unsubscribed: true,
        properties: { doi_token_fingerprint: tokenFingerprint }
      }))
    );
    await expect(persistMarketingConfirmation(confirmation())).resolves.toEqual({
      status: "suppressed",
      created: true
    });
  });

  it("rejects an unclassified 404 instead of entering the create path", async () => {
    responses.push(jsonResponse({ name: "not_found" }, 404));
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/invalid 404/);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it.each([
    ["an updated row", { total: 1, created: 0, updated: 1, skipped: 0, failed: 0 }],
    ["a mixed result", { total: 1, created: 1, updated: 0, skipped: 1, failed: 0 }],
    ["a failed row", { total: 1, created: 0, updated: 0, skipped: 0, failed: 1 }],
    ["the wrong total", { total: 2, created: 1, updated: 0, skipped: 0, failed: 0 }]
  ])("fails closed when a completed import reports %s", async (_name, counts) => {
    responses.push(
      jsonResponse({ name: "not_found", message: "missing" }, 404),
      jsonResponse(importCreated()),
      jsonResponse(importStatus("completed", counts))
    );
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/unsafe (counts|result)/);
  });

  it("fails closed when an import fails or returns malformed counts", async () => {
    responses.push(
      jsonResponse({ name: "not_found", message: "missing" }, 404),
      jsonResponse(importCreated()),
      jsonResponse(importStatus("failed", {
        total: 1,
        created: 0,
        updated: 0,
        skipped: 0,
        failed: 1
      }))
    );
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/import failed/);
    expect(importStateMocks.markTerminal).toHaveBeenCalledWith(
      tokenFingerprint,
      expect.any(Object),
      importId,
      "failed"
    );

    vi.clearAllMocks();
    importStateMocks.claim.mockResolvedValue({ status: "claimed", claimId: importClaimId });
    importStateMocks.storeId.mockImplementation(async (
      _token: string,
      _payload: unknown,
      _claim: string,
      id: string
    ) => ({ status: "import", importId: id }));
    responses.push(
      jsonResponse({ name: "not_found", message: "missing" }, 404),
      jsonResponse(importCreated("580e3145-dd38-476b-932c-529ceb705948")),
      jsonResponse(importStatus("completed", {
        total: 1,
        created: Number.NaN,
        updated: 0,
        skipped: 0,
        failed: 0
      }, "580e3145-dd38-476b-932c-529ceb705948"))
    );
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/invalid counts/);
  });

  it("fails closed when an import never reaches a terminal state", async () => {
    vi.useFakeTimers();
    responses.push(
      jsonResponse({ name: "not_found", message: "missing" }, 404),
      jsonResponse(importCreated()),
      ...Array.from(
        { length: resendMarketingConfiguration.contactImportMaxPolls },
        () => jsonResponse(importStatus("in_progress"))
      )
    );

    const confirmationPromise = persistMarketingConfirmation(confirmation());
    const rejection = expect(confirmationPromise).rejects.toThrow(/still pending/);
    await vi.runAllTimersAsync();
    await rejection;
    expect(importStateMocks.storeId).toHaveBeenCalledWith(
      tokenFingerprint,
      expect.any(Object),
      importClaimId,
      importId
    );
    expect(importStateMocks.markTerminal).not.toHaveBeenCalled();
    expect(importStateMocks.release).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it.each([
    ["contact", [jsonResponse({ object: "contact", id: "contact-1" })]],
    ["wrong contact", [jsonResponse(contact({ email: "other@example.com" }))]],
    ["topics", [jsonResponse(contact()), jsonResponse({ object: "list", data: [], has_more: "no" })]],
    ["property mutation", [
      jsonResponse(contact()),
      jsonResponse(topicList("opt_in")),
      jsonResponse(segmentList([segmentId])),
      jsonResponse({ object: "contact" })
    ]]
  ])("fails closed for a malformed %s response", async (_name, queuedResponses) => {
    responses.push(...queuedResponses);
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/invalid/);
  });

  it("does not treat an undocumented segment conflict as success", async () => {
    responses.push(
      jsonResponse(contact()),
      jsonResponse(topicList("opt_in")),
      jsonResponse(segmentList()),
      jsonResponse({ name: "conflict" }, 409)
    );
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/status 409/);
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("fails closed when a 2xx property update does not persist the marker", async () => {
    responses.push(
      jsonResponse(contact()),
      jsonResponse(topicList("opt_in")),
      jsonResponse(segmentList([segmentId])),
      jsonResponse({ object: "contact", id: "contact-1" }),
      jsonResponse(contact()),
      jsonResponse(topicList("opt_in"))
    );
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/did not persist/);
  });

  it("preserves an opt-out that races with the final property update", async () => {
    responses.push(
      jsonResponse(contact()),
      jsonResponse(topicList("opt_in")),
      jsonResponse(segmentList([segmentId])),
      jsonResponse({ object: "contact", id: "contact-1" }),
      jsonResponse(contact({
        unsubscribed: true,
        properties: { doi_token_fingerprint: tokenFingerprint }
      }))
    );
    await expect(persistMarketingConfirmation(confirmation())).resolves.toEqual({
      status: "suppressed",
      created: false
    });
  });

  it("requires runtime configuration and a valid email", async () => {
    vi.stubEnv("RESEND_MARKETING_TOPIC_ID", "");
    await expect(persistMarketingConfirmation(confirmation())).rejects.toThrow(/TOPIC/);
    expect(fetchMock).not.toHaveBeenCalled();

    vi.stubEnv("RESEND_MARKETING_TOPIC_ID", topicId);
    await expect(persistMarketingConfirmation(confirmation({ email: "invalid" }))).rejects.toThrow(/email/);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
