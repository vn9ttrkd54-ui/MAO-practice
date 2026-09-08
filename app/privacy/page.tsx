import type { Metadata } from "next";
import Link from "next/link";

import { LegalPage } from "@/components/legal/LegalPage";
import { LEGAL_CONTACT_EMAIL, LEGAL_EFFECTIVE_DATE } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Mathematics Daily",
  description: "How Mathematics Daily collects, uses, shares, and protects information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      summary="This policy explains what information Mathematics Daily handles and the choices available to you."
    >
      <p><strong>Effective date:</strong> {LEGAL_EFFECTIVE_DATE}</p>

      <h2>Who we are</h2>
      <p>Mathematics Daily is an online mathematics practice and multiplayer service. In this policy, “we,” “us,” and “our” refer to Mathematics Daily.</p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account information:</strong> your username, account identifier, password credentials handled by our authentication provider, and an optional recovery email address.</li>
        <li><strong>Learning activity:</strong> answers, attempts, correctness, answer times, bookmarks, level progress, trainer sessions, challenge results, and related statistics.</li>
        <li><strong>Multiplayer activity:</strong> username or guest nickname, room participation, answers, scores, rankings, ratings, connection status, and match results.</li>
        <li><strong>Tutor content:</strong> messages you send to the Llama Tutor, limited recent conversation context, the current math question, and the tutor response.</li>
        <li><strong>Feedback:</strong> suggestions, question reports, and the account associated with a submission.</li>
        <li><strong>Technical information:</strong> IP address, device and browser information, request times, cookies, and security or diagnostic logs that may be processed automatically by our hosting and infrastructure providers.</li>
      </ul>
      <p>Please do not put your real name, contact information, school, location, or other sensitive personal information in your username, multiplayer nickname, tutor messages, or feedback.</p>

      <h2>How we use information</h2>
      <p>We use information to create and secure accounts, save progress, personalize practice, run challenges and multiplayer matches, provide the AI tutor, respond to feedback, prevent abuse, troubleshoot the service, and comply with legal obligations.</p>

      <h2>Legal bases</h2>
      <p>Where data-protection law requires a legal basis, we process information as needed to provide the service you request, based on our legitimate interests in operating and securing the service, to comply with law, and with consent where we specifically request it. You may withdraw consent for future processing when consent is the applicable basis.</p>

      <h2>When information is visible to others</h2>
      <p>Your username, rank, rating, multiplayer score, placement, and related game information may be shown to other players or on leaderboards. Guest nicknames are visible to people in the applicable private room. Do not use a username or nickname that reveals private information.</p>

      <h2>Service providers and disclosures</h2>
      <p>We use service providers to operate Mathematics Daily:</p>
      <ul>
        <li><strong>Supabase</strong> provides authentication, database storage, and real-time features.</li>
        <li><strong>Vercel</strong> hosts and delivers the website and may process technical request logs.</li>
        <li><strong>OpenAI</strong> processes Llama Tutor prompts and responses. We request that responses are not stored as application state, but OpenAI may retain API abuse-monitoring data for up to 30 days under its standard API practices. API content is not used to train OpenAI models unless the account owner separately opts in.</li>
      </ul>
      <p>We may also disclose information when reasonably necessary to comply with law, protect users or the service, investigate abuse, or complete a merger, financing, or transfer of the service with appropriate protections.</p>

      <h2>Cookies and similar storage</h2>
      <p>We use cookies and browser storage that are necessary to keep you signed in, secure sessions, remember game or practice state, and make core features work. We do not currently use advertising cookies or third-party behavioral advertising. Because these technologies are necessary for the service, there is no advertising-cookie consent banner.</p>

      <h2>Sales, targeted advertising, and browser signals</h2>
      <p>We do not sell personal information or share it for cross-context behavioral advertising. We do not currently respond differently to “Do Not Track” browser signals because the service does not use third-party behavioral tracking. Where legally required, we will honor applicable browser-based opt-out preference signals.</p>

      <h2>Retention</h2>
      <p>Account and learning records are generally retained while your account remains active. Multiplayer, feedback, security, and diagnostic records may be kept as reasonably needed to operate, secure, and improve the service. Deleted information may remain temporarily in restricted backups or provider logs before routine deletion. OpenAI’s standard API abuse-monitoring retention is described above.</p>

      <h2>Your choices and rights</h2>
      <p>You can update your username, recovery email, and password or permanently delete your account from <Link href="/account">Account Settings</Link>. Account deletion removes the account and associated records from the active database, subject to limited backup, security, fraud-prevention, and legal retention. Depending on where you live, you may also have rights to access, correct, delete, or receive a copy of personal information and to appeal or complain to a privacy regulator.</p>
      <p>To make a privacy request or ask a question, visit our <Link href="/contact">contact page</Link> or email <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>. We may need to verify that you control the relevant account.</p>

      <h2>Children’s privacy</h2>
      <p>Mathematics Daily accounts are for people age 13 or older. We do not knowingly collect personal information from children under 13 and do not offer a parental-consent process. If you believe a child under 13 has created an account or provided personal information, contact us so we can investigate and delete it.</p>

      <h2>Security and international processing</h2>
      <p>We use administrative, technical, and organizational safeguards designed to protect information, but no online service can guarantee absolute security. Our providers may process information in the United States and other countries where they operate.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy as the service changes. We will revise the effective date and provide additional notice when a change is material and the law requires it.</p>
    </LegalPage>
  );
}
