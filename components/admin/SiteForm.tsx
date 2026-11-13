"use client";

import { useActionState } from "react";
import { CheckCircle } from "@phosphor-icons/react";
import { TextField } from "./fields/TextField";
import { TextArea } from "./fields/TextArea";
import { ImageField } from "./fields/ImageField";
import { RepeaterField } from "./fields/RepeaterField";
import { SubmitButton } from "./fields/SubmitButton";
import { updateSite, type ActionResult } from "@/lib/actions/site";
import type { Site } from "@/lib/types";

export function SiteForm({ site }: { site: Site }) {
  const [state, action] = useActionState<ActionResult | undefined, FormData>(
    async (_prev, formData) => updateSite(formData),
    undefined
  );

  return (
    <form action={action} className="flex flex-col gap-10">
      {state?.ok && (
        <p className="flex items-center gap-2 rounded-sm border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          <CheckCircle size={18} weight="fill" />
          Tersimpan. Perubahan langsung tampil di situs.
        </p>
      )}
      {state && !state.ok && (
        <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}

      <Section title="Identitas">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Nama singkat" name="nama" defaultValue={site.nama} required />
          <TextField label="Nama panjang" name="namaPanjang" defaultValue={site.namaPanjang} />
          <TextField label="Nama lengkap" name="namaLengkap" defaultValue={site.namaLengkap} />
          <TextField label="Tahun berdiri" name="tahunBerdiri" defaultValue={site.tahunBerdiri} />
          <TextField
            label="Periode kepengurusan"
            name="periodeKepengurusan"
            defaultValue={site.periodeKepengurusan}
          />
        </div>
        <TextArea label="Tagline" name="tagline" defaultValue={site.tagline} rows={2} />
      </Section>

      <Section title="Logo">
        <div className="grid gap-6 sm:grid-cols-2">
          <ImageField
            label="Logo (mode terang)"
            name="logoLightUrl"
            defaultValue={site.logoLightUrl}
            folder="logo"
          />
          <ImageField
            label="Logo (mode gelap)"
            name="logoDarkUrl"
            defaultValue={site.logoDarkUrl}
            folder="logo"
          />
        </div>
      </Section>

      <Section title="Tombol utama (CTA)">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Teks tombol" name="ctaLabel" defaultValue={site.cta.label} />
          <TextField
            label="Tujuan tombol"
            name="ctaHref"
            defaultValue={site.cta.href}
            hint="Boleh tautan internal (/#gabung) atau URL lengkap (https://form…)."
          />
        </div>
      </Section>

      <Section title="Hero">
        <RepeaterField
          label="Judul hero (per kata)"
          name="heroHeadline"
          defaultValue={site.heroHeadline}
          itemLabel="Kata"
          hint="Tiap baris menjadi satu kata besar di hero."
        />
        <TextArea label="Subjudul hero" name="heroSubcopy" defaultValue={site.heroSubcopy} rows={3} />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Tombol 1 — teks"
            name="heroCtaPrimaryLabel"
            defaultValue={site.ctaHero.primaryLabel}
          />
          <TextField
            label="Tombol 1 — tujuan"
            name="heroCtaPrimaryHref"
            defaultValue={site.ctaHero.primaryHref}
          />
          <TextField
            label="Tombol 2 — teks"
            name="heroCtaSecondaryLabel"
            defaultValue={site.ctaHero.secondaryLabel}
          />
          <TextField
            label="Tombol 2 — tujuan"
            name="heroCtaSecondaryHref"
            defaultValue={site.ctaHero.secondaryHref}
          />
        </div>
      </Section>

      <Section title="Tentang">
        <TextArea label="Paragraf pembuka" name="tentangIntro" defaultValue={site.tentangIntro} rows={4} />
        <RepeaterField
          label="Tag / label kecil"
          name="tentangTags"
          defaultValue={site.tentangTags}
          itemLabel="Tag"
        />
        <RepeaterField
          label="Visi"
          name="visi"
          defaultValue={site.visi}
          itemLabel="Visi"
        />
      </Section>

      <Section title="Pilar Misi">
        <RepeaterField
          label="Daftar pilar"
          name="pilarMisi"
          defaultValue={site.pilarMisi}
          itemLabel="Pilar"
          fields={[
            { key: "nama", label: "Nama pilar" },
            { key: "deskripsi", label: "Deskripsi", type: "textarea" },
          ]}
        />
      </Section>

      <Section title="Statistik">
        <RepeaterField
          label="Angka statistik"
          name="statistik"
          defaultValue={site.statistik}
          itemLabel="Statistik"
          fields={[
            { key: "angka", label: "Angka (mis. 1996)" },
            { key: "label", label: "Label" },
          ]}
        />
      </Section>

      <Section title="Marquee">
        <RepeaterField
          label="Teks marquee berjalan"
          name="marqueeItems"
          defaultValue={site.marqueeItems}
          itemLabel="Teks"
        />
      </Section>

      <Section title="Kontak & Sosial">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Email" name="kontakEmail" type="email" defaultValue={site.kontak.email} />
          <TextField label="Instagram" name="kontakInstagram" defaultValue={site.kontak.instagram} />
        </div>
        <TextArea label="Lokasi" name="kontakLokasi" defaultValue={site.kontak.lokasi} rows={2} />
        <RepeaterField
          label="Tautan sosial"
          name="sosial"
          defaultValue={site.sosial}
          itemLabel="Tautan"
          hint="Label + URL lengkap (termasuk https://)."
          fields={[
            { key: "label", label: "Label" },
            { key: "url", label: "URL" },
          ]}
        />
      </Section>

      <Section title="Seksi Gabung">
        <TextArea
          label="Paragraf pembuka"
          name="gabungBody"
          defaultValue={site.ctaGabung.body}
          rows={3}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Tombol 1 — teks"
            name="gabungPrimaryLabel"
            defaultValue={site.ctaGabung.primaryLabel}
          />
          <TextField
            label="Tombol 1 — tujuan"
            name="gabungPrimaryHref"
            defaultValue={site.ctaGabung.primaryHref}
            hint="Kosongkan untuk mailto ke email kontak."
          />
          <TextField
            label="Tombol 2 — teks"
            name="gabungSecondaryLabel"
            defaultValue={site.ctaGabung.secondaryLabel}
          />
          <TextField
            label="Tombol 2 — tujuan"
            name="gabungSecondaryHref"
            defaultValue={site.ctaGabung.secondaryHref}
            hint="Kosongkan untuk mailto formulir minat."
          />
        </div>
      </Section>

      <Section title="Footer">
        <TextField
          label="Kalimat pembuka"
          name="footerEyebrow"
          defaultValue={site.footerCopy.eyebrow}
        />
        <TextField
          label="Judul ajakan"
          name="footerTitle"
          defaultValue={site.footerCopy.title}
        />
      </Section>

      <Section title="Testimoni">
        <RepeaterField
          label="Kutipan anggota"
          name="testimoniItems"
          defaultValue={site.testimoni}
          itemLabel="Testimoni"
          hint="Boleh satu, boleh beberapa. Urutannya mengikuti daftar ini."
          fields={[
            { key: "teks", label: "Kutipan", type: "textarea" },
            { key: "nama", label: "Nama" },
            { key: "peran", label: "Peran / angkatan" },
          ]}
        />
      </Section>

      <div className="sticky bottom-4 z-10">
        <div className="glass-panel flex items-center justify-end rounded-sm px-4 py-3">
          <SubmitButton>Simpan perubahan</SubmitButton>
        </div>
      </div>
    </form>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass-panel rounded-sm p-6 sm:p-8">
      <h2 className="font-display text-xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      <div className="mt-5 flex flex-col gap-5">{children}</div>
    </section>
  );
}
