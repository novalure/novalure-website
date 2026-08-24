import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  getSelectedPlaybookKeys,
  playbooks,
  type PlaybookKey
} from "@/lib/playbooks-meta";
import { playbookCatalog } from "@/content/playbook-catalog";

const root = process.cwd();

describe("playbook selection and delivery", () => {
  it("delivers one focused playbook for a standard role selection", () => {
    expect(getSelectedPlaybookKeys("de", "developer", false)).toEqual(["de-developer"]);
    expect(getSelectedPlaybookKeys("en", "agent", false)).toEqual(["en-agent"]);
  });

  it("adds the international specialist playbook only when selected", () => {
    expect(getSelectedPlaybookKeys("de", "developer", true)).toEqual([
      "de-developer",
      "de-international"
    ]);
    expect(getSelectedPlaybookKeys("es", "agent", true)).toEqual([
      "es-agent",
      "es-international"
    ]);
  });

  it("publishes exactly three catalogue entries in each locale", () => {
    for (const locale of ["de", "en", "es"] as const) {
      expect(playbookCatalog[locale].map((item) => item.key)).toEqual([
        "developer",
        "agent",
        "international"
      ]);
    }
  });

  it("maps all nine metadata entries to real current files", () => {
    expect(Object.keys(playbooks)).toHaveLength(9);
    for (const [key, meta] of Object.entries(playbooks) as [PlaybookKey, (typeof playbooks)[PlaybookKey]][]) {
      expect(meta.pages).toBe(10);
      expect(fs.existsSync(path.join(root, "public", meta.file))).toBe(true);
      expect(fs.existsSync(path.join(root, "public", meta.cover))).toBe(true);
      expect(key).toBe(`${meta.locale}-${meta.type}`);
    }
  });
});
