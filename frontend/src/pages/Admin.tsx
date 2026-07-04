import { Cpu, Database, Lock, Plug, ShieldCheck, Users } from "lucide-react";
import Badge from "../components/common/Badge";
import Card from "../components/common/Card";
import MetricCard from "../components/dashboard/MetricCard";
import { mockUsers } from "../services/api";

const statusCards = [
  ["AI Gateway", "Operational", "1.2s average response", Cpu],
  ["Vector Storage", "74% Used", "1.8 TB of 2.4 TB", Database],
  ["Access Control", "Enforced", "SSO and RBAC active", Lock],
  ["Connected Services", "7 Online", "Drive, Slack, Notion, Jira", Plug],
] as const;

export default function Admin() {
  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-white/10 bg-[#111118] p-8 shadow-2xl shadow-violet-950/20 light:border-slate-200 light:bg-white">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 light:text-violet-700">
          <ShieldCheck size={16} />
          Enterprise controls
        </div>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight">Admin Console</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400 light:text-slate-600">
          Manage platform health, access, storage, connected services, and AI
          governance from one operating console.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {statusCards.map(([label, value, detail, Icon]) => (
          <Card key={label} interactive className="p-6">
            <div className="flex items-center justify-between">
              <div className="rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-500 p-3 shadow-xl shadow-violet-950/30">
                <Icon size={22} className="text-white" />
              </div>
              <Badge tone="green">OK</Badge>
            </div>
            <p className="mt-5 text-sm text-zinc-400 light:text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
            <p className="mt-2 text-sm text-zinc-500 light:text-slate-500">{detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <MetricCard title="Seats Used" value="286" trend="+19 this month" icon={Users} />
        <MetricCard title="Policy Checks" value="99.8%" trend="passing" icon={Lock} accent="indigo" />
        <MetricCard title="Source Syncs" value="18K" trend="+8% daily" icon={Database} accent="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck size={20} className="text-emerald-300" />
            <h2 className="text-2xl font-semibold">AI Status</h2>
          </div>
          <div className="mt-6 space-y-4">
            {[
              ["Retrieval pipeline", "Healthy"],
              ["Embedding model", "Healthy"],
              ["Citation verifier", "Healthy"],
              ["PII redaction", "Healthy"],
              ["Audit logging", "Healthy"],
            ].map(([label, status]) => (
              <div key={label} className="flex items-center justify-between rounded-3xl bg-white/[0.045] p-4 light:bg-slate-50">
                <span className="text-sm text-zinc-400 light:text-slate-600">{label}</span>
                <Badge tone="green">{status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5 flex items-center gap-2">
            <Users size={20} className="text-violet-300" />
            <h2 className="text-2xl font-semibold">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-zinc-500 light:text-slate-500">
                <tr>
                  <th className="py-4">User</th>
                  <th className="py-4">Role</th>
                  <th className="py-4">Department</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 light:divide-slate-200">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="transition hover:bg-white/[0.035]">
                    <td className="py-4">
                      <p className="font-semibold">{user.name}</p>
                      <p className="mt-1 text-xs text-zinc-500">{user.email}</p>
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
