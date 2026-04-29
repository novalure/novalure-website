import { defineField, defineType } from "sanity";

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "document",
  fields: [
    defineField({ name: "locale", title: "Locale", type: "string", options: { list: ["en", "de"] }, validation: (Rule) => Rule.required() }),
    defineField({ name: "question", title: "Question", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "answer", title: "Answer", type: "text", validation: (Rule) => Rule.required() }),
    defineField({ name: "category", title: "Category", type: "string", options: { list: ["home", "developers", "agents", "playbooks", "contact"] } }),
    defineField({ name: "orderRank", title: "Sort order", type: "number", initialValue: 100 })
  ]
});
