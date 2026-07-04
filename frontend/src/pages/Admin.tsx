import { Cpu, Database, Lock, Plug, ShieldCheck, Users } from "lucide-react";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import { mockUsers } from "../services/api";

const statusCards = [
  {
    label: "AI Gateway",
    value: "Operational",
    detail: "1.2s average response",
    icon: Cpu,
  },
  {
    label: "Vector Storage",
    value: "74% Used",
    detail: "1.8 TB of 2.4 TB",
    icon: Database,
  },
  {
    label: "Access Control",
    value: "Enforced",
    detail: "SSO and RBAC active",
    icon: Lock,
  },
  {
    label: "Connected Services",
    value: "7 Online",
    detail: "Drive, Slack, Notion, Jira",
    icon: Plug,
  },
];

export default function Admin() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="mt-2 text-zinc-400 light:text-slate-500">
          Manage system health, access, services, and enterprise controls.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statusCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label}>
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-violet-500/15 p-2 text-violet-300">
                  <Icon size={20} />
                </div>
                <Badge tone="green">OK</Badge>
              </div>
              <p className="mt-4 text-sm text-zinc-400 light:text-slate-500">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-bold">{card.value}</p>
              <p className="mt-2 text-sm text-zinc-500 light:text-slate-500">
                {card.detail}
              </p>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-300" />
            <h2 className="text-lg font-semibold">AI Status</h2>
          </div>
          <div className="mt-5 space-y-4">
            {[
              ["Retrieval pipeline", "Healthy"],
              ["Embedding model", "Healthy"],
              ["Citation verifier", "Healthy"],
              ["PII redaction", "Healthy"],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 light:text-slate-600">
                  {label}
                </span>
                <Badge tone="green">{status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center gap-2">
            <Users size={20} className="text-violet-300" />
            <h2 className="text-lg font-semibold">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-zinc-500 light:text-slate-500">
                <tr>
                  <th className="py-3">User</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Department</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 light:divide-slate-200">
                {mockUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="py-4">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </td>
                    <td className="py-4 text-zinc-400 light:text-slate-600">{user.role}</td>
                    <td className="py-4 text-zinc-400 light:text-slate-600">
                      {user.department}
                    </td>
                    <td className="py-4">
                      <Badge tone={user.status === "Active" ? "green" : "amber"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 text-zinc-400 light:text-slate-600">
                      {user.lastActive}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
