import "server-only";
import { redirect } from "next/navigation";
import { hasAdminAccess } from "@/lib/auth/roles";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { questions } from "@/data/questions";

// Shared immutable catalog metadata; user statistics are still fetched per request.
const questionDivisions = new Map(questions.map(question => [question.id, question.division]));

export interface AdminUser {
  id: string; username: string; role: string; created_at: string; last_active: string | null;
  rp: number; ranked_matches: number; ranked_wins: number; current_streak: number;
  longest_streak: number; practice_attempts: number; practice_correct: number;
}
export async function requireUsersAdmin() {
  const db = await createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data, error } = await db.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (error) throw new Error("Unable to verify administrator access.");
  if (!hasAdminAccess(data?.role)) redirect("/dashboard");
  return db;
}
export async function getAdminUsers({ search = "", role = "", sort = "activity", page = 1, userId = null }: { search?: string; role?: string; sort?: string; page?: number; userId?: string | null } = {}) {
  const db = await requireUsersAdmin();
  const { data, error } = await db.rpc("get_admin_users", { p_search: search.slice(0,100), p_role: role, p_sort: sort, p_page: page, p_user_id: userId });
  if (error) throw new Error("Unable to load users. Check that the admin users database migration has been applied.");
  return data as { total: number; users: AdminUser[] };
}
export async function getAdminUserDetails(userId: string) {
  await requireUsersAdmin();
  const db = createAdminClient();
  const byDivision: Record<string, { attempts: number; correct: number }> = {
    Mu: { attempts: 0, correct: 0 }, Alpha: { attempts: 0, correct: 0 }, Theta: { attempts: 0, correct: 0 },
  };
  for (let offset=0;;offset+=1000) {
    const { data, error } = await db.from("question_progress").select("question_id,attempts,correct").eq("user_id",userId).order("question_id").range(offset,offset+999);
    if(error) throw new Error("Unable to load practice statistics.");
    for(const row of data ?? []) {
      const division=questionDivisions.get(row.question_id) ?? "Other / removed";
      byDivision[division] ??= { attempts:0,correct:0 };
      byDivision[division].attempts+=row.attempts; byDivision[division].correct+=row.correct;
    }
    if((data?.length ?? 0)<1000) break;
  }
  const { data: matches, error } = await db.from("multiplayer_match_history").select("placement,final_score,ranked,previous_rp,new_rp,finalized_at").eq("user_id",userId).order("finalized_at",{ascending:false}).limit(10);
  if(error) throw new Error("Unable to load recent matches.");
  return { byDivision,matches:matches ?? [] };
}
