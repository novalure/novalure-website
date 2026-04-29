import { defineField, defineType } from "sanity";

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    defineField({ name: "locale", title: "Locale", type: "string", options: { list: ["en", "de"] }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "items",
      title: "Navigation items",
      type: "array",
      description: "Use route links for pages and anchor links for homepage sections such as /en#process.",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "href", title: "Href", type: "string", validation: (Rule) => Rule.required() }),
            defineField({ name: "type", title: "Type", type: "string", options: { list: ["route", "anchor", "cta"] } })
          ]
        }
      ]
    })
  ]
});
