"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

import type { Division } from "@/types/question";
import styles from "@/app/practice/question-bank/division-picker.module.css";

type Props = { name: Division; slug: string; symbol: string; count: number };

export default function DivisionCard({ name, slug, symbol, count }: Props) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const link = linkRef.current;
    const canvas = canvasRef.current;
    if (!link || !canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    function draw(progress = 1) {
      if (!canvas || !context || !link) return;
      const { width, height } = canvas.getBoundingClientRect();
      if (!width || !height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const pixelWidth = Math.round(width * ratio);
      const pixelHeight = Math.round(height * ratio);
      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }
      const c = context;
      c.setTransform(ratio, 0, 0, ratio, 0, 0);
      c.clearRect(0, 0, width, height);
      const color = getComputedStyle(link).getPropertyValue("--division-color").trim();
      const baseline = name === "Theta" ? height * .55 : name === "Mu" ? height * .84 : height * .5;
      c.strokeStyle = "#e1eaf5";
      c.lineWidth = 1;
      for (let x = 12; x < width; x += 24) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, height); c.stroke(); }
      for (let y = 12; y < height; y += 24) { c.beginPath(); c.moveTo(0, y); c.lineTo(width, y); c.stroke(); }
      c.strokeStyle = "#bfcee2";
      c.beginPath(); c.moveTo(0, baseline); c.lineTo(width, baseline); c.stroke();
      c.strokeStyle = color;
      c.lineWidth = 2.3;
      c.lineJoin = "round";
      c.lineCap = "round";
      const dot = (x: number, y: number) => {
        c.fillStyle = "#e9b427"; c.beginPath(); c.arc(x, y, 3.5, 0, Math.PI * 2); c.fill();
      };

      if (name === "Theta") {
        const point = (t: number) => [12 + t * (width - 24), height * .82 - height * .7 * (2 * t - 1) ** 2];
        c.beginPath();
        for (let i = 0; i <= 150 * progress; i++) { const [x, y] = point(i / 150); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke();
        for (const t of [(1 - Math.sqrt(.27 / .7)) / 2, .5, (1 + Math.sqrt(.27 / .7)) / 2]) {
          if (progress >= t) { const [x, y] = point(t); dot(x, y); }
        }
      } else if (name === "Alpha") {
        const radius = Math.min(height * .34, width * .19);
        const cx = radius + 8, cy = height * .5, angle = progress * Math.PI * 2;
        c.beginPath(); c.arc(cx, cy, radius, 0, Math.PI * 2); c.stroke();
        const x = cx + radius * Math.cos(angle), y = cy - radius * Math.sin(angle);
        c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke(); dot(x, y);
        const left = cx + radius + 14, right = width - 8;
        c.lineWidth = 2.3; c.beginPath();
        for (let i = 0; i <= 150 * progress; i++) {
          const gx = left + (right - left) * i / 150, gy = cy - radius * Math.sin(i / 150 * Math.PI * 2);
          if (i) c.lineTo(gx, gy); else c.moveTo(gx, gy);
        }
        c.stroke(); c.setLineDash([3, 4]); c.lineWidth = 1;
        c.beginPath(); c.moveTo(x, y); c.lineTo(left + (right - left) * progress, y); c.stroke(); c.setLineDash([]);
      } else {
        const point = (t: number) => [12 + t * (width - 24), height * .47 - height * .24 * Math.sin(t * Math.PI * 2)];
        c.save(); c.fillStyle = color; c.globalAlpha = .13; c.beginPath(); c.moveTo(12, baseline);
        for (let i = 0; i <= 150 * progress; i++) { const [x, y] = point(i / 150); c.lineTo(x, y); }
        c.lineTo(point(progress)[0], baseline); c.closePath(); c.fill(); c.restore();
        c.beginPath();
        for (let i = 0; i <= 150; i++) { const [x, y] = point(i / 150); if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke();
        const t = .12 + progress * .73, [x, y] = point(t);
        const slope = -height * .24 * 2 * Math.PI * Math.cos(t * Math.PI * 2) / (width - 24);
        c.strokeStyle = "#e9b427"; c.lineWidth = 1.7; c.beginPath();
        c.moveTo(x - 18, y - 18 * slope); c.lineTo(x + 18, y + 18 * slope); c.stroke(); dot(x, y);
      }
    }

    function stop() { cancelAnimationFrame(frame); frame = 0; draw(); }
    function animate() {
      stop();
      if (reducedMotion.matches || document.hidden) return;
      const start = performance.now();
      function tick(now: number) {
        const progress = Math.min(1, (now - start) / 1600);
        draw(Math.max(.01, progress));
        frame = progress < 1 ? requestAnimationFrame(tick) : 0;
      }
      frame = requestAnimationFrame(tick);
    }
    const observer = new ResizeObserver(stop);
    observer.observe(canvas);
    link.addEventListener("mouseenter", animate);
    link.addEventListener("mouseleave", stop);
    link.addEventListener("focus", animate);
    link.addEventListener("blur", stop);
    reducedMotion.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    draw();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      link.removeEventListener("mouseenter", animate);
      link.removeEventListener("mouseleave", stop);
      link.removeEventListener("focus", animate);
      link.removeEventListener("blur", stop);
      reducedMotion.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [name]);

  return (
    <Link ref={linkRef} href={`/practice/question-bank/${slug}`} className={`${styles.card} ${styles[slug]}`}>
      <span className={styles.symbol} aria-hidden="true">{symbol}</span>
      <span className={styles.count}>{count} questions</span>
      <h2>{name.toUpperCase()}</h2>
      <canvas ref={canvasRef} className={styles.plot} aria-hidden="true" />
      <span className={styles.explore}>Explore {name.toUpperCase()}<ArrowRight size={19} aria-hidden="true" /></span>
    </Link>
  );
}
