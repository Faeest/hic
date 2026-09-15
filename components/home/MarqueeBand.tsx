import { Marquee } from "@/components/ui/Marquee";

export function MarqueeBand() {
  return (
    <section className="relative -rotate-[0.6deg] scale-[1.02] border-y-2 border-white/10 bg-gradient-to-r from-ember via-flare to-ember py-5 shadow-[0_24px_60px_-24px_rgba(212,83,17,0.55)] sm:py-7">
      <Marquee
        items={[
          "Hardware Interactive Club",
          "Web Development",
          "UI/UX Design",
          "Internet of Things",
          "Peer Mentoring",
        ]}
        squeeze
        speed={48}
        itemClassName="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl"
      />
    </section>
  );
}