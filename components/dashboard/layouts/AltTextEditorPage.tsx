"use client";

import React from "react";

export default function AltTextEditorPage() {
  const [tone, setTone] = React.useState("Friendly");
  const [limit, setLimit] = React.useState("125");
  const [lang, setLang] = React.useState("English");

  const [text, setText] = React.useState(
    "A close-up of a laptop screen showing analytics dashboards."
  );

  const charCount = text.length;
  const maxChars = Number(limit) || 125;
  const isOver = charCount > maxChars;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  const onRegenerate = () => {
    const samples = [
      "Laptop screen displaying an analytics dashboard with charts and metrics.",
      "Analytics dashboard visible on a laptop, showing trends and performance indicators.",
      "A laptop showing a dashboard interface with graphs and key KPIs.",
    ];
    setText(samples[Math.floor(Math.random() * samples.length)]);
  };

  const onDiscard = () => setText("");

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Alt text editor
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Review AI suggestions, keep it concise, and focus on the meaning
            of the image.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          <span className="rounded-full bg-white/15 px-2 py-0.5">
            Step 3
          </span>
          <span>Editing</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-4">
          <div className="overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-slate-200">
            <div className="aspect-[16/10] w-full bg-slate-100">
              <img
                src="https://picsum.photos/seed/alt_editor/900/600"
                alt="Preview"
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>

            <div className="p-4">
              <div className="text-sm font-semibold text-slate-900">
                Image preview
              </div>
              <div className="mt-1 text-xs text-slate-500">
                PNG • 240 KB
              </div>

              <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
                Tip: If the image is decorative, leave alt text empty or
                mark it as decorative in your export.
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <div className="rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                  >
                    <option>Friendly</option>
                    <option>Professional</option>
                    <option>Neutral</option>
                    <option>Technical</option>
                  </select>

                  <select
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                  >
                    <option value="80">80 chars</option>
                    <option value="125">125 chars</option>
                    <option value="160">160 chars</option>
                  </select>

                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Punjabi</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={[
                      "rounded-full px-3 py-1 text-xs font-semibold ring-1",
                      isOver
                        ? "bg-amber-50 text-amber-800 ring-amber-200"
                        : "bg-emerald-50 text-emerald-800 ring-emerald-200",
                    ].join(" ")}
                  >
                    {charCount}/{maxChars}
                  </span>

                  <span className="text-xs text-slate-500">
                    Tone:{" "}
                    <span className="font-semibold text-slate-800">
                      {tone}
                    </span>{" "}
                    •{" "}
                    <span className="font-semibold text-slate-800">
                      {lang}
                    </span>
                  </span>
                </div>
              </div>

              {isOver && (
                <div className="rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-900 ring-1 ring-amber-200">
                  Length is over the selected limit. Try removing extra
                  detail and keep the main takeaway.
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-900">
                  Alt text
                </label>
                <textarea
                  className="w-full resize-none rounded-md bg-white p-4 text-sm text-slate-900 shadow-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-teal-200"
                  rows={5}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Describe the image meaningfully…"
                />
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Keep it meaningful. Avoid “image of”, “picture of”.
                  </span>
                  <button
                    type="button"
                    onClick={() => setText(text.trim())}
                    className="font-semibold text-teal-700 hover:text-teal-800"
                  >
                    Trim spaces
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onRegenerate}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Regenerate
                </button>

                <button
                  onClick={onCopy}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  Copy
                </button>

                <button
                  onClick={onDiscard}
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm ring-1 ring-slate-200 hover:bg-rose-50"
                >
                  Discard
                </button>

                <div className="ml-auto flex items-center gap-2">
                  <button className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                    Previous
                  </button>
                  <button className="rounded-md bg-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600">
                    Save & Continue
                  </button>
                </div>
              </div>

              <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
                <div className="font-semibold text-slate-800">
                  Good alt text usually includes:
                </div>
                <ul className="mt-2 space-y-1">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500" />
                    What it is (object/scene)
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500" />
                    Why it matters (key info / takeaway)
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500" />
                    Keep it short and avoid repetition
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        <button className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
          Save draft
        </button>
        <button className="rounded-md bg-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-600">
          Save All & Continue
        </button>
      </div>
    </div>
  );
}
