import type { RepeaterFieldSpec } from "@/components/admin/fields/RepeaterField";

/** Field kinds supported by the generic ResourceManager form renderer. */
export type FieldSpec =
  | { kind: "text"; name: string; label: string; required?: boolean; hint?: string; placeholder?: string }
  | { kind: "textarea"; name: string; label: string; rows?: number; hint?: string }
  | { kind: "number"; name: string; label: string; hint?: string }
  | { kind: "bool"; name: string; label: string; hint?: string }
  | { kind: "select"; name: string; label: string; options: { value: string; label: string }[]; hint?: string; placeholder?: string }
  | { kind: "image"; name: string; label: string; folder?: string; hint?: string }
  | { kind: "color"; name: string; label: string; hint?: string }
  | { kind: "repeater"; name: string; label: string; fields?: RepeaterFieldSpec[]; itemLabel?: string; hint?: string }
  | { kind: "hidden"; name: string };

export type ResourceConfig = {
  table: string;
  /** singular noun for buttons, e.g. "Divisi" */
  noun: string;
  /** which row key to show as the list title */
  titleKey: string;
  /** optional secondary line */
  subtitleKey?: string;
  /** fields shown in the edit/create form */
  fields: FieldSpec[];
  /** label for the create button */
  createLabel: string;
};
