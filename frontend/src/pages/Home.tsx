import { BarChart3, FileText, GitPullRequest, MessageSquare, Rocket, Search, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Card from "../components/common/Card";
import ActivityCard from "../components/dashboard/ActivityCard";
import ConversationCard from "../components/dashboard/ConversationCard";
import MetricCard from "../components/dashboard/MetricCard";
import PageHeader from "../components/dashboard/PageHeader";
import PromptBox from "../components/dashboard/PromptBox";

const suggestedPrompts = [
  { title: "Q2 Sales Performance", description: "Summarize wins, risks, and missed targets.", icon: BarChart3 },
  { title: "Onboarding Process", description: "Find gaps in the current new hire workflow.", icon: Users },
  { title: "Find Jira Tickets", description: "Show unresolved launch blockers by owner.", icon: Search },
  { title: "Create PRD", description: "Draft a PRD from roadmap and customer notes.", icon: GitPullRequest },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="AI Company Brain"
        title="Good Morning, Priya"
        subtitle="Ask anything, find answers, or automate tasks."
        icon={Rocket}
      />

      <PromptBox
        placeholder="Ask your company brain anything..."
        suggestions={[
          "What changed this week?",
          "Show Q3 revenue risks",
          "Summarize support escalations",
          "Create onboarding guide",
        ]}
        onSubmit={() => navigate("/askbrain")}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {suggestedPrompts.map((prompt) => {
          const Icon = prompt.icon;
          return (
            <button key={prompt.title} type="button" onClick={() => navigate("/askbrain")} className="text-left">
              <Card interactive className="h-full p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-200 light:text-violet-700">
                  <Icon size={21} />
                </div>
                <h3 className="mt-4 text-base font-semibold">{prompt.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-400 light:text-slate-600">
                  {prompt.description}
                </p>
              </Card>
            </button>
          );
        })}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Knowledge Sources" value="34" trend="+7 connected" icon={FileText} />
        <MetricCard title="Documents Indexed" value="184" trend="+21 this week" icon={FileText} accent="indigo" />
        <MetricCard title="AI Queries Today" value="1.8K" trend="+24%" icon={MessageSquare} accent="purple" />
        <MetricCard title="Active Agents" value="12" trend="4 running" icon={Rocket} accent="blue" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent Answers</h2>
              <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
                Answers your team recently reviewed.
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <ConversationCard
              title="Q2 Sales Performance"
              summary="Revenue grew 18%, with enterprise expansion offsetting SMB churn."
              time="24 min ago"
              sources={8}
            />
            <ConversationCard
              title="Onboarding Process"
              summary="The process is missing IT provisioning owners for two regions."
              time="1 hr ago"
              sources={6}
            />
            <ConversationCard
              title="Support Escalation Themes"
              summary="Most escalations came from launch readiness and billing confusion."
              time="Yesterday"
              sources={13}
            />
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="text-xl font-semibold">Recommended Next Steps</h2>
          <p className="mt-1 text-sm text-zinc-400 light:text-slate-500">
            Suggested automations based on recent activity.
          </p>
          <div className="mt-4 space-y-3">
            <ActivityCard title="Review unresolved Jira tickets" description="16 launch blockers have not moved in 5 days." icon={Search} time="Today" />
            <ActivityCard title="Analyze revenue anomalies" description="Enterprise expansion is above forecast in two regions." icon={BarChart3} time="Today" />
            <ActivityCard title="Generate onboarding packet" description="Create a role-aware packet from HR, IT, and product docs." icon={Users} time="Suggested" />
          </div>
        </Card>
      </section>
    </div>
  );
}
