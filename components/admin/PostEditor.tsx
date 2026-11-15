"use client";

import { useActionState, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Eye,
  PencilSimple,
  TextB,
  TextItalic,
  TextHOne,
  TextHTwo,
  ListBullets,
  ListNumbers,
  Quotes,
  LinkSimple,
  Code,
  CodeBlock,
  Minus,
  ImageSquare,
} from "@phosphor-icons/react";
import { TextField } from "./fields/TextField";
import { TextArea } from "./fields/TextArea";
import { ImageField } from "./fields/ImageField";
import { ToggleField } from "./fields/ToggleField";
import { SubmitButton } from "./fields/SubmitButton";
import { MediaPicker } from "./fields/MediaPicker";
import { Markdown } from "@/components/blog/Markdown";
import { createPost, updatePost, type PostResult } from "@/lib/actions/posts";
import { withToast } from "@/lib/admin/toast";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const [body, setBody] = useState(post?.bodyMd ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [pickerOpen, setPickerOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** Wrap the selection (or a placeholder) with Markdown markers. */
  const wrap = (before: string, after = before, placeholder = "teks") => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.slice(start, end) || placeholder;
    const next = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  /** Prefix every selected line, e.g. "- " or "> ". */
  const prefixLines = (prefix: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = body.lastIndexOf("\n", start - 1) + 1;
    const lineEnd = body.indexOf("\n", end);
    const sliceEnd = lineEnd === -1 ? body.length : lineEnd;
    const block = body.slice(lineStart, sliceEnd) || "teks";
    const nextBlock = block
      .split("\n")
      .map((line) => (line.startsWith(prefix) ? line : `${prefix}${line}`))
      .join("\n");
    const next = body.slice(0, lineStart) + nextBlock + body.slice(sliceEnd);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(lineStart, lineStart + nextBlock.length);
    });
  };

  const insert = (text: string) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = body.slice(0, start) + text + body.slice(end);
    setBody(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + text.length, start + text.length);
    });
  };

  const [state, action] = useActionState<PostResult | undefined, FormData>(
    async (_prev, formData) => {
      formData.set("bodyMd", body);
      formData.set("tags", JSON.stringify(
        tags.split(",").map((t) => t.trim()).filter(Boolean)
      ));
      const res = post
        ? await withToast(updatePost(post.id, formData), {
            loading: "Menyimpan…",
            success: "Artikel disimpan.",
          })
        : await withToast(createPost(formData), {
            loading: "Membuat artikel…",
            success: "Artikel dibuat.",
          });
      if (res.ok && !post) router.push("/admin/posts");
      return res;
    },
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-6">
      {state && !state.ok && (
        <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="flex items-center gap-2 rounded-sm border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <CheckCircle size={18} weight="fill" /> Tersimpan
        </p>
      )}

      <div className="glass-panel flex flex-col gap-5 rounded-sm p-6 sm:p-8">
        <TextField label="Judul" name="title" defaultValue={post?.title ?? ""} required />
        <TextField
          label="Slug"
          name="slug"
          defaultValue={post?.slug ?? ""}
          hint="Kosongkan untuk dibuat otomatis dari judul."
        />
        <TextArea
          label="Ringkasan"
          name="excerpt"
          defaultValue={post?.excerpt ?? ""}
          rows={2}
          hint="Muncul di daftar blog dan pratinjau tautan."
        />
        <ImageField
          label="Gambar sampul"
          name="coverUrl"
          defaultValue={post?.coverUrl ?? ""}
          folder="posts"
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="tags-input" className="text-sm font-medium text-ink-soft">
            Tag
          </label>
          <input
            id="tags-input"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="web, tutorial"
            className="w-full rounded-sm border border-ink/15 bg-white px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
          />
          <p className="text-xs leading-relaxed text-ink-faint">
            Pisahkan dengan koma. mis. web, tutorial
          </p>
        </div>
        <input
          type="hidden"
          name="tags"
          value={JSON.stringify(
            tags.split(",").map((t) => t.trim()).filter(Boolean)
          )}
        />
        <ToggleField
          label="Terbitkan"
          name="published"
          defaultChecked={post?.published ?? false}
          hint="Jika tidak dicentang, artikel hanya tersimpan sebagai draf."
        />
      </div>

      {/* Markdown body */}
      <div className="glass-panel flex flex-col gap-4 rounded-sm p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
            Isi artikel
          </h2>
          <div className="flex items-center gap-1 rounded-sm border border-ink/15 p-1 dark:border-white/15">
            <TabButton active={tab === "write"} onClick={() => setTab("write")} icon={<PencilSimple size={14} weight="bold" />}>
              Tulis
            </TabButton>
            <TabButton active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye size={14} weight="bold" />}>
              Pratinjau
            </TabButton>
          </div>
        </div>

        {tab === "write" ? (
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-1 rounded-sm border border-ink/15 bg-cream/60 p-1.5 dark:border-white/15 dark:bg-white/[0.03]">
              <ToolButton label="Tebal" onClick={() => wrap("**")}>
                <TextB size={16} weight="bold" />
              </ToolButton>
              <ToolButton label="Miring" onClick={() => wrap("_")}>
                <TextItalic size={16} weight="bold" />
              </ToolButton>
              <ToolButton label="Judul besar" onClick={() => prefixLines("## ")}>
                <TextHOne size={16} weight="bold" />
              </ToolButton>
              <ToolButton label="Judul kecil" onClick={() => prefixLines("### ")}>
                <TextHTwo size={16} weight="bold" />
              </ToolButton>
              <span className="mx-1 h-5 w-px bg-ink/15 dark:bg-white/15" />
              <ToolButton label="Daftar poin" onClick={() => prefixLines("- ")}>
                <ListBullets size={16} weight="bold" />
              </ToolButton>
              <ToolButton label="Daftar nomor" onClick={() => prefixLines("1. ")}>
                <ListNumbers size={16} weight="bold" />
              </ToolButton>
              <ToolButton label="Kutipan" onClick={() => prefixLines("> ")}>
                <Quotes size={16} weight="bold" />
              </ToolButton>
              <span className="mx-1 h-5 w-px bg-ink/15 dark:bg-white/15" />
              <ToolButton
                label="Tautan"
                onClick={() => wrap("[", "](https://)", "teks tautan")}
              >
                <LinkSimple size={16} weight="bold" />
              </ToolButton>
              <ToolButton label="Kode" onClick={() => wrap("`")}>
                <Code size={16} weight="bold" />
              </ToolButton>
              <ToolButton
                label="Blok kode"
                onClick={() => wrap("\n```\n", "\n```\n", "kode")}
              >
                <CodeBlock size={16} weight="bold" />
              </ToolButton>
              <ToolButton label="Garis pemisah" onClick={() => insert("\n---\n")}>
                <Minus size={16} weight="bold" />
              </ToolButton>
              <ToolButton label="Sisipkan gambar" onClick={() => setPickerOpen(true)}>
                <ImageSquare size={16} weight="bold" />
              </ToolButton>
            </div>
            <p className="text-xs leading-relaxed text-ink-faint">
              Pilih teks lalu klik tombol. Tidak perlu hafal Markdown.
            </p>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={20}
              data-lenis-prevent
              placeholder={"Tulis artikel di sini…\n\nGunakan tombol di atas untuk menebalkan, membuat daftar, atau menyisipkan gambar."}
              className="w-full resize-y rounded-sm border border-ink/15 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
            />
          </div>
        ) : (
          <div
            data-lenis-prevent
            className="min-h-[20rem] rounded-sm border border-ink/10 bg-cream p-5 dark:border-white/10 dark:bg-white/[0.02]"
          >
            {body.trim() ? (
              <Markdown>{body}</Markdown>
            ) : (
              <p className="text-sm text-ink-faint">Belum ada isi untuk dipratinjau.</p>
            )}
          </div>
        )}
        <input type="hidden" name="bodyMd" value={body} />
      </div>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(urls) => {
          if (urls[0]) insert(`\n![gambar](${urls[0]})\n`);
          setPickerOpen(false);
        }}
        folder="posts"
        title="Sisipkan gambar"
      />

      <div className="sticky bottom-4 z-10">
        <div className="glass-panel flex items-center justify-end gap-3 rounded-sm px-4 py-3">
          <SubmitButton>{post ? "Simpan" : "Buat artikel"}</SubmitButton>
        </div>
      </div>
    </form>
  );
}

function ToolButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-sm text-ink-soft transition-colors hover:bg-ember/10 hover:text-ember"
    >
      {children}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-ember text-white" : "text-ink-soft hover:text-ink"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
