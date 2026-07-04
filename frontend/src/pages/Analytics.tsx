import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Card from "../components/common/Card";
import { getAnalytics } from "../services/api";
import type { Analytics as AnalyticsData } from "../types";

const colors = ["#8b5cf6", "#6366f1", "#38bdf8", "#22c55e", "#f59e0b"];

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    getAnalytics().then(setAnalytics);
  }, []);

  if (!analytics) {
    return <Card>Loading analytics...</Card>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="mt-2 text-zinc-400 light:text-slate-500">
          Adoption, usage trends, source coverage, and activity signals.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {analytics.metrics.map((metric) => (
          <Card key={metric.label}>
            <p className="text-sm text-zinc-400 light:text-slate-500">{metric.label}</p>
            <p className="mt-3 text-3xl font-bold">{metric.value}</p>
            <p className="mt-2 text-sm text-emerald-300 light:text-emerald-700">
              {metric.change}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
        <Card>
          <h2 className="text-lg font-semibold">Usage Trends</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.usageTrend}>
                <defs>
                  <linearGradient id="queries" x1="0" y1="0" x2="0" y2="1">
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
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="queries"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  fill="url(#queries)"
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Knowledge Source Mix</h2>
          <div className="mt-5 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.sourceMix}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={105}
                  paddingAngle={4}
                >
                  {analytics.sourceMix.map((entry, index) => (
                    <Cell key={entry.name} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "#111118",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 8,
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {analytics.sourceMix.map((source, index) => (
              <div key={source.name} className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
                <span className="text-zinc-400 light:text-slate-600">
                  {source.name} {source.value}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold">Activity Timeline</h2>
        <div className="mt-5 space-y-4">
          {analytics.activity.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4 light:border-slate-200 light:bg-slate-50"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold">{item.title}</h3>
                <span className="text-xs text-zinc-500 light:text-slate-500">
                  {item.time}
                </span>
              </div>
              <p className="mt-2 text-sm text-zinc-400 light:text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
