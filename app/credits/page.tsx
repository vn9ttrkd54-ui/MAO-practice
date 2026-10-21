import type { Metadata } from "next";
import Image from "next/image";

import { LegalPage } from "@/components/legal/LegalPage";

import styles from "./credits.module.css";

export const metadata: Metadata = {
  title: "Credits | Mathematics Daily",
  description: "Development, endorsements, and educational material credits for Mathematics Daily.",
};

export default function CreditsPage() {
  return (
    <LegalPage
      title="Credits"
      summary="The people, organizations, and educational material behind Mathematics Daily."
    >
      <div className={styles.credits}>
        <section className={styles.developer} aria-labelledby="credits-developer">
          <Image
            src="/orlando-science-mu-alpha-theta-transparent.png"
            alt="Orlando Science Mu Alpha Theta logo"
            width={1303}
            height={1207}
            sizes="(max-width: 639px) 96px, 152px"
            className={styles.logo}
          />
          <div>
            <h2 id="credits-developer" className={styles.developerLabel}>
              Developed by
            </h2>
            <p className={styles.developerName}>Orlando Science Mu Alpha Theta</p>
          </div>
        </section>

        <section className={styles.row} aria-labelledby="credits-contributors">
          <h2 id="credits-contributors" className={styles.rowTitle}>Co-developers</h2>
          <div className={styles.body}>
            <p>
              <strong>Participating Mu Alpha Theta National Student Delegates</strong>,
              for their contributions to the question bank.
            </p>
          </div>
        </section>

        <section className={styles.row} aria-labelledby="credits-endorsements">
          <h2 id="credits-endorsements" className={styles.rowTitle}>Endorsements</h2>
          <div className={styles.body}>
            <p className={styles.intro}>Officially endorsed by</p>
            <ul className={styles.endorsers}>
              <li>Mu Alpha Theta National Student Delegates</li>
              <li>Florida Association of Mu Alpha Theta Student Delegates</li>
            </ul>
            <p className={styles.note}>
              These endorsements are from the student delegate groups and do not
              represent an endorsement by Mu Alpha Theta as an organization.
            </p>
          </div>
        </section>

        <section className={styles.row} aria-labelledby="credits-material">
          <h2 id="credits-material" className={styles.rowTitle}>Question material</h2>
          <div className={styles.body}>
            <p>
              Selected questions from Mu Alpha Theta materials are reproduced or
              adapted with written permission from{" "}
              <a href="https://mualphatheta.org/" rel="noreferrer">
                Mu Alpha Theta, the National High School and Two-Year College
                Mathematics Honor Society
              </a>.
            </p>
            <p className={styles.independence}>
              Mathematics Daily is an independent educational project and is not
              affiliated with, sponsored by, or endorsed by Mu Alpha Theta.
            </p>
          </div>
        </section>
      </div>
    </LegalPage>
  );
}

