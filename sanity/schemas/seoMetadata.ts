import { defineField, defineType } from "sanity";

export const seoMetadata = defineType({
  name: "seoMetadata",
  title: "SEO Metadata",
  type: "document",
  fields: [
    defineField({ name: "locale", title: "Locale", type: "string", options: { list: ["en", "de"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "pageKey", title: "Page key", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "title", title: "SEO title", type: "string" }),
    defineField({ name: "description", title: "Meta description", type: "text" }),
    defineField({ name: "ogImage", title: "Open Graph image", type: "image", options: { hotspot: true } })
  ]
});
