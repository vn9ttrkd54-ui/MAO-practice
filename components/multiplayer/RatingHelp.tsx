"use client";

import { useId, useState } from "react";
import { CircleHelp } from "lucide-react";
import styles from "@/app/multiplayer/lobby.module.css";

export default function RatingHelp() {
  const id = useId();
  const [open, setOpen] = useState(false);

  return <div className={styles.ratingHelp} data-open={open} onKeyDown={event => {
    if (event.key === "Escape") {
      setOpen(false);
      event.currentTarget.querySelector("button")?.blur();
    }
  }}>
    <button type="button" aria-label="How RP works" aria-describedby={id}
      onClick={() => setOpen(value => !value)} onBlur={() => setOpen(false)}>
      <CircleHelp size={17} aria-hidden="true" />
    </button>
    <div id={id} role="tooltip" className={styles.ratingTooltip}>
      <h2>How RP works</h2>
      <p>RP changes after ranked matches based on your result against each opponent.</p>
      <p>Beating higher-RP players earns more; beating lower-RP players earns less. Losing to lower-RP players costs more than losing to higher-RP players. In larger rooms, these results are averaged.</p>
      <p>Your correct answers, question difficulty, and score slightly adjust the change. Shortened matches have a smaller effect.</p>
      <p>Tied results are neutral against each other. Guests do not affect RP, unranked matches earn no RP, and RP cannot fall below 0.</p>
    </div>
  </div>;
}
