import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal/LegalPage";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Contact | Mathematics Daily",
  description: "Contact Mathematics Daily about privacy, safety, legal, or support matters.",
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact" summary="Reach Mathematics Daily about privacy, safety, legal, account, or service questions.">
      <h2>Email</h2>
      <p>Email <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>. Include enough detail for us to understand the request, but do not send your password or other sensitive information.</p>
      <h2>Privacy and child safety</h2>
      <p>For a privacy request, identify the relevant account or guest participation and describe your request. We may ask for reasonable verification before disclosing information or making account changes.</p>
      <h2 id="underage-player" className="scroll-mt-28">Report an under-13 player</h2>
      <p>Our age requirement applies to accounts and guests. You can <a href={`mailto:${LEGAL_CONTACT_EMAIL}?subject=Under-13%20player%20report`}>email an under-13 player report</a> without signing in. Include the account username, or the guest nickname and private room code or room link. If available, include the approximate date and time of play, why you believe the player is under 13, and your relationship to the player.</p>
      <p>Do not send a password, date of birth, identity document, or the child&apos;s real name, address, school, or contact details. We investigate reports and act to stop known under-13 participation and remove associated personal information. Please do not invite or readmit someone you know is under 13.</p>
      <h2>Questions and suggestions</h2>
      <p>Signed-in users can also use the <Link href="/suggestions/new">suggestions form</Link>. Incorrect math questions can be reported directly from the question page.</p>
      <h2>Security reports</h2>
      <p>Describe the suspected issue and steps to reproduce it. Do not access other users’ data, disrupt the service, or publicly disclose an unresolved vulnerability.</p>
    </LegalPage>
  );
}
