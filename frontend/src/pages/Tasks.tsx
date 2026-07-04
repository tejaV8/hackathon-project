import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import { mockTasks } from "../services/api";
import type { BrainTask, TaskStatus } from "../types";

function statusTone(status: TaskStatus) {
  if (status === "Completed") return "green";
  if (status === "Running") return "blue";
  return "amber";
}

export default function Tasks() {
  const [tasks, setTasks] = useState<BrainTask[]>(mockTasks);
  const [tab, setTab] = useState<"Pending" | "Completed">("Pending");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) =>
      tab === "Completed" ? task.status === "Completed" : task.status !== "Completed",
    );
  }, [tab, tasks]);

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    if (!title) return;

    setTasks((current) => [
      {
        id: `task-${Date.now()}`,
        title,
        description: description || "AI-generated workflow task.",
        owner: "You",
        status: "Pending",
        priority: "Medium",
        dueDate: "Today",
      },
      ...current,
    ]);
    setIsModalOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tasks</h1>
          <p className="mt-2 text-zinc-400 light:text-slate-500">
            Monitor AI workflows and convert repeat work into tracked outcomes.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={16} />
          Create Task
        </Button>
      </div>

      <Card>
        <div className="mb-5 flex gap-2">
          {(["Pending", "Completed"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                tab === item
                  ? "bg-violet-600 text-white"
                  : "bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1] light:text-slate-700"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {visibleTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4 transition hover:border-violet-400/50 light:border-slate-200 light:bg-slate-50"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h2 className="font-semibold">{task.title}</h2>
                  <p className="mt-2 text-sm text-zinc-400 light:text-slate-600">
                    {task.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge tone={statusTone(task.status)}>{task.status}</Badge>
                  <Badge tone={task.priority === "High" ? "red" : "slate"}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500 light:text-slate-500">
                <span>Owner: {task.owner}</span>
                <span>Due: {task.dueDate}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Create AI Task</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              <div>
                <label className="text-sm font-medium">Task title</label>
                <input
                  name="title"
                  required
                  placeholder="Analyze new sales calls"
                  className="mt-2 w-full rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 outline-none focus:border-violet-400 light:border-slate-200 light:bg-white"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Instructions</label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Describe the workflow..."
                  className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2.5 outline-none focus:border-violet-400 light:border-slate-200 light:bg-white"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
