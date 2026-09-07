import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminUsers, getAdminUserDetails, requireUsersAdmin } from "@/lib/services/adminUsersService";
import { getMultiplayerSummary } from "@/lib/multiplayerSummary";
export const dynamic = "force-dynamic";
const date=(value:string|null)=>value?new Date(value).toLocaleString("en-US",{timeZone:"UTC"}):"No recorded activity";
export default async function AdminUserPage({ params }: { params: Promise<{id:string}> }) {
  await requireUsersAdmin();
  const {id}=await params;
  if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(id)) notFound();
  const {users}=await getAdminUsers({userId:id});
  const user=users[0]; if(!user) notFound();
  const {byDivision,matches}=await getAdminUserDetails(id);
  return <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-900"><div className="mx-auto max-w-5xl">
    <Link href="/admin/users" className="font-semibold text-blue-600">← Users</Link>
    <header className="my-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-7"><p className="text-sm font-semibold uppercase text-blue-600">{user.role} · Read-only</p><h1 className="mt-2 break-all text-4xl font-bold">{user.username}</h1><p className="mt-3 text-sm text-slate-500">Joined {date(user.created_at)} UTC · Last recorded activity: {date(user.last_active)}{user.last_active ? " UTC" : ""}</p></header>
    <dl className="grid gap-4 sm:grid-cols-2">{[
      ["RP / rank",`${user.rp} · ${getMultiplayerSummary({rp:user.rp}).rank}`],
      ["Ranked multiplayer",`${user.ranked_matches} matches · ${user.ranked_wins} wins`],
      ["Daily streak",`${user.current_streak} days · best ${user.longest_streak}`],
      ["Practice",`${user.practice_attempts} attempts · ${user.practice_attempts ? Math.round(user.practice_correct/user.practice_attempts*100)+'% accuracy' : 'no attempts'}`],
    ].map(([label,value])=><div key={label} className="rounded-2xl border border-slate-200 bg-white p-5"><dt className="text-sm text-slate-500">{label}</dt><dd className="mt-2 text-xl font-bold">{value}</dd></div>)}</dl>
    <section className="mt-8"><h2 className="text-2xl font-bold">Practice by division</h2><div className="mt-4 grid gap-4 sm:grid-cols-3">{Object.entries(byDivision).map(([division,stats])=><article key={division} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-bold">{division}</h3><p className="mt-2">{stats.attempts} attempts</p><p className="text-sm text-slate-500">{stats.attempts ? `${Math.round(stats.correct/stats.attempts*100)}% accuracy` : 'No attempts yet'}</p></article>)}</div></section>
    <section className="mt-8"><h2 className="text-2xl font-bold">Recent multiplayer results</h2><ol className="mt-4 space-y-3">{matches.map((match,i)=><li key={i} className="flex flex-wrap justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"><span>{date(match.finalized_at)} UTC</span><span>#{match.placement} · {match.final_score} points</span><span>{match.ranked && match.new_rp!==null && match.previous_rp!==null ? `${match.new_rp-match.previous_rp>=0?'+':''}${match.new_rp-match.previous_rp} RP` : 'Unranked'}</span></li>)}</ol>{!matches.length?<p className="mt-4 text-slate-500">No completed multiplayer matches.</p>:null}</section>
  </div></main>;
}
