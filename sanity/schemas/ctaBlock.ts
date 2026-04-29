import { defineField, defineType } from "sanity";

export const ctaBlock = defineType({
  name: "ctaBlock",
  title: "CTA Block",
  type: "document",
  fields: [
    defineField({ name: "locale", title: "Locale", type: "string", options: { list: ["en", "de"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "body", title: "Body", type: "text" }),
    defineField({ name: "primaryLabel", title: "Primary label", type: "string" }),
    defineField({ name: "primaryHref", title: "Primary href", type: "string" }),
    defineField({ name: "secondaryLabel", title: "Secondary label", type: "string" }),
    defineField({ name: "secondaryHref", title: "Secondary href", type: "string" })
  ]
});
