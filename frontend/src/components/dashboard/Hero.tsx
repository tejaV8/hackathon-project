import { Paperclip, Mic, SendHorizontal, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="max-w-4xl mx-auto pt-12">

      {/* Heading */}

      <div className="text-center">

        <h1 className="text-6xl font-bold tracking-tight">

          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Good Morning,
          </span>{" "}
          <span className="text-white">
            Shanmitha! 👋
          </span>

        </h1>

        <p className="mt-5 text-xl text-zinc-400">
          How can I help you today? Ask anything or automate a task.
        </p>

      </div>

      {/* Prompt Box */}

      <div className="mt-12 rounded-3xl border border-zinc-800 bg-[#14141C] p-6 shadow-xl">

        <textarea
          rows={3}
          placeholder="Ask a question or request an action..."
          className="w-full resize-none bg-transparent text-lg text-white placeholder:text-zinc-500 outline-none"
        />

        <div className="mt-5 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button className="rounded-xl p-2 hover:bg-zinc-800 transition">
              <Paperclip size={20} />
            </button>

            <button className="rounded-xl p-2 hover:bg-zinc-800 transition">
              <Mic size={20} />
            </button>

            <button className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-sm hover:bg-zinc-700 transition">
              <Sparkles size={16} />
              Smart
            </button>

          </div>

          <button className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 p-4 hover:scale-105 transition">
            <SendHorizontal size={20} />
          </button>

        </div>

      </div>

    </section>
  );
}