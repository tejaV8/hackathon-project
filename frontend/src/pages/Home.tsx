export default function Home() {
  return (
    <div className="space-y-10">

      {/* Hero */}

      <div>

        <h1 className="text-6xl font-extrabold tracking-tight">
          Welcome back 👋
        </h1>

        <p className="mt-4 text-xl text-zinc-400">
          Ask anything about your company knowledge.
        </p>

      </div>

      {/* AI Prompt */}

      <div className="rounded-3xl border border-zinc-800 bg-[#111118] p-6">

        <textarea
          placeholder="Ask your AI Company Brain..."
          className="
          w-full
          bg-transparent
          outline-none
          resize-none
          text-lg
          placeholder:text-zinc-500
          "
          rows={4}
        />

        <div className="flex justify-end mt-4">

          <button
            className="
            px-6
            py-3
            rounded-xl
            bg-violet-600
            hover:bg-violet-500
            transition
            "
          >
            Ask AI →
          </button>

        </div>

      </div>

    </div>
  );
}