import { defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({ name: "locale", title: "Locale", type: "string", options: { list: ["en", "de"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "pageKey", title: "Page key", type: "string", description: "Example: home, developers, agents, playbooks, contact" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({ name: "headline", title: "Headline", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "subheadline", title: "Subheadline", type: "text" }),
    defineField({ name: "bullets", title: "Hero bullets", type: "array", of: [{ type: "string" }] })
  ]
});
