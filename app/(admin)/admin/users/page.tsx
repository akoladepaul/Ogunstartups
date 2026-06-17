import { prisma } from "@/lib/prisma";
import { formatDate, getInitials } from "@/lib/utils";
import { updateUserRole, deleteUser } from "@/lib/actions/users";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

async function getUsers() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, image: true, role: true, createdAt: true },
  });
}

const roleColors: Record<string, string> = {
  admin: "bg-red-100 text-red-700",
  founder: "bg-brand-green-100 text-brand-green-700",
  viewer: "bg-neutral-100 text-neutral-600",
};

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([getUsers(), auth()]);
  const currentUserId = session?.user?.id;

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
                <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-brand-green-100 flex items-center justify-center text-brand-green-700 text-xs font-bold">
                          {getInitials(user.name ?? "U")}
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-neutral-900">{user.name ?? "—"}</div>
                        {user.id === currentUserId && (
                          <div className="text-xs text-brand-green-600 font-medium">You</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleColors[user.role] ?? "bg-neutral-100 text-neutral-600"}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500 text-xs">{formatDate(user.createdAt.toISOString())}</td>
                  <td className="px-4 py-3">
                    {user.id !== currentUserId && (
                      <div className="flex items-center gap-2">
                        {user.role !== "admin" ? (
                          <form action={async () => { "use server"; await updateUserRole(user.id, "admin"); }}>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              Make Admin
                            </Button>
                          </form>
                        ) : (
                          <form action={async () => { "use server"; await updateUserRole(user.id, "founder"); }}>
                            <Button size="sm" variant="outline" className="h-7 text-xs">
                              Revoke Admin
                            </Button>
                          </form>
                        )}
                        <form action={async () => { "use server"; await deleteUser(user.id); }}>
                          <Button size="sm" variant="destructive" className="h-7 text-xs">
                            Delete
                          </Button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
