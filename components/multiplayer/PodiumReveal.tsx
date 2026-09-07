"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PODIUM_PLACEMENT_MS, podiumPlayers } from "@/lib/multiplayerPodium";
import { RankIcon } from "@/components/multiplayer/RankTheme";
import type { MultiplayerPlayer } from "@/types/multiplayer";
import styles from "./podium.module.css";

const accents: Record<string, string> = {
  Novice: "#a9c6ff", Bronze: "#efb98f", Silver: "#dce7fa", Gold: "#ffe49c",
  Platinum: "#a8e7df", Diamond: "#91e5ff", Master: "#8ce5d6", Grandmaster: "#d4b0ff", Legend: "#fff1a6",
};

function StageLights() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const start = performance.now();
    function draw(now: number) {
      if (!canvas || !ctx) return;
      const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
      const progress = motion.matches ? .5 : Math.min((now - start) / PODIUM_PLACEMENT_MS, 1);
      const t = Math.min(progress / .38, 1), ease = t * t * (3 - 2 * t);
      const intensity = Math.min(1, progress / .08) * Math.min(1, (1 - progress) / .1);
      for (const side of [-1, 1]) {
        const sx = w * (side < 0 ? .14 : .86), sy = -25;
        const ex = w * .5 + side * (w * .42 * (1 - ease) + w * .015 * ease), ey = h * .82;
        const radius = Math.min(w * .19, 155), strength = intensity * (side < 0 ? 1 : .65);
        ctx.filter = "blur(3px)";
        for (let layer = 0; layer < 24; layer++) {
          const r = radius * (1 - layer * .024), gradient = ctx.createLinearGradient(sx, sy, ex, ey);
          gradient.addColorStop(0, `rgba(224,236,255,${.006 * strength})`);
          gradient.addColorStop(.4, `rgba(217,231,251,${.004 * strength})`);
          gradient.addColorStop(1, `rgba(230,239,255,${.0018 * strength})`);
          ctx.fillStyle = gradient; ctx.beginPath(); ctx.moveTo(sx - 3, sy); ctx.lineTo(sx + 3, sy);
          ctx.lineTo(ex + r, ey); ctx.quadraticCurveTo(ex, ey + 10, ex - r, ey); ctx.closePath(); ctx.fill();
        }
        ctx.filter = "none"; ctx.save(); ctx.translate(ex, ey); ctx.scale(1, .21);
        const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.14);
        pool.addColorStop(0, `rgba(235,242,255,${.26 * strength})`);
        pool.addColorStop(.45, `rgba(211,227,250,${.14 * strength})`);
        pool.addColorStop(.8, `rgba(187,211,241,${.035 * strength})`);
        pool.addColorStop(1, "rgba(187,211,241,0)");
        ctx.fillStyle = pool; ctx.fillRect(-radius * 1.2, -radius * 1.2, radius * 2.4, radius * 2.4); ctx.restore();
      }
      if (!motion.matches && progress < 1) frame = requestAnimationFrame(draw);
    }
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvasRef} className={styles.lights} aria-hidden="true" />;
}

export default function PodiumReveal({ players, children }: { players: MultiplayerPlayer[]; children: ReactNode }) {
  const podium = useMemo(() => podiumPlayers(players), [players]);
  const [index, setIndex] = useState(0);
  const complete = index >= podium.length;
  useEffect(() => {
    if (complete) return;
    const timer = window.setTimeout(() => setIndex(value => value + 1), PODIUM_PLACEMENT_MS);
    return () => window.clearTimeout(timer);
  }, [index, complete]);

  // Results are already finalized and rendered by the server; no celebration RPCs.
  if (complete) return <>{children}</>;
  const player = podium[index];
  const place = player.placement!;
  const accent = accents[player.rankTier ?? "Novice"] ?? accents.Novice;
  const medal = place === 1 ? "#f2c455" : place === 2 ? "#c5d6e9" : "#c8956b";
  return <main className={styles.stage} style={{ "--accent": accent, "--medal": medal } as CSSProperties}>
    <div className={styles.stars} aria-hidden="true" /><div className={styles.floor} aria-hidden="true" />
    <StageLights key={`lights-${player.playerId}`} />
    <div className={styles.top}><span>MATHEMATICS DAILY</span><span>MATCH COMPLETE</span></div>
    <div key={`number-${player.playerId}`} className={styles.ghostNumber} aria-hidden="true">{place}</div>
    <section key={player.playerId} className={styles.hero} aria-label={`Place ${place}`}>
      <p className={styles.placement}>{place === 1 ? "Match winner" : place === 2 ? "Second place" : "Third place"}</p>
      <div className={styles.medallion} aria-hidden="true"><span>{place}</span>{place === 1 ? <b className={styles.star}>✦</b> : null}</div>
      <h1 className={styles.playerName}>{player.displayName}</h1>
      <p className={styles.rank}>{player.isGuest ? "Unranked guest" : <><RankIcon rank={player.rankTier ?? "Novice"} size={15} />{player.rankTier ?? "Novice"}</>}</p>
      <p className={styles.score}>{player.score.toLocaleString("en-US")} <span>points</span></p>
    </section>
    <span className="sr-only" role="status">{place === 1 ? "Winner" : `Place ${place}`}: {player.displayName}, {player.score} points.</span>
    {place === 1 ? <div className={styles.confetti} aria-hidden="true">{Array.from({ length: 64 }, (_, i) => {
      const side = i % 2 ? -1 : 1, x = side * (50 + (i * 37) % 310), y = -(90 + (i * 47) % 290);
      return <i key={i} style={{ left: side === 1 ? "16%" : "84%", background: [accent, "#fff", "#88b5ff", medal][i % 4],
        "--mid-x": `${x * .6}px`, "--mid-y": `${y}px`, "--end-x": `${x}px`, "--end-y": `${180 + i % 5 * 25}px`,
        "--spin-mid": `${i * 29}deg`, "--spin-end": `${i * 51}deg`, animationDelay: `${300 + i % 7 * 24}ms`,
      } as CSSProperties} />;
    })}</div> : null}
    <ol className={styles.trail} aria-label="Revealed placements">{podium.slice(0, index + 1).map(entry => <li key={entry.playerId}><span>{entry.placement}</span><b>{entry.displayName}</b></li>)}</ol>
  </main>;
}
