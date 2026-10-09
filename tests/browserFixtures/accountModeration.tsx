import { createRoot } from "react-dom/client";
import AccountModerationPanel from "@/components/admin/AccountModerationPanel";
import RequiredNameChangeForm from "@/components/auth/RequiredNameChangeForm";

const mode=new URLSearchParams(location.search).get("mode")??"admin";
const id="00000000-0000-4000-8000-000000000002";
createRoot(document.getElementById("root")!).render(<main className="min-h-screen bg-blue-50 px-5 py-8 text-slate-900"><div className="mx-auto max-w-3xl">
  <h1 className="text-3xl font-bold">{mode==="rename"?"Choose a new username":"Test student"}</h1>
  {mode==="rename" ? <RequiredNameChangeForm/> : <AccountModerationPanel targetId={id} targetRole={mode==="protected"?"owner":"user"}
    actorId="00000000-0000-4000-8000-000000000001" actorRole={mode==="owner"?"owner":"admin"} googleOnly={mode==="google"}
    state={{version:7,suspended:mode==="suspended",requires_name_change:mode==="pending",previous_login_username:mode==="pending"?"ordinary_test_name":null}}
    audit={[{request_id:"fixture",actor_id:null,action:"restore",reason:"<script>must render as text</script>",created_at:"2026-10-06T12:00:00Z"}]}/>}
</div></main>);
