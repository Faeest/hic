"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Marquee({
  items,
  reverse = false,
  className,
  itemClassName,
  separator = "|",
  stretch = false,
  speed = 55,
}: {
  items: string[];
  reverse?: boolean;
  className?: string;
  itemClassName?: string;
  separator?: string;
  stretch?: boolean;
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
      className={cn("overflow-hidden select-none", className)}
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
              itemClassName
            )}
          >
            <span className={cn(stretch && "inline-block translate-y-[6%] scale-y-[1.22] leading-[0.95]")}>{item}</span>
            <span className="mx-8" aria-hidden>
              {separator}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}