import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function SectionHead({
  index,
  label,
  title,
  sub,
  align = "left",
  className,
}: {
  index?: string;
  label: string;
  title: ReactNode;
  sub?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-6",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <Reveal>
        <span className="inline-flex items-baseline gap-3 text-sm">
          {index && (
            <span className="font-mono font-medium text-ember">{index}</span>
          )}
          {index && <span className="h-px w-6 self-center bg-ember/40" aria-hidden />}
          <span className="font-medium text-ink-soft">{label}</span>
        </span>
      </Reveal>
      <Reveal delay={0.08}>
        <h2
          className={cn(
            "font-display text-4xl font-semibold leading-[1.02] tracking-tight text-ink sm:text-5xl lg:text-6xl",
            "max-w-[16ch]"
          )}
        >
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.16}>
          <p className="max-w-[58ch] text-base leading-relaxed text-ink-soft sm:text-lg">
            {sub}
          </p>
        </Reveal>
      )}
    </div>
  );
}