import {
  Database,
  FileSpreadsheet,
  FileText,
  Filter,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import Badge from "../components/common/Badge";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import MetricCard from "../components/dashboard/MetricCard";
import PageHeader from "../components/dashboard/PageHeader";
import { getDocuments, uploadDocument } from "../services/api";
import type { CompanyDocument } from "../types";

function documentTone(status: CompanyDocument["status"]) {
  if (status === "Indexed") return "green";
  if (status === "Processing") return "amber";
  return "red";
}

function DocumentIcon({ type }: { type: CompanyDocument["type"] }) {
  if (type === "CSV") return <FileSpreadsheet size={19} className="text-emerald-300" />;
  return <FileText size={19} className="text-violet-300" />;
}

const categories = [
  ["All Knowledge", "184"],
  ["Finance", "42"],
  ["Product", "36"],
  ["Support", "51"],
  ["HR & Legal", "28"],
];

export default function Documents() {
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | CompanyDocument["status"]>("All");
  const [category, setCategory] = useState("All Knowledge");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    getDocuments().then(setDocuments);
  }, []);

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const matchesQuery = document.name.toLowerCase().includes(query.toLowerCase());
      const matchesFilter = filter === "All" || document.status === filter;
      return matchesQuery && matchesFilter;
    });
  }, [documents, filter, query]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const uploaded = await Promise.all(Array.from(files).map((file) => uploadDocument(file)));
    setDocuments((current) => [...uploaded, ...current]);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    void handleFiles(event.target.files);
    event.target.value = "";
  }

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Enterprise knowledge hub"
        title="Documents"
        subtitle="Upload, categorize, index, and govern the source material that powers every AI answer and workflow."
        icon={Database}
      />

      <section>
        <Card
          className={`border-dashed p-6 text-center transition ${
            isDragging ? "border-violet-400 bg-violet-500/10" : ""
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            void handleFiles(event.dataTransfer.files);
          }}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-500/15 text-violet-200">
            <UploadCloud size={30} />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Add knowledge</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400 light:text-slate-500">
            Drop files or select uploads. PDF, DOCX, CSV, and TXT supported.
          </p>
          <label className="mt-5 inline-flex cursor-pointer">
            <input
              type="file"
              multiple
              className="sr-only"
              onChange={handleInputChange}
              accept=".pdf,.docx,.txt,.csv,.pptx"
            />
            <span className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-700/30 transition hover:bg-violet-500">
              Upload files
            </span>
          </label>
        </Card>
      </section>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="PDF" value="96" trend="+14 indexed" icon={FileText} accent="violet" />
        <MetricCard title="DOCX" value="44" trend="+6 indexed" icon={FileText} accent="indigo" />
        <MetricCard title="CSV" value="31" trend="+4 analyzed" icon={FileSpreadsheet} accent="blue" />
        <MetricCard title="TXT" value="13" trend="stable" icon={FileText} accent="purple" />
      </div>

      <Card className="p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(([name, count]) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  category === name
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-950/20"
                    : "border border-white/10 bg-white/[0.05] text-zinc-300 hover:border-violet-400/60 light:border-slate-200 light:text-slate-700"
                }`}
              >
                {name} <span className="opacity-60">{count}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative min-w-[280px]">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search knowledge..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3 pl-10 pr-3 text-sm outline-none focus:border-violet-400 light:border-slate-200 light:bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={17} className="text-zinc-500" />
              {(["All", "Indexed", "Processing"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setFilter(status)}
                  className={`rounded-2xl px-3 py-2 text-sm font-semibold transition ${
                    filter === status
                      ? "bg-violet-600 text-white"
                      : "bg-white/[0.06] text-zinc-300 hover:bg-white/[0.1] light:text-slate-700"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-zinc-500 light:text-slate-500">
              <tr>
                <th className="py-4">Knowledge Source</th>
                <th className="py-4">Owner</th>
                <th className="py-4">Connector</th>
                <th className="py-4">Status</th>
                <th className="py-4">Indexing</th>
                <th className="py-4 text-right">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 light:divide-slate-200">
              {filteredDocuments.map((document) => (
                <tr key={document.id} className="transition hover:bg-white/[0.035]">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-white/[0.06] p-3">
                        <DocumentIcon type={document.type} />
                      </div>
                      <div>
                        <p className="font-semibold">{document.name}</p>
                        <p className="mt-1 text-xs text-zinc-500">
                          {document.type} • {document.size} • {document.uploadedAt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-zinc-400 light:text-slate-600">
                    {document.owner}
                  </td>
                  <td className="py-4 text-zinc-400 light:text-slate-600">
                    {document.source}
                  </td>
                  <td className="py-4">
                    <Badge tone={documentTone(document.status)}>{document.status}</Badge>
                  </td>
                  <td className="py-4">
                    <div className="h-2.5 w-32 rounded-full bg-white/10 light:bg-slate-200">
                      <div
                        className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400"
                        style={{ width: `${document.progress}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setDocuments((current) =>
                          current.filter((item) => item.id !== document.id),
                        )
                      }
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
