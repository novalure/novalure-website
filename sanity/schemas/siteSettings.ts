import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Site title", type: "string", initialValue: "Novalure" }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Title", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text" }),
        defineField({ name: "ogImage", title: "Open Graph image", type: "image" })
      ]
    }),
    defineField({
      name: "navigation",
      title: "Navigation notes",
      type: "text",
      description: "Routing is controlled in code to preserve bilingual URL parity."
    }),
    defineField({
      name: "footer",
      title: "Footer notes",
      type: "text"
    })
  ]
});
