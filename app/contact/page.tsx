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
      <p>For a privacy request, identify the relevant username and describe the right you want to exercise. To report an account belonging to a child under 13, include the username and your relationship to the child. We may ask for reasonable verification before acting.</p>
      <h2>Questions and suggestions</h2>
      <p>Signed-in users can also use the <Link href="/suggestions/new">suggestions form</Link>. Incorrect math questions can be reported directly from the question page.</p>
      <h2>Security reports</h2>
      <p>Describe the suspected issue and steps to reproduce it. Do not access other users’ data, disrupt the service, or publicly disclose an unresolved vulnerability.</p>
    </LegalPage>
  );
}
