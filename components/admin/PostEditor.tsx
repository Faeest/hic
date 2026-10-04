"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Eye, PencilSimple } from "@phosphor-icons/react";
import { TextField } from "./fields/TextField";
import { TextArea } from "./fields/TextArea";
import { ImageField } from "./fields/ImageField";
import { ToggleField } from "./fields/ToggleField";
import { SubmitButton } from "./fields/SubmitButton";
import { Markdown } from "@/components/blog/Markdown";
import { createPost, updatePost, type PostResult } from "@/lib/actions/posts";
import { cn } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function PostEditor({ post }: { post: Post | null }) {
  const router = useRouter();
  const [body, setBody] = useState(post?.bodyMd ?? "");
  const [tags, setTags] = useState((post?.tags ?? []).join(", "));
  const [tab, setTab] = useState<"write" | "preview">("write");

  const [state, action] = useActionState<PostResult | undefined, FormData>(
    async (_prev, formData) => {
      formData.set("bodyMd", body);
      formData.set("tags", JSON.stringify(
        tags.split(",").map((t) => t.trim()).filter(Boolean)
      ));
      const res = post
        ? await updatePost(post.id, formData)
        : await createPost(formData);
      if (res.ok && !post) router.push("/admin/posts");
      return res;
    },
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-6">
      {state && !state.ok && (
        <p className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
      {state?.ok && (
        <p className="flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <CheckCircle size={18} weight="fill" /> Tersimpan
        </p>
      )}

      <div className="glass-panel flex flex-col gap-5 rounded-[2rem] p-6 sm:p-8">
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
            className="w-full rounded-2xl border border-ink/15 bg-white px-4 py-2.5 text-base text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
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
      <div className="glass-panel flex flex-col gap-4 rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
            Isi artikel
          </h2>
          <div className="flex items-center gap-1 rounded-full border border-ink/15 p-1 dark:border-white/15">
            <TabButton active={tab === "write"} onClick={() => setTab("write")} icon={<PencilSimple size={14} weight="bold" />}>
              Tulis
            </TabButton>
            <TabButton active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye size={14} weight="bold" />}>
              Pratinjau
            </TabButton>
          </div>
        </div>

        {tab === "write" ? (
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            placeholder={"# Judul\n\nTulis dalam **Markdown**…"}
            className="w-full resize-y rounded-2xl border border-ink/15 bg-white px-4 py-3 font-mono text-sm leading-relaxed text-ink outline-none transition-colors focus:border-ember dark:border-white/15 dark:bg-white/[0.04]"
          />
        ) : (
          <div className="min-h-[20rem] rounded-2xl border border-ink/10 bg-cream p-5 dark:border-white/10 dark:bg-white/[0.02]">
            {body.trim() ? (
              <Markdown>{body}</Markdown>
            ) : (
              <p className="text-sm text-ink-faint">Belum ada isi untuk dipratinjau.</p>
            )}
          </div>
        )}
        <input type="hidden" name="bodyMd" value={body} />
      </div>

      <div className="sticky bottom-4 z-10">
        <div className="glass-panel flex items-center justify-end gap-3 rounded-full px-4 py-3">
          <SubmitButton>{post ? "Simpan" : "Buat artikel"}</SubmitButton>
        </div>
      </div>
    </form>
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
        "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-ember text-white" : "text-ink-soft hover:text-ink"
      )}
    >
      {icon}
      {children}
    </button>
  );
}
