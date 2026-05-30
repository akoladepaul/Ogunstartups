import { adminClient } from "@/lib/supabase/admin";
import { formatDate, getInitials } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

async function getUsers() {
  const { data } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-700",
    founder: "bg-brand-green-100 text-brand-green-700",
    viewer: "bg-neutral-100 text-neutral-600",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Users</h1>
        <span className="text-sm text-neutral-500">{users.length} registered</span>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-100">
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">User</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Role</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 text-xs font-bold">
                          {getInitials(user.full_name ?? "U")}
                        </div>
                      )}
                      <span className="font-medium text-neutral-900">{user.full_name ?? "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleColors[user.role] ?? "bg-neutral-100 text-neutral-600"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
