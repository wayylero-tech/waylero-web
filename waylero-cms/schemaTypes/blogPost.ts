// schemas/blogPost.ts
import {defineType, defineField} from 'sanity'

export default defineType({
  name: "blogPost",
  title: "Blog Yazısı",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Başlık",
      type: "string",
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "topic",
      title: "Kategori / Konu",
      type: "string",
      options: {
        list: [
          { title: "Genel", value: "genel" },
          { title: "Konya", value: "konya" },
          { title: "İstanbul", value: "istanbul" },
          // diğer şehirleri ekleyebilirsin
        ],
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: "content",
      title: "İçerik",
      type: "array",
      of: [{ type: "block" }]
    }),
    defineField({
      name: "gallery",
      title: "Galeri",
      type: "array",
      of: [{ type: "image" }]
    }),
    defineField({
      name: "publishedAt",
      title: "Yayın Tarihi",
      type: "datetime",
      validation: (Rule) => Rule.required()
    })
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "topic",
      media: "gallery.0"
    }
  }
})
