"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function RichTextEditor({
  value,
  onChange,
  onUpload,
}: {
  value: string;
  onChange: (html: string) => void;
  onUpload: (files: FileList | null) => Promise<void>;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  if (!editor) {
    return <div className="rounded-xl border border-zinc-200 p-3 text-sm text-zinc-500">编辑器加载中...</div>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 rounded-xl border border-zinc-200 p-2 dark:border-zinc-700">
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().setParagraph().run()}>正文</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().toggleBold().run()}>加粗</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().toggleItalic().run()}>斜体</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().toggleUnderline().run()}>下划线</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().toggleBulletList().run()}>列表</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>代码块</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().setTextAlign("left").run()}>左</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().setTextAlign("center").run()}>中</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().setTextAlign("right").run()}>右</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().toggleHighlight().run()}>高亮</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => editor.chain().focus().setColor("#b45309").run()}>橙字</button>
        <button
          className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800"
          onClick={() => {
            const url = window.prompt("输入链接", "https://");
            if (!url) return;
            editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
        >
          链接
        </button>
        <label className="cursor-pointer rounded bg-amber-100 px-2 py-1 text-xs text-amber-700">
          上传图片
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={async (e) => {
              await onUpload(e.target.files);
              e.currentTarget.value = "";
            }}
          />
        </label>
      </div>

      <EditorContent
        editor={editor}
        className="min-h-[560px] rounded-xl border border-zinc-200 p-3 text-base leading-8 dark:border-zinc-700 dark:bg-zinc-950"
      />
    </div>
  );
}
