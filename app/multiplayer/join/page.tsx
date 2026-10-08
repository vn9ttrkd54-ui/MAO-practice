import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, KeyRound, ShieldCheck } from "lucide-react";

import { joinPrivateRoomAction } from "@/app/multiplayer/actions";
import PendingSubmitButton from "@/components/multiplayer/PendingSubmitButton";
import { createClient } from "@/lib/supabase/server";
import styles from "./join.module.css";

export const metadata: Metadata = {
  title: "Join Private Room | Mathematics Daily",
};

interface JoinPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function JoinPrivateRoomPage({ searchParams }: JoinPageProps) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <Link href="/multiplayer" className={styles.back}>
          <ArrowLeft size={17} aria-hidden="true" /> Match Lobby
        </Link>
        <section className={styles.panel} aria-labelledby="join-heading">
          <header className={styles.header}>
            <span className={styles.icon}><KeyRound size={24} aria-hidden="true" /></span>
            <div>
              <h1 id="join-heading">Join private room</h1>
              <p>Enter the code shared by your host.</p>
            </div>
          </header>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <form action={joinPrivateRoomAction} className={styles.form}>
            <div className={styles.fields}>
              <label className={styles.field}>
                Room code
                <input
                  name="code"
                  required
                  minLength={8}
                  maxLength={8}
                  autoCapitalize="characters"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="ABCD2345"
                  className={styles.code}
                />
              </label>
              {!user ? (
                <label className={styles.field}>
                  Guest nickname
                  <input
                    name="guestNickname"
                    required
                    minLength={1}
                    maxLength={20}
                    autoComplete="off"
                    placeholder="MathPlayer"
                    aria-describedby="nickname-notice"
                  />
                </label>
              ) : null}
            </div>
            {!user ? <p id="nickname-notice" className={styles.note}>Use a nickname, not your real name or contact information.</p> : null}
            <div className={styles.eligibility} id="join-eligibility">
              <ShieldCheck size={18} aria-hidden="true" />
              <div>
                <p><strong>You must be 13 or older to play, including as a guest.</strong></p>
                <p>By joining, you confirm that you are 13 or older and agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
              </div>
            </div>
            <PendingSubmitButton
              name="ageConfirmation"
              value="13-or-older"
              pendingText="Joining room..."
              aria-describedby="join-eligibility"
              className={styles.submit}
            >
              Join Room <ArrowRight size={18} aria-hidden="true" />
            </PendingSubmitButton>
          </form>
        </section>
      </div>
    </main>
  );
}
