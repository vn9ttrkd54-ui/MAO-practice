"use client";

import { useEffect, useRef } from "react";
import type { Division } from "@/types/question";
import styles from "./trainer-setup.module.css";

export default function TrainerDivisionAnimation({ division }: { division: Division }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0, progress = 1;
    function draw(p = progress) {
      if (!canvas || !context) return;
      progress = p;
      const { width: w, height: h } = canvas.getBoundingClientRect();
      if (!w || !h) return;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * ratio) || canvas.height !== Math.round(h * ratio)) {
        canvas.width = Math.round(w * ratio); canvas.height = Math.round(h * ratio);
      }
      const c = context;
      c.setTransform(ratio, 0, 0, ratio, 0, 0); c.clearRect(0, 0, w, h);
      c.lineCap = "round"; c.lineJoin = "round";
      const color = getComputedStyle(canvas).getPropertyValue("--accent").trim(), gold = "#e9b427";
      const line = (x: number, y: number, x2: number, y2: number, stroke = "#c8d7ec", width = 1) => {
        c.strokeStyle = stroke; c.lineWidth = width; c.beginPath(); c.moveTo(x, y); c.lineTo(x2, y2); c.stroke();
      };
      const dot = (x: number, y: number) => { c.fillStyle = gold; c.beginPath(); c.arc(x, y, 5, 0, Math.PI * 2); c.fill(); c.strokeStyle = "white"; c.lineWidth = 2; c.stroke(); };
      const text = (value: string, x: number, y: number, align: CanvasTextAlign = "left") => { c.fillStyle = "#5c6c82"; c.font = "12px Arial"; c.textAlign = align; c.fillText(value, x, y); };
      const curve = (fn: (t: number) => number[], start: number, end: number, stroke = color, width = 3) => {
        c.strokeStyle = stroke; c.lineWidth = width; c.beginPath();
        for (let i = 0; i <= 500; i++) { const [x, y] = fn(start + (end - start) * i / 500); if (i) c.lineTo(x, y); else c.moveTo(x, y); } c.stroke();
      };
      if (division === "Theta") {
        const left = 36, right = w - 24, top = 48, bottom = h - 38;
        const sx = (x: number) => left + x / 1.6 * (right - left), sy = (y: number) => bottom - y / 2.4 * (bottom - top);
        const a = p >= 1 ? 128 : Math.pow(2, p * 7) - 1;
        line(left, bottom, right, bottom); line(left, top, left, bottom);
        c.setLineDash([3, 5]); line(sx(1), top, sx(1), bottom); line(left, sy(1), right, sy(1)); c.setLineDash([]);
        const end = a === 0 ? 1.6 : Math.min(1.6, Math.pow(2.4, 1 / a));
        c.save(); c.beginPath(); c.rect(left, top, right - left, bottom - top); c.clip();
        curve(x => [sx(x), sy(a === 0 ? 1 : Math.pow(x, a))], 0, end); c.restore();
        dot(sx(1), sy(1)); text("(1, 1)", sx(1) - 10, sy(1) - 14, "right");
        text("y = xᵃ", left, 24); text(p >= 1 ? "a → ∞" : `a = ${a < 10 ? a.toFixed(2) : a.toFixed(0)}`, right, 24, "right");
        text("0", left, bottom + 22, "center"); text("1", sx(1), bottom + 22, "center"); text("x", right, bottom + 22, "right"); text("y", left - 16, top + 4, "center"); text("1", left - 12, sy(1) + 4, "right");
      } else if (division === "Alpha") {
        const small = w < 480, r = small ? 42 : 78, cx = small ? 66 : 122, cy = h * .5, begin = small ? 132 : 260, end = w - 24;
        const phase = (.12 + p * .88) * Math.PI * 2, px = cx + r * Math.cos(phase), py = cy - r * Math.sin(phase), wx = begin + (end - begin) * phase / (Math.PI * 2);
        line(cx - r - 12, cy, cx + r + 12, cy); line(cx, cy - r - 12, cx, cy + r + 12); line(begin, cy, end, cy);
        c.strokeStyle = color; c.lineWidth = 2.5; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
        c.fillStyle = color; c.globalAlpha = .08; c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, -phase, 0); c.closePath(); c.fill(); c.globalAlpha = 1;
        line(cx, cy, px, py, color, 2.5); line(px, cy, px, py, gold, 2); c.setLineDash([4, 5]); line(px, py, wx, py, color); c.setLineDash([]);
        const sine = (t: number) => [begin + (end - begin) * t / (Math.PI * 2), cy - r * Math.sin(t)];
        curve(sine, 0, Math.PI * 2, "#cfd9eb", 1.5); curve(sine, 0, phase); dot(px, py); dot(wx, py);
        text("sin θ", begin, 32); text("0", begin, cy + 20); text("2π", end, cy + 20, "right"); text("UNIT CIRCLE", cx, h - 28, "center"); text("SINE WAVE", (begin + end) / 2, h - 28, "center");
      } else {
        const x0 = 24, x1 = w - 24, base = h - 48, amp = h * .42;
        const fn = (t: number) => [x0 + t * (x1 - x0), base - amp * (.8 + .28 * Math.sin(t * Math.PI * 1.8))];
        const t = .08 + p * .84, n = 4 + Math.floor(p * 28), bar = (x1 - x0) / n;
        line(x0, base, x1, base); line(x0, 32, x0, base);
        c.fillStyle = color; c.globalAlpha = .13;
        for (let i = 0; i < n; i++) { const [, y] = fn((i + .5) / n); c.fillRect(x0 + i * bar + 1, y, Math.max(1, bar - 2), base - y); } c.globalAlpha = 1;
        curve(fn, 0, 1); const [x, y] = fn(t), slope = -amp * .28 * Math.PI * 1.8 * Math.cos(t * Math.PI * 1.8) / (x1 - x0);
        line(x - 24, y - 24 * slope, x + 24, y + 24 * slope, gold, 2.5); c.setLineDash([4, 5]); line(x, y, x, base, color); c.setLineDash([]); dot(x, y);
        text("f′(x)", Math.min(x + 14, x1 - 44), y - 18); text("∫ f(x) dx", w / 2, 32, "center"); text("a", x0, base + 22); text("b", x1, base + 22, "right"); text("Δx → 0", w / 2, h - 10, "center");
      }
    }
    function stop() { cancelAnimationFrame(frame); frame = 0; draw(1); }
    function animate() {
      cancelAnimationFrame(frame);
      if (reduced.matches || document.hidden) { draw(1); return; }
      const start = performance.now(), duration = division === "Theta" ? 6500 : 3200;
      draw(0);
      const tick = (now: number) => { const t = Math.min(1, (now - start) / duration); draw(t * t * (3 - 2 * t)); frame = t < 1 ? requestAnimationFrame(tick) : 0; };
      frame = requestAnimationFrame(tick);
    }
    const observer = new ResizeObserver(() => draw()); observer.observe(canvas);
    canvas.addEventListener("mouseenter", animate);
    reduced.addEventListener("change", stop); document.addEventListener("visibilitychange", stop);
    animate();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); canvas.removeEventListener("mouseenter", animate); reduced.removeEventListener("change", stop); document.removeEventListener("visibilitychange", stop); };
  }, [division]);
  const summary = division === "Theta" ? "Power curve y equals x to the power a, from a equals zero toward infinity, fixed at (1, 1)." : division === "Alpha" ? "A rotating unit circle point traces a sine wave." : "Riemann rectangles refine beneath a curve while a tangent follows its slope.";
  return <div className={styles.scene}><canvas ref={ref} role="img" aria-label={summary} /></div>;
}
