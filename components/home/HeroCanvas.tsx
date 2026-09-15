"use client";

import { useEffect, useRef } from "react";

type P = { x: number; y: number; vx: number; vy: number; r: number; hue: number };

export function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let particles: P[] = [];
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const count = Math.min(Math.floor(w / 26), 46);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 2 + 1,
        hue: 0.7 + Math.random() * 0.3,
      }));
    };

    const dot = (p: P, alpha: number) => {
      const r = Math.round(24 + 36 * p.hue);
      const g = Math.round(13 + 45 * p.hue);
      const b = Math.min(17, Math.round(8 + 6 * p.hue));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      ctx.fill();
    };

    const line = (a: P, b: P, dist: number) => {
      const alpha = Math.max(0, 1 - dist / 160) * 0.16;
      const r = Math.round(212 * a.hue + 251 * (1 - a.hue));
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = `rgba(${r},180,90,${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const step = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
        if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;
      }
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 140) line(a, b, dist);
        }
      }
      for (const p of particles) dot(p, 0.85);
      raf = requestAnimationFrame(step);
    };

    resize();
    if (!reduced) {
      step();
    } else {
      for (const p of particles) dot(p, 0.7);
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}