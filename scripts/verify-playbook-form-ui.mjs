import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const requireQa = createRequire(path.resolve(process.env.PLAYBOOK_QA_ROOT || ".playbook-qa", "package.json"));
const { chromium, firefox, webkit } = requireQa("playwright");
const base = process.env.PLAYBOOK_UI_BASE_URL || "http://127.0.0.1:3000";
assert(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Use an isolated local build, never production");
const out = path.resolve("playbook-ui-report");
await fs.mkdir(out, { recursive: true });
const results = [];
const locales = {
  de: { route: "/de/playbooks", heading: "Drei Playbooks.", file: "novalure-owned-demand-de.pdf" },
  en: { route: "/en/playbooks", heading: "Three playbooks.", file: "novalure-owned-demand-en.pdf" },
  es: { route: "/es/playbooks", heading: "Tres playbooks.", file: "novalure-owned-demand-es.pdf" }
};

async function setup(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce", serviceWorkers: "block" });
  await context.addInitScript(() => globalThis.localStorage.setItem("novalure-cookie-consent", JSON.stringify({ necessary: true, analytics: false, marketing: false, external: false, savedAt: new Date().toISOString() })));
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) return route.abort();
    if (!["GET", "HEAD"].includes(route.request().method())) return route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"Blocked by isolated UI test"}' });
    return route.continue();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15_000);
  return { context, page };
}

async function openPlaybooks(page, locale) {
  const config = locales[locale];
  const response = await page.goto(`${base}${config.route}`, { waitUntil: "domcontentloaded" });
  assert(response?.ok(), `${config.route} did not load`);
  await page.getByRole("heading", { level: 1, name: new RegExp(config.heading) }).waitFor();
  const panel = page.locator("#anfrage");
  await panel.waitFor({ state: "visible" });
  await panel.scrollIntoViewIfNeeded();
  await page.evaluate(() => globalThis.document.fonts.ready);
  return panel;
}

async function layoutCase(browser, browserName, locale, width) {
  const { context, page } = await setup(browser, width);
  try {
    const panel = await openPlaybooks(page, locale);
    const measurements = await panel.evaluate((element) => {
      const card = element.getBoundingClientRect();
      const fields = [...element.querySelectorAll("input[type=email], select")].map((field) => {
        const box = field.getBoundingClientRect();
        return { height: box.height, fontSize: parseFloat(globalThis.getComputedStyle(field).fontSize) };
      });
      return { left: card.left, right: card.right, viewport: globalThis.innerWidth, fields };
    });
    assert(measurements.left >= -1 && measurements.right <= measurements.viewport + 1, `Form panel overflows: ${JSON.stringify(measurements)}`);
    assert.equal(measurements.fields.length, 2, "Expected an edition selector and email field");
    for (const field of measurements.fields) {
      assert(field.height >= 48, `Form control is too short: ${JSON.stringify(field)}`);
      assert(field.fontSize >= 16, `Form control text is too small: ${JSON.stringify(field)}`);
    }
    await page.locator('#formular [data-state="open"]').waitFor();
    await panel.locator("select").selectOption("international");
    assert.equal(await panel.locator("select").inputValue(), "international");
    assert.equal(new URL(page.url()).searchParams.get("ausgabe"), "international");
    if (browserName === "chromium") {
      await panel.screenshot({ path: path.join(out, `${locale}-form-${width}.png`), animations: "disabled" });
      await page.locator("#formular [data-state]").screenshot({ path: path.join(out, `${locale}-book-${width}.png`), animations: "disabled" });
    }
    results.push({ type: "layout", browser: browserName, locale, width, status: "passed", ...measurements });
  } catch (error) {
    await page.screenshot({ path: path.join(out, `failure-${browserName}-${locale}-${width}.png`), fullPage: true }).catch(() => {});
    results.push({ type: "layout", browser: browserName, locale, width, status: "failed", error: String(error) });
  } finally {
    await context.close();
  }
}

async function deliveryCase(browser, locale) {
  const { context, page } = await setup(browser, 390);
  const payloads = [];
  let responseStatus = 503;
  try {
    await page.route("**/api/playbook", async (route) => {
      payloads.push(route.request().postDataJSON());
      await route.fulfill({ status: responseStatus, contentType: "application/json", body: responseStatus === 200 ? JSON.stringify({ downloadUrl: `/playbooks/${locales[locale].file}` }) : '{"error":"Simulated delivery failure"}' });
    });
    const panel = await openPlaybooks(page, locale);
    await panel.locator("button[type=submit]").click();
    assert.equal(payloads.length, 0, "An empty email must not submit");
    await panel.locator("select").selectOption("agent");
    await panel.locator("input[name=email]").fill("playbook-ui@example.invalid");
    await panel.locator("button[type=submit]").click();
    await panel.getByRole("alert").waitFor();
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0].mode, "field-guide");
    assert.equal(payloads[0].locale, locale);
    assert.equal(payloads[0].playbookKey, `${locale}-agent`);
    assert.equal(payloads[0].consentMarketing, false);
    responseStatus = 200;
    await panel.locator("input[type=checkbox]").check();
    await panel.locator("button[type=submit]").click();
    await panel.getByRole("status").waitFor();
    assert.equal(payloads.length, 2);
    assert.equal(payloads[1].consentMarketing, true);
    assert.equal(await panel.locator('[data-track="playbooks_pdf_download"]').getAttribute("href"), `/playbooks/${locales[locale].file}`);
    await panel.screenshot({ path: path.join(out, `${locale}-success-390.png`), animations: "disabled" });
    results.push({ type: "delivery", browser: "chromium", locale, status: "passed", mockedRequests: payloads.length, realEmailsSent: 0 });
  } catch (error) {
    await page.screenshot({ path: path.join(out, `failure-delivery-${locale}.png`), fullPage: true }).catch(() => {});
    results.push({ type: "delivery", browser: "chromium", locale, status: "failed", error: String(error) });
  } finally {
    await context.close();
  }
}

for (const [browserName, engine] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await engine.launch();
  try {
    for (const locale of Object.keys(locales)) {
      for (const width of [390, 1440]) await layoutCase(browser, browserName, locale, width);
      if (browserName === "chromium") await deliveryCase(browser, locale);
    }
  } finally {
    await browser.close();
  }
}

const report = { generatedAt: new Date().toISOString(), base, realEmailsSent: 0, expectedCases: 21, passed: results.filter((result) => result.status === "passed").length, failed: results.filter((result) => result.status === "failed").length, results };
await fs.writeFile(path.join(out, "results.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify({ passed: report.passed, failed: report.failed, expectedCases: report.expectedCases, failures: results.filter((result) => result.status === "failed") }, null, 2));
if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `## Playbook page browser regression\n\nPassed: ${report.passed}. Failed: ${report.failed}. Expected: 21. Real emails: 0 (requests intercepted).\n\nSee the playbook-ui-report artifact for screenshots.\n`);
if (report.failed || results.length !== report.expectedCases) process.exitCode = 1;
