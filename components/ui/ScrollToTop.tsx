"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "@phosphor-icons/react";
import { useLenis } from "lenis/react";

/**
 * Floating "back to top" control. Hidden at the top of the page, fades/slides
 * in once the reader has scrolled past the first screen. Uses Lenis when it is
 * available so the jump matches the site's smooth-scroll feel.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Kembali ke atas"
          initial={{ opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.9 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-paper/90 text-ink-soft shadow-[0_10px_24px_-14px_rgba(28,21,18,0.5)] backdrop-blur transition-colors hover:border-ember/40 hover:text-ember dark:border-white/15 dark:bg-[#181512]/90"
        >
          <ArrowUp size={18} weight="bold" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
