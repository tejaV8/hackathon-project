import { useState } from "react";
import axios from "axios";
import { Paperclip, Mic, SendHorizontal, Sparkles } from "lucide-react";

export default function Hero() {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [citations, setCitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      // Connects directly to the local FastAPI backend port 8000
      const res = await axios.post("http://localhost:8000/query", {
        question: question.trim(),
      });

      setResponse(res.data.response);
      setConfidence(res.data.confidence_score);
      setCitations(res.data.citations || []);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to establish connection with AI Company Brain backend."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto pt-12 space-y-8">
      {/* Heading */}
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 bg-clip-text text-transparent">
            Good Morning,
          </span>{" "}
          <span className="text-white">Shanmitha! 👋</span>
        </h1>
        <p className="mt-5 text-xl text-zinc-400">
          How can I help you today? Ask anything or automate a task.
        </p>
      </div>

      {/* Prompt Box */}
      <div className="rounded-3xl border border-zinc-800 bg-[#14141C] p-6 shadow-xl">
        <textarea
          rows={3}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask a question or request an action..."
          className="w-full resize-none bg-transparent text-lg text-white placeholder:text-zinc-500 outline-none"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className="mt-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="rounded-xl p-2 hover:bg-zinc-800 transition text-zinc-400">
              <Paperclip size={20} />
            </button>
            <button className="rounded-xl p-2 hover:bg-zinc-800 transition text-zinc-400">
              <Mic size={20} />
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 transition">
              <Sparkles size={16} />
              Smart
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 p-4 hover:scale-105 transition disabled:opacity-50 text-white cursor-pointer"
          >
            {loading ? (
              <span className="animate-spin block h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <SendHorizontal size={20} />
            )}
          </button>
        </div>
      </div>

      {/* Thinking state loader */}
      {loading && (
        <div className="rounded-3xl border border-zinc-800 bg-[#14141C]/50 p-8 flex flex-col items-center justify-center gap-4 text-zinc-400">
          <span className="animate-spin h-8 w-8 border-4 border-violet-500 border-t-transparent rounded-full" />
          <p className="text-lg">Brain is thinking...</p>
        </div>
      )}

      {/* Error state display */}
      {error && (
        <div className="rounded-3xl border border-red-900 bg-red-950/20 p-6 text-red-400 text-center">
          <p className="font-semibold">Query Failure</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      )}

      {/* Success state response */}
      {response && (
        <div className="rounded-3xl border border-zinc-800 bg-[#111118] p-8 shadow-xl space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-violet-400">AI Response</h2>
              {confidence !== null && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-violet-900/50 text-violet-300 border border-violet-700">
                  Confidence: {confidence * 100}%
                </span>
              )}
            </div>

            {/* Render answer content clean of markdown markdown syntax wrappers */}
            <div className="text-zinc-200 leading-relaxed whitespace-pre-line text-lg bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
              {response
                .replace(/### Answer\n|#### Sources & Citations[\s\S]*/g, "")
                .trim()}
            </div>
          </div>

          {/* Citations Grid */}
          {citations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-zinc-300">
                Sources Cited:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {citations.map((c, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white truncate">
                        {c.filename}
                      </p>
                      <p className="text-xs text-zinc-400 mt-2 italic line-clamp-3">
                        "{c.snippet}"
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-800">
                      <span className="text-xs text-violet-400 font-medium bg-violet-950/40 px-2 py-0.5 rounded border border-violet-900">
                        Page {c.page_number}
                      </span>
                      <span className="text-xs text-zinc-500">
                        Match Score: {c.confidence_score * 100}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}