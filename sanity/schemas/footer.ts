import { defineField, defineType } from "sanity";

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    defineField({ name: "locale", title: "Locale", type: "string", options: { list: ["en", "de"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "intro", title: "Intro copy", type: "text" }),
    defineField({
      name: "links",
      title: "Footer links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Label", type: "string" }),
            defineField({ name: "href", title: "Href", type: "string" })
          ]
        }
      ]
    })
  ]
});
