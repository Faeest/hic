import { Marquee } from "@/components/ui/Marquee";

export function MarqueeBand({ items }: { items: string[] }) {
  return (
    <section className="relative border-y border-ember/25 bg-ember py-5 sm:py-6">
      <Marquee
        items={items}
        stretch
        speed={48}
        itemClassName="font-display text-4xl font-bold tracking-tight text-white sm:text-6xl"
      />
    </section>
  );
}
