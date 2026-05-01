import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("C:/Users/Franz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const playbookDir = path.join(root, "public", "playbooks");
const previewDir = path.join(playbookDir, "previews");

fs.mkdirSync(previewDir, { recursive: true });

function findLocalBrowser() {
  const candidates = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    `${process.env.LOCALAPPDATA || ""}/Google/Chrome/Application/chrome.exe`,
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    `${process.env.LOCALAPPDATA || ""}/Microsoft/Edge/Application/msedge.exe`
  ];
  return candidates.find((candidate) => candidate && fs.existsSync(candidate));
}

async function main() {
  const executablePath = findLocalBrowser();
  if (!executablePath) {
    throw new Error("Chrome or Edge was not found.");
  }

  const browser = await chromium.launch({ headless: true, executablePath });
  const htmlFiles = fs
    .readdirSync(playbookDir)
    .filter((name) => name.endsWith(".html"))
    .sort();

  for (const fileName of htmlFiles) {
    const page = await browser.newPage({
      viewport: { width: 1240, height: 1754 },
      deviceScaleFactor: 1
    });
    const filePath = path.join(playbookDir, fileName);
    await page.goto(pathToFileURL(filePath).href, { waitUntil: "networkidle" });
    const summary = page.locator(".summary").last();
    const target = path.join(previewDir, `${path.basename(fileName, ".html")}-last-page.png`);
    await summary.screenshot({ path: target });
    await page.close();
    console.log(`Created ${path.relative(root, target)}`);
  }

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
