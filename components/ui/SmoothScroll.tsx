"use client";

import { useEffect, type ReactNode } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "framer-motion";

const NAV_OFFSET = -96;

function AnchorHandler() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        !url.hash ||
        url.hash.length < 2
      )
        return;
      const el = document.querySelector(url.hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: NAV_OFFSET, duration: 1.4 });
      history.replaceState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [lenis]);
  return null;
}

function deviceAllowsSmooth() {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4)
    return false;
  if (
    typeof nav.hardwareConcurrency === "number" &&
    nav.hardwareConcurrency <= 2
  )
    return false;
  if (nav.connection?.saveData) return false;
  const et = nav.connection?.effectiveType;
  if (et === "slow-2g" || et === "2g" || et === "3g") return false;
  return true;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const smooth = !reduce && deviceAllowsSmooth();
  useEffect(() => {
    if (!reduce && !smooth) {
      document.documentElement.style.scrollBehavior = "smooth";
    }
  }, [reduce, smooth]);
  if (!smooth) return <>{children}</>;
  return (
    <ReactLenis root options={{ lerp: 0.1, autoRaf: true }}>
      <AnchorHandler />
      {children}
    </ReactLenis>
  );
}
