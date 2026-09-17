import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

// Browser APIs are accessed through globalThis only inside Playwright callbacks.
// Install Playwright outside the application dependency tree; see the CI job.
const requireQa = createRequire(path.resolve(process.env.PLAYBOOK_QA_ROOT || ".playbook-qa", "package.json"));
const { chromium, firefox, webkit } = requireQa("playwright");
const base = process.env.PLAYBOOK_UI_BASE_URL || "http://127.0.0.1:3000";
assert(["127.0.0.1", "localhost"].includes(new URL(base).hostname), "Run against an isolated local build, never production");
const out = path.resolve("playbook-ui-report");
await fs.mkdir(out, { recursive: true });
const results = [];
const routes = {
  de: ["/de", "/de/playbooks", "/de/bautraeger", "/de/makler"],
  en: ["/en", "/en/playbooks", "/en/developers", "/en/agents"],
  es: ["/es", "/es/playbooks", "/es/promotores", "/es/agencias-inmobiliarias"]
};

// Measure the browser's resolved colors, including ancestor backgrounds.
function inspectCard(root) {
  const rgb = (value) => (value.match(/[\d.]+/g) || []).map(Number);
  const blend = (front, back) => front.slice(0, 3).map((v, i) => v * (front[3] ?? 1) + back[i] * (1 - (front[3] ?? 1)));
  function background(element) {
    const ancestors = [];
    for (let node = element; node; node = node.parentElement) ancestors.unshift(node);
    return ancestors.reduce((color, node) => blend(rgb(globalThis.getComputedStyle(node).backgroundColor), color), [255, 255, 255]);
  }
  const luminance = (color) => color.map((v) => v / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
  const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05);
  const texts = [];
  const walker = globalThis.document.createTreeWalker(root, globalThis.NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const element = node.parentElement;
    if (!node.textContent.trim() || element.closest('[aria-hidden="true"]') || !element.getClientRects().length) continue;
    const style = globalThis.getComputedStyle(element);
    const bg = background(element);
    texts.push({ text: node.textContent.trim(), ratio: contrast(blend(rgb(style.color), bg), bg), color: style.color, background: bg });
  }
  const fields = [...root.querySelectorAll('input:not([type="checkbox"]):not([type="radio"]):not([name="website"])')].map((element) => {
    const style = globalThis.getComputedStyle(element);
    return { name: element.name, borderRatio: contrast(rgb(style.borderTopColor), background(element)), height: element.getBoundingClientRect().height, fontSize: parseFloat(style.fontSize) };
  });
  const box = root.getBoundingClientRect();
  const overflow = [...root.querySelectorAll("*")].filter((element) => {
    if (element.closest('[aria-hidden="true"]:not([class*="covers"])') || !element.getClientRects().length) return false;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && (rect.left < box.left - 1 || rect.right > box.right + 1);
  }).map((element) => ({ tag: element.tagName, className: element.className }));
  return { texts, fields, overflow, width: box.width, fitsViewport: box.left >= -1 && box.right <= globalThis.innerWidth + 1 };
}

async function assertReadable(card) {
  const metrics = await card.evaluate(inspectCard);
  assert(metrics.texts.length > 1, "No form text measured");
  const failures = metrics.texts.filter((item) => item.ratio < 4.5);
  assert.equal(failures.length, 0, `Insufficient text contrast: ${JSON.stringify(failures)}`);
  assert(metrics.fitsViewport, `Card extends outside viewport: ${metrics.width}`);
  assert.deepEqual(metrics.overflow, [], "Form content must not overflow the card");
  for (const field of metrics.fields) {
    assert(field.borderRatio >= 3, `Field border contrast: ${JSON.stringify(field)}`);
    assert(field.height >= 48, `Input too short: ${field.name}`);
    assert(field.fontSize >= 16, `Input text too small: ${field.name}`);
  }
  return { minTextContrast: Math.min(...metrics.texts.map((item) => item.ratio)), measuredTexts: metrics.texts.length, cardWidth: metrics.width };
}

async function setup(browser, width) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: "reduce", serviceWorkers: "block" });
  // Explicitly deny optional cookies; no external scripts or writes are allowed.
  await context.addInitScript(() => globalThis.localStorage.setItem("novalure-cookie-consent", JSON.stringify({ necessary: true, analytics: false, marketing: false, external: false, updatedAt: new Date().toISOString() })));
  await context.route("**/*", async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    if (!["127.0.0.1", "localhost"].includes(url.hostname)) return route.abort();
    if (!["GET", "HEAD"].includes(request.method())) return route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"Blocked by isolated UI test"}' });
    return route.continue();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  return { context, page };
}

async function openForm(page, routePath) {
  const response = await page.goto(`${base}${routePath}`, { waitUntil: "networkidle" });
  assert(response?.ok(), `Page did not load: ${routePath}`);
  const card = page.locator("[data-playbook-request]").first();
  await card.waitFor({ state: "visible" });
  await page.evaluate(() => globalThis.document.fonts.ready);
  return card;
}

async function screenshot(card, name) {
  await card.screenshot({ path: path.join(out, `${name}.png`), animations: "disabled" });
}

async function layoutCase(browser, browserName, locale, routePath, width) {
  const { context, page } = await setup(browser, width);
  try {
    const card = await openForm(page, routePath);
    const initial = await assertReadable(card);
    const addOn = card.locator('input[name="internationalBuyers"]');
    await addOn.check();
    assert.equal(await card.locator("img").count(), 2, "Both selected covers must appear");
    await assertReadable(card);
    const images = await card.locator("img").evaluateAll((items) => items.map((image) => {
      const rect = image.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, width: rect.width };
    }));
    const overlapX = Math.min(images[0].right, images[1].right) - Math.max(images[0].left, images[1].left);
    const overlapY = Math.min(images[0].bottom, images[1].bottom) - Math.max(images[0].top, images[1].top);
    assert(overlapX <= 0 || overlapY <= 0, "Playbook covers overlap");
    assert(images.every((image) => image.width >= 128), "Covers should be at least 128 CSS px wide");
    await card.locator("img").evaluateAll((items) => Promise.all(items.map((image) => image.decode())));
    if (browserName === "chromium" && (routePath.endsWith("playbooks") || routePath === `/${locale}`) && [390, 1440].includes(width)) {
      await screenshot(card, `${locale}-${routePath.endsWith("playbooks") ? "playbooks" : "home"}-${width}`);
    }
    const agent = card.locator('input[name="role"][value="agent"]');
    if (await agent.isEnabled()) {
      await agent.check();
      await assertReadable(card);
    }
    await addOn.uncheck();
    assert.equal(await card.locator("img").count(), 1);
    const input = card.locator('input[name="name"]');
    await input.focus();
    const focus = await input.evaluate((element) => ({ width: parseFloat(globalThis.getComputedStyle(element).outlineWidth), style: globalThis.getComputedStyle(element).outlineStyle }));
    assert(focus.width >= 2 && focus.style !== "none", "Input focus is not visible");
    results.push({ type: "layout", browser: browserName, locale, route: routePath, width, status: "passed", ...initial });
  } catch (error) {
    await page.screenshot({ path: path.join(out, `failure-${browserName}-${locale}-${routePath.replaceAll("/", "_")}-${width}.png`), fullPage: true }).catch(() => {});
    results.push({ type: "layout", browser: browserName, locale, route: routePath, width, status: "failed", error: String(error) });
  } finally {
    await context.close();
  }
}

async function stateCase(browser, browserName, locale) {
  const { context, page } = await setup(browser, 390);
  const payloads = [];
  let responseStatus = 503;
  let releaseRequest;
  await page.route("**/api/playbook", async (route) => {
    payloads.push(route.request().postDataJSON());
    await new Promise((resolve) => { releaseRequest = resolve; });
    await route.fulfill({ status: responseStatus, contentType: "application/json", body: responseStatus === 200 ? '{"success":true}' : '{"error":"Simulated failure"}' });
  });
  try {
    const card = await openForm(page, `/${locale}/playbooks`);
    const submit = card.locator('button[type="submit"]');
    await submit.click();
    assert.equal(payloads.length, 0, "Invalid forms must not submit");
    assert.equal(await card.locator('input[aria-invalid="true"]').count(), 4);
    assert.equal(await page.evaluate(() => globalThis.document.activeElement?.getAttribute("name")), "name");
    await assertReadable(card);
    if (browserName === "chromium") await screenshot(card, `${locale}-validation-390`);
    await card.locator('[name="name"]').fill("UI Test");
    await card.locator('[name="email"]').fill("invalid");
    await card.locator('[name="company"]').fill("Isolated QA");
    await card.locator('[name="phone"]').fill("wrong");
    await submit.click();
    assert.equal(await card.locator('[name="email"]').getAttribute("aria-invalid"), "true");
    assert.equal(await card.locator('[name="phone"]').getAttribute("aria-invalid"), "true");
    await card.locator('[name="email"]').fill("playbook-ui@example.invalid");
    await card.locator('[name="phone"]').fill("");
    await submit.click();
    assert.equal(payloads.length, 0, "Required consent must be checked");
    assert.equal(await page.evaluate(() => globalThis.document.activeElement?.getAttribute("name")), "consentRequired");
    assert.equal(await card.locator('[name="consentMarketing"]').isChecked(), false);
    await card.locator('[name="consentRequired"]').check();
    await card.locator('[name="role"][value="agent"]').check();
    await card.locator('[name="internationalBuyers"]').check();
    await submit.click();
    await page.waitForFunction(() => globalThis.document.querySelector('[data-playbook-request][data-state="loading"]'));
    assert(await submit.isDisabled(), "Submit must be locked while loading");
    await assertReadable(card);
    assert.equal(payloads.length, 1);
    assert.equal(payloads[0].locale, locale);
    assert.equal(payloads[0].role, "agent");
    assert.equal(payloads[0].playbooks.length, 2);
    assert(payloads[0].playbooks.every((key) => key.startsWith(`${locale}-`)));
    assert.equal(payloads[0].consentMarketing, false);
    assert.equal(payloads[0].consentRequired, true);
    assert.equal(payloads[0].phone, "");
    releaseRequest();
    await card.locator('[role="alert"]').waitFor();
    await assertReadable(card);
    assert.equal(await card.locator('[name="email"]').inputValue(), "playbook-ui@example.invalid");
    if (browserName === "chromium") await screenshot(card, `${locale}-server-error-390`);
    responseStatus = 200;
    await card.locator('[name="consentMarketing"]').check();
    await submit.click();
    await page.waitForFunction(() => globalThis.document.querySelector('[data-playbook-request][data-state="loading"]'));
    assert.equal(payloads.length, 2);
    assert.equal(payloads[1].consentMarketing, true);
    releaseRequest();
    await page.locator('[data-playbook-request][data-state="success"]').waitFor();
    await assertReadable(card);
    assert.equal(await card.locator('[role="status"]').count(), 1);
    if (browserName === "chromium") await screenshot(card, `${locale}-success-390`);
    results.push({ type: "states", browser: browserName, locale, status: "passed", mockedRequests: payloads.length, realEmailsSent: 0 });
  } catch (error) {
    if (releaseRequest) releaseRequest();
    await page.screenshot({ path: path.join(out, `failure-states-${browserName}-${locale}.png`), fullPage: true }).catch(() => {});
    results.push({ type: "states", browser: browserName, locale, status: "failed", error: String(error) });
  } finally {
    await context.close();
  }
}

try {
  for (const [browserName, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch();
    try {
      for (const [locale, localizedRoutes] of Object.entries(routes)) {
        const selectedRoutes = browserName === "chromium" ? localizedRoutes : localizedRoutes.slice(0, 2);
        const widths = browserName === "chromium" ? [320, 390, 768, 1440] : [390, 1440];
        for (const routePath of selectedRoutes) {
          for (const width of widths) await layoutCase(browser, browserName, locale, routePath, width);
        }
        await stateCase(browser, browserName, locale);
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  const report = { generatedAt: new Date().toISOString(), base, realEmailsSent: 0, passed: results.filter((r) => r.status === "passed").length, failed: results.filter((r) => r.status === "failed").length, results };
  await fs.writeFile(path.join(out, "results.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (process.env.GITHUB_STEP_SUMMARY) await fs.appendFile(process.env.GITHUB_STEP_SUMMARY, `## Playbook form browser regression\n\nPassed: ${report.passed}. Failed: ${report.failed}. Real emails: 0 (requests intercepted).\n\nSee the playbook-ui-report artifact for measured colors and screenshots.\n`);
  if (report.failed) process.exitCode = 1;
}
