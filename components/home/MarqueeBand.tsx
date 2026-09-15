import { Marquee } from "@/components/ui/Marquee";

export function MarqueeBand() {
  return (
    <section className="relative rotate-[-0.6deg] scale-[1.02] border-y-2 border-white/10 bg-gradient-to-r from-ember via-flare to-ember py-6 sm:py-8">
      <Marquee
        items={[
          "Hardware Interactive Club",
          "Web Development",
          "UI/UX Design",
          "Robotics",
          "Peer Mentoring",
        ]}
        stretch
        speed={48}
        itemClassName="font-display text-5xl font-bold tracking-tight text-white sm:text-7xl"
      />
    </section>
  );
}