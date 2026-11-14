"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

/**
 * Toaster that follows the site's own `.dark` class on <html> instead of the OS
 * preference, so admin toasts match the panel's theme toggle.
 */
export function AdminToaster() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const read = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      richColors
      closeButton
      toastOptions={{ duration: 4000 }}
    />
  );
}
