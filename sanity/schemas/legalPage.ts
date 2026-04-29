import { defineField, defineType } from "sanity";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  fields: [
    defineField({ name: "locale", title: "Locale", type: "string", options: { list: ["en", "de"] }, validation: (Rule) => Rule.required() }),
    defineField({
      name: "key",
      title: "Legal key",
      type: "string",
      options: { list: ["imprint", "privacy", "cookies"] },
      validation: (Rule) => Rule.required()
    }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "effectiveDate", title: "Effective date", type: "date" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }]
    })
  ]
});
