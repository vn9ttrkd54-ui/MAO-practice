import Link from "next/link";
import { getAdminUsers } from "@/lib/services/adminUsersService";
import { getMultiplayerSummary } from "@/lib/multiplayerSummary";

export const dynamic = "force-dynamic";
const date = (value: string | null) => value ? new Date(value).toLocaleDateString("en-US",{timeZone:"UTC"}) : "No recorded activity";
export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string; sort?: string; page?: string }> }) {
  const params=await searchParams;
  const search=(params.q ?? "").slice(0,100);
  const role=["owner","admin","user"].includes(params.role ?? "") ? params.role! : "";
  const sort=["activity","rp","joined","username"].includes(params.sort ?? "") ? params.sort! : "activity";
  const page=Math.min(1000000,Math.max(1,Number.parseInt(params.page ?? "1",10)||1));
  const result=await getAdminUsers({search,role,sort,page});
  const href=(n:number)=>`/admin/users?${new URLSearchParams({q:search,role,sort,page:String(n)})}`;
  return <main className="min-h-screen bg-slate-100 px-5 py-10 text-slate-900"><div className="mx-auto max-w-7xl">
    <Link href="/admin/feedback" className="font-semibold text-blue-600">← Admin tools</Link>
    <header className="my-6 rounded-3xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-7 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Read-only · Owner & admin</p>
      <h1 className="mt-2 text-4xl font-bold">Users</h1>
      <p className="mt-3 text-slate-600">{result.total} matching accounts. Last active reflects recorded practice, challenges, or multiplayer activity—not online status. Dates are UTC.</p>
    </header>
    <form className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-slate-200 bg-white p-5">
      <label className="flex-1 font-semibold">Username<input name="q" defaultValue={search} maxLength={100} placeholder="Search username" className="mt-2 block w-full rounded-lg border border-slate-300 p-3" /></label>
      <label className="font-semibold">Role<select name="role" defaultValue={role} className="mt-2 block rounded-lg border border-slate-300 p-3"><option value="">All roles</option><option value="owner">Owner</option><option value="admin">Admin</option><option value="user">User</option></select></label>
      <label className="font-semibold">Sort by<select name="sort" defaultValue={sort} className="mt-2 block rounded-lg border border-slate-300 p-3"><option value="activity">Last active</option><option value="rp">RP</option><option value="joined">Newest accounts</option><option value="username">Username</option></select></label>
      <button className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white">Apply</button>
    </form>
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="w-full text-left text-sm">
      <caption className="sr-only">Registered users and activity statistics</caption>
      <thead className="bg-slate-50"><tr>{["Username","Role","Joined","Last active","RP / rank","Ranked matches","Win rate","Daily streak"].map(label=><th key={label} scope="col" className="whitespace-nowrap p-4">{label}</th>)}</tr></thead>
      <tbody>{result.users.map(user=><tr key={user.id} className="border-t border-slate-100 hover:bg-blue-50/40">
        <td className="p-4"><Link className="font-semibold text-blue-700 underline" href={`/admin/users/${user.id}`}>{user.username}</Link></td>
        <td className="p-4 capitalize">{user.role}</td><td className="p-4 whitespace-nowrap">{date(user.created_at)}</td><td className="p-4 whitespace-nowrap">{date(user.last_active)}</td>
        <td className="p-4 whitespace-nowrap">{user.rp} · {getMultiplayerSummary({rp:user.rp}).rank}</td><td className="p-4">{user.ranked_matches}</td>
        <td className="p-4">{user.ranked_matches ? `${Math.round(user.ranked_wins/user.ranked_matches*100)}%` : "—"}</td><td className="p-4 whitespace-nowrap">{user.current_streak} days · best {user.longest_streak}</td>
      </tr>)}</tbody>
    </table>{!result.users.length ? <p className="p-8 text-center text-slate-500">No users found.</p> : null}</div>
    <nav aria-label="User pages" className="mt-5 flex items-center justify-between">{page>1 ? <Link href={href(page-1)} className="font-semibold text-blue-600">← Previous</Link> : <span />}
      <span>Page {page} of {Math.max(1,Math.ceil(result.total/50))}</span>{page*50<result.total ? <Link href={href(page+1)} className="font-semibold text-blue-600">Next →</Link> : <span />}
    </nav>
  </div></main>;
}
