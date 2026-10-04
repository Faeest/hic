import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { publicDb } from "@/lib/supabase/public";
import { CONTENT_TAGS } from "@/lib/cache/tags";
import type { FaqItem, FaqRow } from "@/lib/types";
import { faq as seedFaq } from "@/data/faq";
import { bySort, warnFallback } from "./util";

export const seedFaqList: FaqItem[] = seedFaq;

function toApp(row: FaqRow): FaqItem {
  return { pertanyaan: row.pertanyaan, jawaban: row.jawaban };
}

/** All published FAQ items. */
export async function getFaq(): Promise<FaqItem[]> {
  "use cache";
  cacheTag(CONTENT_TAGS.faq);
  cacheLife("max");
  try {
    const { data, error } = await publicDb
      .from("faq")
      .select("*")
      .order("sort", { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return seedFaqList;
    return bySort(data as FaqRow[]).map(toApp);
  } catch (error) {
    warnFallback("faq", error);
    return seedFaqList;
  }
}
