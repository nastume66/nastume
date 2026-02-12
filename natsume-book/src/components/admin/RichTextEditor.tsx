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
import { useEffect } from "react";
import type { Editor } from "@tiptap/react";

const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
      },
    };
  },
});

export default function RichTextEditor({
  value,
  onChange,
  onUpload,
}: {
  value: string;
  onChange: (html: string) => void;
  onUpload: (files: FileList | null) => Promise<string[]>;
}) {
  const insertImages = async (targetEditor: Editor, fileList: FileList) => {
    const urls = await onUpload(fileList);
    if (urls.length > 0) {
      urls.forEach((url) => {
        targetEditor.chain().focus().setImage({ src: url }).run();
      });
    }
  };

  const setImageStyle = (style: string) => {
    if (!editor || !editor.isActive("image")) return;
    editor.chain().focus().updateAttributes("image", { style }).run();
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      CustomImage,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  useEffect(() => {
    try {
      document.execCommand("enableObjectResizing", false, "true");
      document.execCommand("enableInlineTableEditing", false, "false");
    } catch {
      // ignore browser differences
    }
  }, []);

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

            const { empty } = editor.state.selection;
            if (empty) {
              editor
                .chain()
                .focus()
                .insertContent(`<a href="${url}" target="_blank" rel="noreferrer">链接文字</a>`)
                .run();
            } else {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }
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
              if (e.target.files) await insertImages(editor, e.target.files);
              e.currentTarget.value = "";
            }}
          />
        </label>
        <span className="mx-1 text-xs text-zinc-400">|</span>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => setImageStyle("width: 35%; display: block; margin: 12px 0;")}>小图</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => setImageStyle("width: 60%; display: block; margin: 12px 0;")}>中图</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => setImageStyle("width: 100%; display: block; margin: 12px 0;")}>大图</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => setImageStyle("width: 60%; display: block; margin: 12px auto 12px 0;")}>图左</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => setImageStyle("width: 60%; display: block; margin: 12px auto;")}>图中</button>
        <button className="rounded bg-zinc-100 px-2 py-1 text-xs dark:bg-zinc-800" onClick={() => setImageStyle("width: 60%; display: block; margin: 12px 0 12px auto;")}>图右</button>
      </div>
      <p className="text-xs text-zinc-500">先点击图片再点「小图/中图/大图/图左/图中/图右」即可调整。</p>

      <div
        onDrop={async (e) => {
          const files = e.dataTransfer?.files;
          if (!files || files.length === 0) return;
          const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
          if (imageFiles.length === 0) return;
          e.preventDefault();
          const dt = new DataTransfer();
          imageFiles.forEach((f) => dt.items.add(f));
          await insertImages(editor, dt.files);
        }}
        onPaste={async (e) => {
          const files = e.clipboardData?.files;
          if (!files || files.length === 0) return;
          const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
          if (imageFiles.length === 0) return;
          e.preventDefault();
          const dt = new DataTransfer();
          imageFiles.forEach((f) => dt.items.add(f));
          await insertImages(editor, dt.files);
        }}
      >
        <EditorContent
          editor={editor}
          className="min-h-[560px] rounded-xl border border-zinc-200 p-3 text-base leading-8 dark:border-zinc-700 dark:bg-zinc-950 [&_img]:mx-auto [&_img]:my-3 [&_img]:max-h-[420px] [&_img]:cursor-pointer [&_img]:rounded-lg [&_img]:border [&_img]:border-zinc-200"
        />
      </div>
    </div>
  );
}
