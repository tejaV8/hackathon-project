import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart3, Clock, AlertTriangle, FileWarning, RefreshCcw, TrendingUp } from "lucide-react";

export default function Analytics() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Connects directly to backend analytics router
      const res = await axios.get("http://localhost:8000/analytics/dashboard");
      setData(res.data);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to fetch analytics. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-zinc-400">
        <span className="animate-spin h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full" />
        <p className="text-lg">Fetching platform metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto rounded-3xl border border-red-950 bg-red-950/20 p-8 text-center space-y-4 shadow-xl">
        <AlertTriangle className="text-red-400 mx-auto" size={48} />
        <h2 className="text-2xl font-bold text-red-400">Failed to Load Analytics</h2>
        <p className="text-zinc-300 text-sm">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="px-6 py-3 bg-red-900/40 hover:bg-red-900/60 border border-red-800 text-white rounded-xl transition cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Executive Analytics
          </h1>
          <p className="mt-2 text-zinc-400 text-lg">
            Monitor AI brain usage, query latency, and knowledge accuracy.
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-xl transition cursor-pointer"
        >
          <RefreshCcw size={20} />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-zinc-800 bg-[#111118] p-6 shadow-xl flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-violet-600/10 border border-violet-600/20 flex items-center justify-center text-violet-400">
            <BarChart3 size={28} />
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-semibold">Total RAG Queries</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {data?.total_queries_logged || 0}
            </h3>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#111118] p-6 shadow-xl flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-400">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-semibold">Avg Latency</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {data?.average_latency_ms ? `${Math.round(data.average_latency_ms)}ms` : "0ms"}
            </h3>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-[#111118] p-6 shadow-xl flex items-center gap-5">
          <div className="h-14 w-14 rounded-2xl bg-emerald-600/10 border border-emerald-600/20 flex items-center justify-center text-emerald-400">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-semibold">Doc Index Size</p>
            <h3 className="text-3xl font-extrabold text-white mt-1">
              {data?.unused_documents ? `${data.unused_documents.length} Files` : "0 Files"}
            </h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Knowledge Gaps Card */}
        <div className="rounded-3xl border border-zinc-800 bg-[#111118] p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 text-amber-400">
            <AlertTriangle size={22} />
            <h2 className="text-xl font-bold text-zinc-200">Knowledge Gaps (Unanswered)</h2>
          </div>
          <p className="text-sm text-zinc-500">
            List of employee queries that yielded low confidence or fallback results.
          </p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {data?.knowledge_gaps && data.knowledge_gaps.length > 0 ? (
              data.knowledge_gaps.map((item: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-zinc-200 font-medium text-sm">"{item.question}"</p>
                    <p className="text-xs text-zinc-500 mt-2">Confidence: {item.confidence_score * 100}%</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-900/50">
                    Gap
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-600 text-sm">
                No major knowledge gaps detected. All questions are answered with high confidence!
              </div>
            )}
          </div>
        </div>

        {/* Top Searched Topics */}
        <div className="rounded-3xl border border-zinc-800 bg-[#111118] p-6 shadow-xl space-y-4">
          <div className="flex items-center gap-3 text-violet-400">
            <TrendingUp size={22} />
            <h2 className="text-xl font-bold text-zinc-200">Trending Topics</h2>
          </div>
          <p className="text-sm text-zinc-500">
            Key vocabulary and topics requested by users.
          </p>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {data?.top_searched_topics && Object.keys(data.top_searched_topics).length > 0 ? (
              Object.entries(data.top_searched_topics).map(([term, count]: any, i: number) => (
                <div key={i} className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 flex items-center justify-between">
                  <span className="text-zinc-200 font-semibold text-sm">#{term}</span>
                  <span className="text-xs text-zinc-500 font-semibold">{count} searches</span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-zinc-600 text-sm">
                Search queries haven't logged enough keywords yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unused Documents */}
      <div className="rounded-3xl border border-zinc-800 bg-[#111118] p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 text-red-400">
          <FileWarning size={22} />
          <h2 className="text-xl font-bold text-zinc-200">Stale/Unused Documents</h2>
        </div>
        <p className="text-sm text-zinc-500">
          These documents are vectorized inside the database but have never been cited by any RAG search.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-2">
          {data?.unused_documents && data.unused_documents.length > 0 ? (
            data.unused_documents.map((item: any, i: number) => (
              <div key={i} className="p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 flex flex-col justify-between">
                <div>
                  <h4 className="text-zinc-200 font-semibold text-sm truncate">{item.filename}</h4>
                  <p className="text-xs text-zinc-500 mt-1">Uploaded to: {item.department || "Public"}</p>
                </div>
                <div className="mt-3 flex justify-between items-center text-[10px] text-zinc-500">
                  <span>Size: {Math.round(item.file_size / 1024)} KB</span>
                  <span>ID: {item.id}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-600 text-sm col-span-2">
              All documents are being utilized to answer queries. No dead files!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}