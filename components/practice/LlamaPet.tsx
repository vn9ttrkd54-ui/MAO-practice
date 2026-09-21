import type { TutorPetState } from "@/lib/tutorPet";
import styles from "./LlamaPet.module.css";

export default function LlamaPet({ state, hop = 0, small = false }: {
  state: TutorPetState;
  hop?: number;
  small?: boolean;
}) {
  return (
    <span aria-hidden="true" className={`${styles.pet} ${small ? styles.small : ""}`} data-state={state}>
      <span key={hop} className={hop ? styles.hop : styles.still}>
        <span className={styles.motion}>
          <span className={styles.sprite} />
        </span>
      </span>
      {state === "thinking" ? (
        <span className={styles.thought}><i /><i /><i /></span>
      ) : null}
      {state === "sleeping" ? <span className={styles.sleep}>z<span>z</span></span> : null}
    </span>
  );
}
