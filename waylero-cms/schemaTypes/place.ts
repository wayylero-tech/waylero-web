import { defineType, defineField } from "sanity";

export default defineType({
  name: "place",
  title: "Place",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Place Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "reference",
      to: [{ type: "city" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "entranceFee",
      title: "Entrance Fee",
      type: "string",
    }),
    defineField({
      name: "locationLink",
      title: "Google Maps Link",
      type: "url",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "blockContent",
    }),
    defineField({
      name: "isFeatured",
      title: "Featured?",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
