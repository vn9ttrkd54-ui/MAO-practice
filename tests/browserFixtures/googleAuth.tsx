import { createRoot } from "react-dom/client";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import GoogleSetupForm from "@/components/auth/GoogleSetupForm";
import AccountSettings from "@/components/account/AccountSettings";
import styles from "@/components/auth/auth.module.css";
import ForgotPasswordPage from "@/app/forgot-password/page";

const params=new URLSearchParams(location.search);
const mode=params.get("mode")??"login";
const account=mode.startsWith("account");
const title=mode==="signup"?"Create your account":mode==="setup"?"Choose your username":"Log in to Mathematics Daily";
createRoot(document.getElementById("root")!).render(mode==="forgot" ? <ForgotPasswordPage/> : account
  ? <AccountSettings initialUsername="math_student" initialEmail="private@example.test" emailVerified hasGoogle={mode!=="account-password" || params.get("google")==="linked"} passwordEnabled={mode==="account-password"} googleDeleteVerified={mode==="account-verified"} googleStatus={params.get("google")??undefined} deletionProtected={params.has("protected")} />
  : <main className={`${styles.page} px-6 py-12`}><section className={`${styles.card} mx-auto max-w-lg rounded-lg border p-6`}><h1 className="text-3xl font-bold">{title}</h1>{mode==="signup"?<SignupForm/>:mode==="setup"?<GoogleSetupForm/>:<LoginForm/>}</section></main>);
