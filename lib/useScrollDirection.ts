import { useEffect, useState } from "react";

export function useScrollDirection(): 1 | -1 {
  const [dir, setDir] = useState<1 | -1>(1);
  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y !== last) {
          setDir(y > last ? 1 : -1);
          last = y;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return dir;
}
