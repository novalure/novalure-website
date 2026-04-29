import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Localized Page",
  type: "document",
  fields: [
    defineField({
      name: "locale",
      title: "Locale",
      type: "string",
      options: { list: ["en", "de"], layout: "radio" },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "template",
      title: "Template",
      type: "string",
      options: { list: ["home", "audience", "standard", "contact", "legal"] },
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", validation: (Rule) => Rule.required() }),
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
        defineField({ name: "points", title: "Proof points", type: "array", of: [{ type: "string" }] })
      ]
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "body", title: "Body", type: "text" }),
            defineField({ name: "items", title: "List items", type: "array", of: [{ type: "string" }] })
          ]
        }
      ]
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "targetKey", title: "Target page key", type: "string" })
      ]
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "targetKey", title: "Target page key", type: "string" })
      ]
    })
  ]
});
