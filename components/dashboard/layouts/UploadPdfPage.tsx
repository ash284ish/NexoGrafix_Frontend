"use client";

import React from "react";
import {
  Upload,
  FolderOpen,
  CheckCircle,
  MessageSquare,
} from "lucide-react";

export default function UploadPdfPage() {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const pickFiles = () => inputRef.current?.click();

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const pdfs = Array.from(incoming).filter(
      (f) =>
        f.type === "application/pdf" ||
        f.name.toLowerCase().endsWith(".pdf")
    );
    setFiles((prev) => {
      const map = new Map<string, File>();
      [...prev, ...pdfs].forEach((f) =>
        map.set(`${f.name}_${f.size}`, f)
      );
      return Array.from(map.values());
    });
  };

  const onDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (key: string) => {
    setFiles((prev) =>
      prev.filter((f) => `${f.name}_${f.size}` !== key)
    );
  };

  const clearAll = () => setFiles([]);

  const totalSizeMB =
    Math.round(
      (files.reduce((s, f) => s + f.size, 0) / (1024 * 1024)) * 10
    ) / 10;

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-slate-900">
            Upload PDFs for Image Extraction
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Upload your PDFs. Arohio will extract images and prepare them
            for alt-text generation.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-50 text-teal-700">
              1
            </span>
            <span>Upload</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Review Images</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Generate</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Approve</span>
            <span className="text-slate-300">›</span>
            <span className="text-slate-500">Export</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={pickFiles}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <Upload className="h-4 w-4" />
            Add PDFs
          </button>

          <button
            disabled={files.length === 0}
            className="inline-flex items-center gap-2 rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Upload All
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        multiple
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setDragOver(false);
            }}
            onDrop={onDrop}
            className={[
              "relative flex flex-col items-center justify-center rounded-md border-2 border-dashed bg-white p-10 text-center transition",
              dragOver
                ? "border-teal-400 bg-teal-50/40"
                : "border-slate-200 hover:border-teal-300",
            ].join(" ")}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-md bg-teal-50 text-teal-600">
              <Upload className="h-7 w-7" />
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-900">
              Drag & drop PDFs here
            </p>

            <p className="mt-1 text-sm text-slate-600">
              or{" "}
              <button
                type="button"
                onClick={pickFiles}
                className="font-semibold text-teal-600 underline underline-offset-2 hover:text-teal-700"
              >
                click to browse
              </button>
            </p>

            <div className="mt-3 text-xs text-slate-500">
              PDF only • Max 25MB each • Multiple files supported
            </div>
          </div>

          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900">
                  Selected files
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  {files.length === 0
                    ? "No files selected yet."
                    : `${files.length} file(s) • ${totalSizeMB} MB total`}
                </div>
              </div>

              <button
                onClick={clearAll}
                disabled={files.length === 0}
                className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Clear All
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {files.length === 0 ? (
                <div className="rounded-md border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
                  Tip: Upload one PDF first to validate extraction
                  quality, then batch upload.
                </div>
              ) : (
                files.map((f) => {
                  const key = `${f.name}_${f.size}`;
                  const sizeMB =
                    Math.round((f.size / (1024 * 1024)) * 10) /
                    10;
                  const tooBig = f.size > 25 * 1024 * 1024;

                  return (
                    <div
                      key={key}
                      className="flex items-center justify-between gap-4 rounded-md border border-slate-100 p-4"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900">
                          {f.name}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {sizeMB} MB • PDF
                          {tooBig && (
                            <span className="ml-2 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                              Exceeds 25MB
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => removeFile(key)}
                        className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={pickFiles}
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              >
                Add more
              </button>

              <button
                disabled={files.length === 0}
                className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Upload All
              </button>

              <div className="ml-auto text-xs text-slate-500">
                After upload: you’ll review extracted images per page.
              </div>
            </div>
          </div>
        </div>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900">
              Tips for better extraction
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-500" />
                Keep PDFs under 25MB (compress if needed).
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-500" />
                Prefer vector or high-res images for best results.
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-500" />
                Avoid scanned PDFs if possible (quality varies).
              </li>
            </ul>
          </div>

          <div className="rounded-md border border-emerald-200 bg-white p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate-900">
              What happens next?
            </div>
            <div className="mt-2 text-sm text-slate-600">
              You’ll see extracted images grouped by PDF pages.
              Select only meaningful images for alt-text generation.
            </div>
            <div className="mt-4 rounded-md bg-emerald-50 p-3 text-xs text-emerald-800">
              Recommended: skip decorative icons and repeated logos.
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
