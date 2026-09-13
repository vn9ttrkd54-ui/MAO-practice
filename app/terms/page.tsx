import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal/LegalPage";
import { LEGAL_CONTACT_EMAIL, LEGAL_EFFECTIVE_DATE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service | Mathematics Daily",
  description: "Terms governing use of Mathematics Daily.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" summary="These terms are the rules for using Mathematics Daily. Please read them before creating an account.">
      <p><strong>Effective date:</strong> {LEGAL_EFFECTIVE_DATE}</p>

      <h2>Agreement and eligibility</h2>
      <p>By creating an account or using Mathematics Daily, you agree to these Terms and our <Link href="/privacy">Privacy Policy</Link>. You must be at least 13 years old. If you are not old enough to enter a binding agreement where you live, a parent or legal guardian must review and agree to these Terms for you.</p>

      <h2>The service</h2>
      <p>Mathematics Daily provides math questions, practice tools, progress tracking, challenges, multiplayer games, and an AI tutor. Features may change, be limited, or be discontinued. We may perform maintenance or experience outages.</p>

      <h2>Accounts</h2>
      <p>Provide accurate eligibility information, keep your password confidential, and use only accounts you are authorized to use. You are responsible for activity under your account. Usernames and multiplayer nicknames must follow our <Link href="/acceptable-use">Acceptable Use Policy</Link>. You may delete your account in Account Settings.</p>

      <h2>Educational and AI limitations</h2>
      <p>The service is for practice and general educational support. It is not a substitute for a teacher, school, test administrator, or professional advice. Questions, solutions, scoring, adaptive recommendations, and AI tutor responses may contain mistakes. Check important work independently and report suspected errors. Do not rely on Mathematics Daily for official grades, admissions, placement, or other high-stakes decisions.</p>

      <h2>Fair play</h2>
      <p>Do not cheat, coordinate answers unfairly, manipulate timers or scores, automate play, exploit bugs, interfere with another player, or misrepresent results. We may correct or remove scores, ratings, or records affected by errors, abuse, or unfair play.</p>

      <h2>Ownership</h2>
      <p>The service’s software, design, and branding are protected by intellectual-property laws. We grant you a limited, personal, nonexclusive, nontransferable, revocable right to use the service for lawful educational purposes. You may not copy, scrape, republish, sell, or reverse engineer protected parts of the service except where applicable law permits it.</p>

      <h2>Your submissions</h2>
      <p>You keep ownership of content you submit, such as feedback. You give us a worldwide, nonexclusive, royalty-free license to host, process, reproduce, and use that content only as reasonably needed to operate, secure, support, and improve the service. Do not submit content you lack permission to share.</p>

      <h2>Suspension and termination</h2>
      <p>We may restrict or terminate access when we reasonably believe you violated these Terms, created risk or legal exposure, abused the service, or threatened its operation or users. You may stop using the service and delete your account at any time.</p>

      <h2>Disclaimers</h2>
      <p>To the fullest extent permitted by law, the service is provided “as is” and “as available.” We disclaim implied warranties, including merchantability, fitness for a particular purpose, and noninfringement. We do not promise uninterrupted availability, perfect accuracy, or that every defect will be corrected. Nothing in these Terms excludes warranties or rights that cannot legally be excluded.</p>

      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, Mathematics Daily is not responsible for indirect or consequential losses resulting from use of the service. Nothing in these Terms limits liability that cannot legally be limited.</p>

      <h2>Changes and general terms</h2>
      <p>We may update these Terms and will revise the effective date. Material changes will receive additional notice when required. If one provision is unenforceable, the remaining provisions remain effective. Our failure to enforce a provision is not a waiver. You may not transfer these Terms without our permission; we may transfer them as part of a reorganization or transfer of the service.</p>

      <h2>Contact</h2>
      <p>Questions about these Terms can be sent to <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a> or submitted through our <Link href="/contact">contact page</Link>.</p>
    </LegalPage>
  );
}
