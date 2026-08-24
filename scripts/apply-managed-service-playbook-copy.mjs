import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const targets = [
  path.join(root, "scripts", "generate-playbooks.mjs"),
  path.join(root, "public", "playbooks", "developer-pipeline-playbook-en.html")
];

const previous = "No fit: no concrete project, no sales function or no willingness to operate the system.";
const replacement = "No fit: no concrete project, no sales ownership or no willingness to support structured follow-up and handover.";

for (const target of targets) {
  const source = fs.readFileSync(target, "utf8");
  if (source.includes(replacement)) {
    console.log(`Managed-service wording already present in ${path.relative(root, target)}`);
    continue;
  }
  if (!source.includes(previous)) {
    throw new Error(`Expected playbook wording not found in ${path.relative(root, target)}`);
  }
  fs.writeFileSync(target, source.replaceAll(previous, replacement), "utf8");
  console.log(`Updated ${path.relative(root, target)}`);
}
