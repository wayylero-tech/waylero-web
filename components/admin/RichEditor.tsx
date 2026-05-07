"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TurndownService from "turndown";

const turndown = new TurndownService();

export default function RichEditor({ value, onChange }: any) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      // 💥 HTML -> Markdown çeviriyoruz
      const html = editor.getHTML();
      const markdown = turndown.turndown(html);

      onChange(markdown);
    },
  });

  if (!editor) return null;

  return (
    <div className="bg-gray-800 p-3 rounded-lg border border-gray-700">
      
      <div className="flex gap-2 mb-2">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
          H1
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}