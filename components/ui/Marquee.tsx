"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  items,
  reverse = false,
  className,
  itemClassName,
  separator = "✦",
  squeeze = false,
  speed = 55,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  separator?: string;
  squeeze?: boolean;
  speed?: number;
}) {
  const [duration, setDuration] = useState(20);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const width = ref.current.scrollWidth / 2;
      setDuration(Math.max(16, width / speed));
    }
  }, [speed]);

  const row = [...items, ...items];

  return (
    <div
      ref={ref}
      className={cn("overflow-hidden py-4 select-none", className)}
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
        maskImage:
          "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)",
      }}
    >
      <div
        className="flex w-max shrink-0 items-center"
        style={{
          animation: reverse
            ? `marquee-reverse ${duration}s linear infinite`
            : `marquee ${duration}s linear infinite`,
          willChange: "transform",
        }}
      >
        {row.map((item, i) => (
          <div
            key={i}
            aria-hidden={i >= items.length}
            className={cn(
              "flex items-center whitespace-nowrap",
              squeeze && "tracking-[-0.04em]",
              itemClassName
            )}
          >
            <span className={cn(squeeze && "inline-block scale-x-90")}>{item}</span>
            <span className="mx-8" aria-hidden>
              {separator}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}