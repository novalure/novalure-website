import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "content", "playbooks-v3.json");
const content = JSON.parse(fs.readFileSync(source, "utf8"));
const stems = [
  "novalure-project-demand-de",
  "novalure-owned-demand-de",
  "novalure-international-buyers-de",
  "novalure-project-demand-en",
  "novalure-owned-demand-en",
  "novalure-international-buyers-en",
  "novalure-project-demand-es",
  "novalure-owned-demand-es",
  "novalure-international-buyers-es"
];

for (const stem of stems) {
  const pdf = path.join(root, "public", "playbooks", `${stem}.pdf`);
  const cover = path.join(root, "public", "playbooks", "covers", `${stem}.png`);
  const worksheet = path.join(root, "public", "playbooks", "previews", `${stem}-worksheet.png`);
  const sample = path.join(root, "public", "playbooks", "previews", `${stem}-sample.png`);

  for (const file of [pdf, cover, worksheet, sample]) {
    if (!fs.existsSync(file)) throw new Error(`Missing playbook asset: ${path.relative(root, file)}`);
  }

  const pdfBytes = fs.readFileSync(pdf);
  if (pdfBytes.length < 20_000 || pdfBytes.subarray(0, 4).toString("ascii") !== "%PDF") {
    throw new Error(`Invalid PDF asset: ${path.relative(root, pdf)}`);
  }

  const pngBytes = fs.readFileSync(cover);
  if (pngBytes.length < 10_000 || pngBytes.subarray(1, 4).toString("ascii") !== "PNG") {
    throw new Error(`Invalid PNG cover: ${path.relative(root, cover)}`);
  }

  const locale = stem.slice(-2);
  const kind = stem.includes("project-demand") ? "project" : stem.includes("owned-demand") ? "owned" : "international";
  const topic = content[locale]?.[kind];
  if (!topic?.title || !topic?.scoreQuestions || topic.scoreQuestions.length !== 5) {
    throw new Error(`Incomplete source for ${stem}`);
  }
}

console.log("All 9 field-guide PDFs, covers, source entries and 18 previews passed asset verification.");
