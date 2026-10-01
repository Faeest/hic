# HIC — Content Management (CMS)

Semua isi situs bisa diubah dari satu panel: **`/admin`**. Tidak perlu menyentuh kode.

## Cara kerja singkat

```
/admin  ──edit──▶  content/*.json  ──commit──▶  GitHub  ──▶  Vercel rebuild (~1 menit)
```

- Konten disimpan sebagai file JSON di folder `content/`.
- Setiap kali editor menyimpan, CMS membuat commit ke branch `master`.
- Vercel otomatis membangun ulang situs. Perubahan tampil ~1 menit kemudian.

## Untuk editor

1. Buka `https://<domain-situs>/admin`.
2. Klik **Login with GitHub**, izinkan akses ke repo `Faeest/hic`.
3. Pilih bagian yang mau diubah, edit, lalu **Save**.
4. Tunggu ±1 menit, refresh situs — perubahan sudah tampil.

### Yang bisa diubah

| Menu di CMS | Isi |
|---|---|
| **Identitas & Global** | Nama, logo, tagline, visi, 7 pilar misi, statistik, kontak, media sosial, menu navigasi, footer, SEO |
| **Beranda** | Semua section homepage — bisa **diurutkan, ditambah, dihapus** (hero, marquee, tentang, divisi, pengurus, program kerja, galeri, FAQ, gabung) |
| **Divisi** | Tambah / hapus / ubah divisi, kurikulum, mentor, warna |
| **Pengurus** | Pembina, BPH, koordinator divisi |
| **Program Kerja** | Daftar program kerja |
| **Galeri** | Foto kegiatan (upload gambar) |
| **FAQ** | Pertanyaan & jawaban |

### Tips

- **Gambar**: pakai widget gambar untuk upload. File masuk ke `public/uploads/`.
- **Urutan section**: di Beranda, tiap section punya tombol naik/turun. Geser untuk mengubah urutan.
- **Tambah divisi**: di menu Divisi, tambah entri baru. Halaman `/divisi/<slug>` otomatis dibuat setelah rebuild.
- **Frasa disorot** (`accent` / `subcopyHighlight`): teks yang diwarnai oranye di judul. Harus sama persis dengan bagian dari judul.

## Setup awal (sekali saja, oleh developer)

### 1. Buat GitHub OAuth App

1. Buka GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Isi:
   - **Application name**: `HIC CMS`
   - **Homepage URL**: `https://<domain-situs>`
   - **Authorization callback URL**: `https://<worker-url>/callback`
3. Catat **Client ID** dan buat **Client Secret**.

### 2. Deploy auth worker (Cloudflare, gratis)

Pakai [`sveltia-cms-auth`](https://github.com/sveltia/sveltia-cms-auth):

```bash
git clone https://github.com/sveltia/sveltia-cms-auth
cd sveltia-cms-auth
npm install
npx wrangler deploy
```

Set environment variables worker:

```bash
npx wrangler secret put GITHUB_CLIENT_ID
npx wrangler secret put GITHUB_CLIENT_SECRET
```

Lalu di `public/admin/config.yml`, ganti `base_url` dengan URL worker hasil deploy.

### 3. Edit lokal (tanpa login)

Untuk mencoba CMS di komputer:

```bash
npx @sveltia/cms
```

Arahkan ke folder repo ini. Perubahan ditulis langsung ke file JSON lokal.

## Struktur file

```
content/
  site.json          # identitas + global (nav, footer, SEO)
  pages/home.json    # urutan & isi section beranda
  divisi.json        # daftar divisi
  pengurus.json
  proker.json
  galeri.json
  faq.json
lib/
  types.ts           # tipe TypeScript semua konten
  content.ts         # loader (import JSON + helper)
public/
  admin/             # panel CMS
  uploads/           # gambar hasil upload
data/*.ts            # shim lama — re-export dari lib/content (bisa dihapus nanti)
```

## Catatan teknis

- Publish **tidak instan** — perlu rebuild Vercel (~1 menit). Tidak ada draft/penjadwalan.
- JSON diimpor statis (`resolveJsonModule`) sehingga tidak ada pembacaan file saat runtime — aman di Vercel.
- `data/*.ts` sengaja dipertahankan sebagai shim agar import lama tidak pecah; bisa dihapus setelah semua import diarahkan ke `@/lib/content`.
