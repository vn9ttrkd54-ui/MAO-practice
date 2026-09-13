import type { Metadata } from "next";

import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Credits | Mathematics Daily",
  description: "Acknowledgments for educational material used by Mathematics Daily.",
};

export default function CreditsPage() {
  return (
    <LegalPage
      title="Credits"
      summary="Acknowledgments for educational material used by Mathematics Daily."
    >
      <h2>Question material</h2>
      <p>
        Selected questions from Mu Alpha Theta materials are reproduced or
        adapted with written permission from{" "}
        <a href="https://mualphatheta.org/" rel="noreferrer">
          Mu Alpha Theta, the National High School and Two-Year College
          Mathematics Honor Society
        </a>.
      </p>
      <p>
        Mathematics Daily is an independent educational project and is not
        affiliated with, sponsored by, or endorsed by Mu Alpha Theta.
      </p>
    </LegalPage>
  );
}

