import { defineField, defineType } from "sanity";

export const playbook = defineType({
  name: "playbook",
  title: "Playbook",
  type: "document",
  fields: [
    defineField({ name: "locale", title: "Locale", type: "string", options: { list: ["en", "de"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", validation: (Rule) => Rule.required() }),
    defineField({ name: "summary", title: "Summary", type: "text" }),
    defineField({ name: "formId", title: "HubSpot playbook form ID", type: "string" }),
    defineField({ name: "fileAsset", title: "Download file", type: "file" }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 100 })
  ]
});
