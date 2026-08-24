import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
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
  const source = path.join(root, "content", "playbooks", `${stem}.md`);

  for (const file of [pdf, cover, source]) {
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

  const markdown = fs.readFileSync(source, "utf8");
  for (const numbering of ["1 von 3", "2 von 3", "3 von 3", "1 of 3", "2 of 3", "3 of 3", "1 de 3", "2 de 3", "3 de 3"]) {
    if (markdown.includes(numbering)) throw new Error(`${path.relative(root, source)} still contains ${numbering}`);
  }
}

console.log("All 9 playbook PDFs, covers and source files passed verification.");
