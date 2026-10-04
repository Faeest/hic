# Subdomain HIC — Panduan untuk Pengelola DNS / IT Kampus

Dokumen ini menjelaskan dua cara mengarahkan subdomain kampus
(mis. `hic.ubhinus.ac.id`) ke website HIC. Pilih salah satu.

**Catatan penting:** database, login admin, dan penyimpanan gambar semuanya
dikelola oleh Supabase (layanan cloud eksternal). Jadi aplikasi web-nya sendiri
tidak menyimpan data apa pun — ia hanya perlu bisa diakses lewat internet dan
terhubung ke Supabase. Itu sebabnya URL subdomain tidak memengaruhi fungsi situs.

---

## Opsi A — A Record ke VPS (disarankan, paling sedikit kerja)

Subdomain diarahkan langsung ke server yang sudah menjalankan situs HIC.

| Item | Nilai |
|---|---|
| Tipe record | `A` |
| Host / Name | `hic` (atau sesuai ketentuan kampus) |
| Value / Points to | `103.169.186.163` |
| TTL | 3600 (atau default) |

Hasil: `hic.ubhinus.ac.id` menampilkan situs HIC. Tidak ada perubahan apa pun
di sisi aplikasi — deploy, update konten, dan panel admin tetap berjalan
seperti sekarang.

Jika kampus menggunakan reverse proxy / WAF di depan, teruskan header `Host`
asli dan izinkan WebSocket tidak diperlukan — aplikasi ini hanya butuh HTTP(S)
biasa.

---

## Opsi B — Deploy Terpisah (dari repo GitHub / server kampus)

Jika kebijakan kampus mengharuskan aplikasi berjalan di infrastruktur kampus
(mis. server sendiri atau akun Vercel kampus), aplikasi HIC dapat di-deploy
ulang dari source code. Yang dibutuhkan:

1. **Source code** — repo Git, branch `master` (atau sesuai kesepakatan).
2. **Build & start:**
   - Install: `npm ci`
   - Build: `npm run build`
   - Jalankan: `npm run start -- -p 3100` (port dapat disesuaikan)
   - Requirement: Node.js 22+, koneksi internet keluar ke `*.supabase.co`
3. **Environment variables** (wajib diisi di server deploy, JANGAN di-commit):
   - `NEXT_PUBLIC_SUPABASE_URL` — URL project Supabase
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` — publishable key Supabase
   - (Tidak butuh secret key apa pun untuk menjalankan situs.)
4. **Domain** — arahkan subdomain ke hasil deploy tersebut
   (mis. CNAME ke `cname.vercel-dns.com` bila memakai Vercel,
   atau A record ke IP server kampus bila self-host).

Nilai pasti kedua environment variable di atas akan diberikan terpisah
(melalui jalur aman, bukan dokumen ini).

Setelah deploy opsi B berjalan dan terverifikasi, deploy lama di VPS dapat
dimatikan. Database Supabase tetap sama — tidak ada migrasi data.

---

## Pertanyaan yang Sering Muncul

**Apakah URL berubah memengaruhi konten / admin?**
Tidak. Semua konten (teks, gambar, blog) tersimpan di Supabase dan panel admin
(`https://<domain>/admin`) ikut pindah otomatis mengikuti domain mana pun yang
aktif.

**Apakah butuh SSL/HTTPS?**
Ya, gunakan HTTPS (Vercel menyediakannya otomatis; di VPS/proxy kampus pasang
sertifikat seperti biasa). Login admin tidak aman lewat HTTP polos.

**Kontak teknis:** pengelola situs HIC (mahasiswa HIC UBHINUS).
