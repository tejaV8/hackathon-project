import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BarChart3, Database, FileText, LineChart as LineChartIcon } from "lucide-react";
import Card from "../components/common/Card";
import MetricCard from "../components/dashboard/MetricCard";
import { getAnalytics } from "../services/api";
import type { Analytics as AnalyticsData } from "../types";

const colors = ["#8b5cf6", "#6366f1", "#38bdf8", "#22c55e", "#f59e0b"];

const documentGrowth = [
  { name: "Jan", docs: 62 },
  { name: "Feb", docs: 78 },
  { name: "Mar", docs: 96 },
  { name: "Apr", docs: 121 },
  { name: "May", docs: 148 },
  { name: "Jun", docs: 184 },
];

const departments = [
  { name: "Sales", usage: 86 },
  { name: "Product", usage: 72 },
  { name: "Support", usage: 68 },
  { name: "Finance", usage: 54 },
  { name: "HR", usage: 38 },
];

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    getAnalytics().then(setAnalytics);
  }, []);

  if (!analytics) {
    return <Card>Loading analytics...</Card>;
  }

  return (
    <div className="space-y-7">
      <section className="rounded-3xl border border-white/10 bg-[#111118] p-8 shadow-2xl shadow-violet-950/20 light:border-slate-200 light:bg-white">
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 light:text-violet-700">
          <BarChart3 size={16} />
          Executive dashboard
        </div>
        <h1 className="mt-5 text-5xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400 light:text-slate-600">
          Measure adoption, knowledge growth, source quality, and AI operating
          impact across every department.
        </p>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Queries Today" value="1.8K" trend="+24%" icon={LineChartIcon} />
        <MetricCard title="Document Growth" value="184" trend="+36 month" icon={FileText} accent="indigo" />
        <MetricCard title="Departments" value="12" trend="8 active daily" icon={Database} accent="blue" />
        <MetricCard title="Usage Health" value="92%" trend="+5 pts" icon={BarChart3} accent="purple" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold">Queries Over Time</h2>
          <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
            Daily query volume and active user movement.
          </p>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.usageTrend}>
                <defs>
                  <linearGradient id="queries-area" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.14)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#111118",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 24,
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#queries-area)"
                />
                <Line type="monotone" dataKey="users" stroke="#38bdf8" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold">Knowledge Usage</h2>
          <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
            Source contribution to answers.
          </p>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.sourceMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={105}
                  paddingAngle={5}
                >
                  {analytics.sourceMix.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#111118",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 24,
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold">Document Growth</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={documentGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.14)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#111118",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 24,
                    color: "#fff",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="docs"
                  stroke="#8b5cf6"
                  strokeWidth={4}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold">Top Departments</h2>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.14)" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "#111118",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 24,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="usage" radius={[14, 14, 0, 0]} fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold">Executive Activity Timeline</h2>
        <div className="mt-5 grid gap-3 xl:grid-cols-3">
          {analytics.activity.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 light:border-slate-200 light:bg-slate-50"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold">{item.title}</h3>
                <span className="text-xs text-zinc-500 light:text-slate-500">{item.time}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-zinc-400 light:text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
