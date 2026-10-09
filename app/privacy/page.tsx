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
      <p><strong>Last updated:</strong> October 9, 2026</p>

      <h2>Who we are</h2>
      <p>Mathematics Daily is an online mathematics practice and multiplayer service for high-school math competitors, coaches, and teachers age 13 or older. In this policy, “we,” “us,” and “our” refer to Mathematics Daily.</p>

      <h2>Information we collect</h2>
      <ul>
        <li><strong>Account information:</strong> your username, account identifier, password credentials handled by our authentication provider, and an optional recovery email address. If you choose Google sign-in, our authentication provider receives your Google account identifier, email address, and basic profile information. Your Google name and email are not used as your public username.</li>
        <li><strong>Learning activity:</strong> answers, attempts, correctness, answer times, bookmarks, level progress, trainer sessions, challenge results, and related statistics.</li>
        <li><strong>Multiplayer activity:</strong> username or guest nickname, room participation, answers, scores, rankings, ratings, connection status, and match results.</li>
        <li><strong>Tutor content:</strong> messages you send to the Llama Tutor, limited recent conversation context, the current math question, and the tutor response.</li>
        <li><strong>Feedback:</strong> suggestions, question reports, and the account associated with a submission.</li>
        <li><strong>Safety and moderation information:</strong> privacy or safety reports, account identifiers, usernames, moderation reasons, and records of administrative actions.</li>
        <li><strong>Technical information:</strong> IP address, device and browser information, request times, cookies, and security or diagnostic logs that may be processed automatically by our hosting and infrastructure providers.</li>
      </ul>
      <p>Please do not put your real name, contact information, school, location, or other sensitive personal information in your username, multiplayer nickname, tutor messages, or feedback.</p>

      <h2>How we use information</h2>
      <p>We use information to create and secure accounts, save progress, personalize practice, run challenges and multiplayer matches, provide the AI tutor, respond to feedback, understand website usage, prevent abuse, troubleshoot the service, and comply with legal obligations.</p>

      <h2>Legal bases</h2>
      <p>Where data-protection law requires a legal basis, we process information as needed to provide the service you request, based on our legitimate interests in operating and securing the service, to comply with law, and with consent where we specifically request it. You may withdraw consent for future processing when consent is the applicable basis.</p>

      <h2>When information is visible to others</h2>
      <p>Your username, rank, rating, multiplayer score, placement, and related game information may be shown to other players or on leaderboards. Guest nicknames are visible to people in the applicable private room. Do not use a username or nickname that reveals private information.</p>

      <h2>Guest multiplayer</h2>
      <p>You can join a private multiplayer room as a guest without creating an account. The same eligibility requirements in our <Link href="/terms">Terms of Service</Link> apply to guest players. The guest join form asks for a room code and nickname, not an email address, password, or date of birth. The join page displays our minimum-age requirement and links to the Terms of Service and this Privacy Policy. By joining, players confirm that they are 13 or older; this confirmation does not verify their age or provide parental consent.</p>
      <p>We store your guest nickname, room participation, answers, correctness, answer times, scores, placement, and connection status to admit you to the room, synchronize play, calculate results, and protect the game from abuse. Your nickname, score, placement, and game status can be shown to other players in that room. Please use a nickname that does not contain your real name, email address, phone number, school, location, or other personal information.</p>
      <p>We also create a random, room-specific reconnect token. Your browser stores it in an HTTP-only cookie that expires after 24 hours, and our database stores a hash of the token. We use this token to authenticate and reconnect you to that room, not for advertising, contacting you, or building a profile across rooms. Guest records are not copied into account match history. Website analytics and technical processing by our service providers, described below, also apply when you play as a guest.</p>

      <h2>Service providers and disclosures</h2>
      <p>We use service providers to operate Mathematics Daily:</p>
      <ul>
        <li><strong>Supabase</strong> provides authentication, database storage, and real-time features.</li>
        <li><strong>Google</strong> verifies your Google account when you choose Google sign-in or connect Google to an existing account.</li>
        <li><strong>Vercel</strong> hosts and delivers the website, may process technical request logs, and provides the website analytics described below.</li>
        <li><strong>OpenAI</strong> processes Llama Tutor prompts and responses. We request that responses are not stored as application state, but OpenAI may retain API abuse-monitoring data for up to 30 days under its standard API practices. API content is not used to train OpenAI models unless the account owner separately opts in.</li>
      </ul>
      <p>We may also disclose information when reasonably necessary to comply with law, protect users or the service, investigate abuse, or complete a merger, financing, or transfer of the service with appropriate protections.</p>

      <h2>Website analytics</h2>
      <p>We use Vercel Web Analytics to measure visits and understand which pages are used so we can improve the website. Vercel provides aggregated usage statistics, such as page views, referring websites, approximate location, and browser and device information. The service does not use third-party cookies or track visitors across different websites. It uses a temporary visitor identifier derived from incoming requests, which Vercel discards after 24 hours; this does not mean all aggregated analytics statistics are deleted after 24 hours. See <a href="https://vercel.com/docs/analytics/privacy-policy">Vercel&apos;s analytics privacy documentation</a> for more information.</p>
      <p>For page URLs sent to analytics, we remove query strings and fragments and replace multiplayer room identifiers with placeholders. We also exclude account-settings pages, administrative pages, password-reset pages, API routes, and pages under /auth from analytics page-view collection.</p>

      <h2>Cookies and similar storage</h2>
      <p>We use cookies and browser storage that are necessary to keep you signed in, secure sessions, remember game or practice state, and make core features work. The website analytics described above does not use third-party cookies. We do not currently use advertising cookies or third-party behavioral advertising.</p>

      <h2>Sales, targeted advertising, and browser signals</h2>
      <p>We do not sell personal information or share it for cross-context behavioral advertising. We do not currently respond differently to “Do Not Track” browser signals because the service does not use third-party behavioral tracking. Where legally required, we will honor applicable browser-based opt-out preference signals.</p>

      <h2>Retention</h2>
      <p>Account, learning, and account match-history records are generally retained while your account remains active. Feedback, security, and diagnostic records may be kept as reasonably needed to operate, secure, and improve the service or meet legal obligations.</p>
      <p>Private moderation audit records contain account identifiers, usernames, the action, its time, and a limited reason. We use them to review administrative decisions, handle disputes, and investigate abuse. Routine audit records become eligible for deletion 90 days after the action; an hourly background job removes eligible records in capped batches. Backlogs or service interruptions can delay removal. Active suspension and required-name-change settings are separate from historical audit records and remain in effect while needed for an existing account.</p>
      <p>Deleting an account automatically removes audit records about that account from the active database. If the deleted account acted as a moderator for another account, we remove its moderator identifier and replace the related free-text reason with a neutral deletion notice; the other account&apos;s record still follows the 90-day schedule. This applies to self-deletion and operator-handled deletion, including known under-13 accounts. Reports, emails, and provider or backup copies still require the separate review described below.</p>
      <p>A separate, restricted security receipt contains a random request identifier, cryptographic request fingerprint, hashed moderator identifier, and timestamps, but no username, original reason text, or raw account identifier. It lets us recognize a repeated moderation request and enforce action limits even after audit data is removed. These receipts are pseudonymous, not necessarily anonymous. They expire 24 hours after the action, cannot authorize a replay after expiry, and become eligible for removal by the hourly cleanup job. Deleting a moderator&apos;s account also removes its receipts. We do not use these receipts for advertising or public profiles.</p>
      <p>Any separate retention needed for a specific legal obligation or necessary, legally permitted security case must have a documented purpose, restricted access, and an expiry or review date. It is not a blanket exception permitting indefinite storage. Known under-13 information is not automatically retained for the full routine audit period.</p>
      <p>Guest multiplayer records are tied to the room, rather than a permanent guest account. Deleting a room removes its guest-player records, reconnect-token hashes, answer submissions, and room results from the active database. A completed room can be deleted once all remaining players acknowledge receipt of the finalized results. Our cleanup job is also scheduled to run every minute, with rooms becoming eligible for removal as follows:</p>
      <ul>
        <li><strong>Finalized results:</strong> two minutes after the results are finalized.</li>
        <li><strong>Inactive private waiting rooms:</strong> one hour after room creation, provided no remaining connected player has updated their connection within the past 10 minutes. This also applies during the countdown.</li>
        <li><strong>Unfinished rooms or results:</strong> two hours after a match starts, or two hours after completion if its results have not been finalized.</li>
        <li><strong>Cancelled rooms:</strong> one hour after the room&apos;s last update.</li>
      </ul>
      <p>Cleanup runs in batches, so these are eligibility thresholds, not guaranteed deletion deadlines; backlogs or service interruptions can delay removal. The browser&apos;s 24-hour reconnect-cookie expiry is separate from room-data cleanup. A deleted room cannot be rejoined using an unexpired cookie.</p>
      <p>Active-database deletion does not immediately erase copies in restricted backups or provider security and diagnostic logs. Those copies follow the applicable provider&apos;s retention and deletion processes, not the room-cleanup schedule. Aggregated website analytics are handled separately as described above. OpenAI&apos;s standard API abuse-monitoring retention is also described above.</p>

      <h2>Your choices and rights</h2>
      <p>You can update your username, recovery email, and password or permanently delete your account from <Link href="/account">Account Settings</Link>. Account deletion removes the account and associated records from the active database, subject to limited backup, security, fraud-prevention, and legal retention. Depending on where you live, you may also have rights to access, correct, delete, or receive a copy of personal information and to appeal or complain to a privacy regulator.</p>
      <p>To make a privacy request or ask a question, visit our <Link href="/contact">contact page</Link> or email <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>. We may need to verify that you control the relevant account.</p>

      <h2>Children’s privacy</h2>
      <p>Mathematics Daily is intended for people age 13 or older, including guest players, as required by our <Link href="/terms">Terms of Service</Link>. We do not knowingly collect personal information from children under 13 and do not offer a parental-consent process. A parent&apos;s or teacher&apos;s permission does not make an under-13 player eligible to use this service.</p>
      <p>If you believe an account holder or guest player is under 13, use our <Link href="/contact#underage-player">under-13 reporting instructions</Link> or email <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>. You do not need an account to report a concern. Please identify the account username, or the guest nickname and room code or room link, without sending the child&apos;s date of birth, identity documents, or other sensitive information.</p>
      <p>We investigate reports and, when we learn that a player is under 13, act to stop their participation and delete their associated personal information from our active systems, subject only to limited retention necessary and permitted by applicable law. Removing a guest&apos;s room record invalidates its reconnect token and removes its associated answers and results. We also review moderation records, relevant service-provider records, and restricted backup copies under the applicable retention and deletion processes described above. These are operator-handled actions, not automatic age detection. Hosts must not invite or readmit players they know are under 13.</p>

      <h2>Security and international processing</h2>
      <p>We use administrative, technical, and organizational safeguards designed to protect information, but no online service can guarantee absolute security. Our providers may process information in the United States and other countries where they operate.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy as the service changes. We will revise the effective date and provide additional notice when a change is material and the law requires it.</p>
    </LegalPage>
  );
}
