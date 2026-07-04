import React, { useState } from "react";
import axios from "axios";
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function Documents() {
  const [file, setFile] = useState<File | null>(null);
  const [department, setDepartment] = useState("public");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
      setSuccess(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload first.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("department", department === "public" ? "" : department);

    try {
      // Connects directly to backend upload endpoint
      const res = await axios.post("http://localhost:8000/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          // The dev bypass automatically authenticates, but we specify placeholder headers just in case
        },
      });

      setSuccess(res.data);
      setFile(null);
      setDepartment("public");
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          "Failed to upload document. Ensure file format is PDF, DOCX, TXT, or MD and fits size limits."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Document Vault
        </h1>
        <p className="mt-2 text-zinc-400 text-lg">
          Upload and index files (PDF, DOCX, TXT, MD) into the AI Company Brain.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form Box */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-[#111118] p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-semibold text-zinc-200">Upload Document</h2>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Drag Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition
                ${dragOver ? "border-violet-500 bg-violet-950/10" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/10"}
              `}
            >
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.docx,.txt,.text,.md"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud size={48} className="text-zinc-500 hover:text-zinc-400 transition" />
                <span className="text-zinc-300 font-medium">
                  {file ? file.name : "Select a document or drag it here"}
                </span>
                <span className="text-xs text-zinc-500">
                  PDF, DOCX, TXT, or Markdown (Max 10MB)
                </span>
              </label>
            </div>

            {/* Department Dropdown Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-zinc-400">Department Indexing Access</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={uploading}
                className="w-full bg-[#181822] border border-zinc-800 rounded-xl px-4 py-3 text-white outline-none focus:border-violet-500 transition"
              >
                <option value="public">Public (All Employees)</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR (Human Resources)</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Marketing">Marketing</option>
                <option value="Legal">Legal</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 text-white font-bold hover:scale-[1.01] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {uploading ? (
                <>
                  <RefreshCw className="animate-spin" size={20} />
                  Ingesting Document...
                </>
              ) : (
                "Ingest into AI Brain"
              )}
            </button>
          </form>
        </div>

        {/* Notifications and status panel */}
        <div className="space-y-6">
          {success && (
            <div className="rounded-3xl border border-green-900/50 bg-green-950/10 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3 text-green-400">
                <CheckCircle2 size={24} />
                <h3 className="font-semibold text-lg">Ingestion Successful!</h3>
              </div>
              <div className="text-sm text-zinc-300 space-y-2">
                <p><strong className="text-zinc-400">File:</strong> {success.filename}</p>
                <p><strong className="text-zinc-400">Department:</strong> {success.department || "Public"}</p>
                <p><strong className="text-zinc-400">Size:</strong> {Math.round(success.file_size / 1024)} KB</p>
                <div className="p-3 bg-green-900/10 border border-green-800/30 rounded-xl mt-3 text-xs text-green-300">
                  Document text has been parsed, vectorized, and cataloged inside Qdrant and Neo4j databases.
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-3xl border border-red-950 bg-red-950/20 p-6 shadow-xl space-y-3">
              <div className="flex items-center gap-3 text-red-400">
                <AlertCircle size={24} />
                <h3 className="font-semibold text-lg">Ingestion Failed</h3>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed">{error}</p>
            </div>
          )}

          <div className="rounded-3xl border border-zinc-800 bg-[#111118]/40 p-6 space-y-4">
            <h3 className="font-semibold text-zinc-300">Ingestion Guidelines</h3>
            <ul className="text-xs text-zinc-500 space-y-2 list-disc list-inside">
              <li>PDF and Word (.docx) files are processed page-by-page.</li>
              <li>Text cleaners strip irrelevant headers and page markers.</li>
              <li>Semantics parser maps paragraphs recursively.</li>
              <li>Admin privileges are required for uploading.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}