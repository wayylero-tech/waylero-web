import { defineType, defineField } from "sanity";

export default defineType({
  name: "region",
  title: "Region",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Region Name",
      type: "string",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),
  ],
});
