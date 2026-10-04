/**
 * Shared constants for the generic CRUD layer.
 *
 * Kept OUT of lib/actions/crud.ts because a "use server" file may only export
 * async functions — exporting a const array from it is a build error.
 */
export const CRUD_TABLES = [
  "sections",
  "divisi",
  "kurikulum",
  "mentor",
  "pengurus",
  "proker",
  "galeri",
  "faq",
] as const;

export type CrudTable = (typeof CRUD_TABLES)[number];

export function isAllowedTable(table: string): table is CrudTable {
  return (CRUD_TABLES as readonly string[]).includes(table);
}
