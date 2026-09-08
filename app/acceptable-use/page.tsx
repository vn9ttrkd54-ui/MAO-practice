import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal/LegalPage";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Acceptable Use Policy | Mathematics Daily",
  description: "Rules that help keep Mathematics Daily fair, safe, and reliable.",
};

export default function AcceptableUsePage() {
  return (
    <LegalPage title="Acceptable Use Policy" summary="Use Mathematics Daily in a way that is lawful, fair, and respectful of other learners.">
      <p><strong>Effective date:</strong> {LEGAL_EFFECTIVE_DATE}</p>
      <h2>Do not use the service to</h2>
      <ul>
        <li>break the law, violate another person’s rights, threaten, harass, impersonate, or discriminate against anyone;</li>
        <li>post usernames, nicknames, tutor messages, or feedback containing personal information, sexual content, hateful content, threats, or abusive language;</li>
        <li>cheat in multiplayer, manipulate scores or timing, collude unfairly, use unauthorized assistance, or operate bots or automated players;</li>
        <li>probe, scan, bypass, overload, disrupt, or exploit the service, its rate limits, security controls, databases, or providers;</li>
        <li>access another person’s account, share stolen credentials, introduce malicious code, scrape content or user data, or reverse engineer protected parts of the service;</li>
        <li>use the AI tutor to obtain prohibited, harmful, or unrelated content or to evade its educational safeguards; or</li>
        <li>use Mathematics Daily content or tutor output to train models, build a competing question bank, or commercially redistribute material without permission.</li>
      </ul>
      <h2>Enforcement</h2>
      <p>We may remove content, invalidate results, limit features, suspend accounts, preserve evidence, or report conduct when reasonably necessary to protect users, fair play, or the service. Enforcement decisions may consider severity, repetition, intent, and risk.</p>
      <h2>Report a problem</h2>
      <p>Use the in-question report control or our <Link href="/contact">contact page</Link> to report abuse, a security concern, or an incorrect question.</p>
    </LegalPage>
  );
}
