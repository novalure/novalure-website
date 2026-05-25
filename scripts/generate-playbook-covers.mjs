import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  ({ chromium } = require("C:/Users/Franz/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"));
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const playbooks = {
  "de-developer": {
    pdf: "public/playbooks/bautraeger-pipeline-playbook-de.pdf",
    html: "public/playbooks/bautraeger-pipeline-playbook-de.html",
    cover: "public/playbooks/covers/bautraeger-de-cover.png"
  },
  "de-agent": {
    pdf: "public/playbooks/makler-lead-playbook-de.pdf",
    html: "public/playbooks/makler-lead-playbook-de.html",
    cover: "public/playbooks/covers/makler-de-cover.png"
  },
  "en-developer": {
    pdf: "public/playbooks/developer-pipeline-playbook-en.pdf",
    html: "public/playbooks/developer-pipeline-playbook-en.html",
    cover: "public/playbooks/covers/developer-en-cover.png"
  },
  "en-agent": {
    pdf: "public/playbooks/real-estate-agent-lead-playbook-en.pdf",
    html: "public/playbooks/real-estate-agent-lead-playbook-en.html",
    cover: "public/playbooks/covers/agent-en-cover.png"
  }
};

function countPages(pdfPath) {
  const content = fs.readFileSync(pdfPath, "latin1");
  return (content.match(/\/Type\s*\/Page\b/g) || []).length;
}

function publicPath(filePath) {
  return `/${filePath.replace(/^public[\\/]/, "").replaceAll("\\", "/")}`;
}

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

async function renderCovers() {
  const executablePath = findLocalBrowser();

  if (!executablePath) {
    throw new Error("Chrome or Edge was not found.");
  }

  const browser = await chromium.launch({ headless: true, executablePath });

  for (const entry of Object.values(playbooks)) {
    const htmlPath = path.join(root, entry.html);
    const outputPath = path.join(root, entry.cover);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const page = await browser.newPage({
      viewport: { width: 1240, height: 1754 },
      deviceScaleFactor: 2
    });
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
    await page.locator(".cover").first().screenshot({ path: outputPath });
    await page.close();
  }

  await browser.close();
}

function writeMeta() {
  const lines = Object.entries(playbooks).map(([key, entry]) => {
    const pages = countPages(path.join(root, entry.pdf));
    const minutes = Math.round(pages * 0.7);
    return `  "${key}": { pages: ${pages}, readingMinutes: ${minutes}, cover: "${publicPath(entry.cover)}", file: "${publicPath(entry.pdf)}" }`;
  });

  const output = `export type PlaybookKey = "de-developer" | "de-agent" | "en-developer" | "en-agent";

export const privacyPolicyVersion = "2026-05";

export const playbooks: Record<PlaybookKey, {
  pages: number;
  readingMinutes: number;
  cover: string;
  file: string;
}> = {
${lines.join(",\n")}
};
`;

  fs.writeFileSync(path.join(root, "lib/playbooks-meta.ts"), output, "utf8");
}

await renderCovers();
writeMeta();

console.log("Generated playbook covers and metadata.");
