"use client";

import { useEffect, useId, useRef } from "react";

type AnimatedLogoProps = { className?: string };

export default function AnimatedLogo({ className = "" }: AnimatedLogoProps) {
  const gradientId = useId().replaceAll(":", "");
  const pathRef = useRef<SVGPathElement>(null);
  const ballRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const path = pathRef.current;
    const ball = ballRef.current;
    if (!path || !ball) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const point = path.getPointAtLength(length);
      path.style.strokeDashoffset = "0";
      ball.setAttribute("cx", String(point.x));
      ball.setAttribute("cy", String(point.y));
      return;
    }

    const startedAt = performance.now();
    const duration = 1450;
    let frame = 0;

    const draw = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const distance = length * progress;
      const point = path.getPointAtLength(distance);

      path.style.strokeDashoffset = String(length - distance);
      ball.setAttribute("cx", String(point.x));
      ball.setAttribute("cy", String(point.y));

      if (progress < 1) frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <svg className={className} viewBox="0 0 64 64" role="img" aria-label="Mathematics Daily logo">
      <defs>
        <linearGradient id={gradientId} x1="8" y1="6" x2="56" y2="60" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${gradientId})`} />
      <path ref={pathRef} d="M45.5 54H18.8L31.2 35.5 19 17H49" fill="none" stroke="white" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <circle ref={ballRef} cx="45.5" cy="54" r="6" fill="#FBBF24" stroke="white" strokeWidth="2" />
    </svg>
  );
}
