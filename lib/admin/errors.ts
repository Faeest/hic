/**
 * Turn Postgres/Supabase errors into copy a student admin can act on.
 * Unknown errors keep the original message so debugging is still possible.
 */
export function friendlyDbError(error: {
  code?: string;
  message: string;
}): string {
  switch (error.code) {
    case "23505":
      return "Data dengan kunci itu sudah ada. Ganti slug atau nama agar unik.";
    case "23503":
      return "Data ini masih dipakai di tempat lain. Hapus atau pindahkan dulu.";
    case "23502":
      return "Ada kolom wajib yang masih kosong.";
    case "23514":
      return "Nilai ini tidak diizinkan oleh aturan data.";
    case "42501":
      return "Tidak punya izin untuk mengubah data ini.";
    default:
      return error.message;
  }
}
