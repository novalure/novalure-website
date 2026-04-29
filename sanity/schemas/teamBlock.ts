import { defineField, defineType } from "sanity";

export const teamBlock = defineType({
  name: "teamBlock",
  title: "Team Block",
  type: "document",
  fields: [
    defineField({ name: "locale", title: "Locale", type: "string", options: { list: ["en", "de"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text" }),
    defineField({ name: "founderLine", title: "Founder line", type: "string", description: "Example: Franz Romih — Founder & Real Estate Sales Lead" }),
    defineField({ name: "pillars", title: "Capability pillars", type: "array", of: [{ type: "string" }] })
  ]
});
