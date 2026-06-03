"use client";

import React from "react";

export default function ExtractedImagesPage() {
  const pages = [
    { id: "p1", label: "Page 1", count: 4 },
    { id: "p2", label: "Page 2", count: 3 },
    { id: "p3", label: "Page 3", count: 2 },
    { id: "p4", label: "Page 4", count: 2 },
    { id: "p5", label: "Page 5", count: 1 },
  ];

  const images = Array.from({ length: 8 }).map((_, idx) => ({
    id: `img_${idx + 1}`,
    title: `Image ${idx + 1}`,
    src: `https://picsum.photos/seed/altflow_${idx + 7}/900/600`,
    size: ["180 KB", "240 KB", "320 KB", "410 KB"][idx % 4],
    type: ["PNG", "JPG", "SVG"][idx % 3],
  }));

  const [activePage, setActivePage] = React.useState(pages[0].id);
  const [selected, setSelected] = React.useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    images.forEach((im, i) => (init[im.id] = i < 4));
    return init;
  });

  const selectedCount = Object.values(selected).filter(Boolean).length;

  const toggle = (id: string) =>
    setSelected((p) => ({ ...p, [id]: !p[id] }));

  const selectAll = () =>
    setSelected(() => {
      const next: Record<string, boolean> = {};
      images.forEach((im) => (next[im.id] = true));
      return next;
    });

  const clearAll = () =>
    setSelected(() => {
      const next: Record<string, boolean> = {};
      images.forEach((im) => (next[im.id] = false));
      return next;
    });

  return (
    <div className="min-w-0 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-slate-900">
            Review extracted images
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Select only meaningful images. Decorative icons and repeated
            logos usually don’t need alt text.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
            <span className="rounded-full bg-white/15 px-2 py-0.5">
              Step 2
            </span>
            <span>{selectedCount} selected</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={selectAll}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Select all
          </button>
          <button
            onClick={clearAll}
            className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Clear
          </button>
          <button className="rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600">
            Generate Alt Text
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT: PDF pages */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm font-semibold text-slate-900">
              PDF pages
            </div>

            <div className="mt-4 space-y-2">
              {pages.map((p) => {
                const active = activePage === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePage(p.id)}
                    className={[
                      "flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition",
                      active
                        ? "bg-teal-50 text-teal-800 ring-1 ring-teal-200"
                        : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <span>{p.label}</span>
                    <span
                      className={[
                        "rounded-full px-2 py-0.5 text-xs font-semibold",
                        active
                          ? "bg-teal-100 text-teal-800"
                          : "bg-slate-100 text-slate-700",
                      ].join(" ")}
                    >
                      {p.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
              Tip: Focus on charts, product images, UI screenshots,
              diagrams, and photos with meaning.
            </div>
          </div>
        </aside>

        {/* CENTER: Images */}
        <main className="col-span-12 space-y-4 lg:col-span-6">
          <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">
                  Selection summary
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  You have selected{" "}
                  <span className="font-semibold text-slate-900">
                    {selectedCount}
                  </span>{" "}
                  image(s) for alt-text generation.
                </div>
              </div>

              <div className="rounded-md bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 ring-1 ring-teal-200">
                Ready for Step 3
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {images.map((im) => {
              const checked = !!selected[im.id];
              return (
                <div
                  key={im.id}
                  className={[
                    "group overflow-hidden rounded-md bg-white shadow-sm ring-1 transition",
                    checked
                      ? "ring-teal-200"
                      : "ring-slate-200 hover:ring-slate-300",
                  ].join(" ")}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                    <img
                      src={im.src}
                      alt={im.title}
                      className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-slate-900">
                        {im.title}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        {im.type} • {im.size}
                      </div>
                    </div>

                    <button
                      onClick={() => toggle(im.id)}
                      className={[
                        "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                        checked
                          ? "bg-teal-500 text-white hover:bg-teal-600"
                          : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-4 w-4 rounded-[4px] ring-1 ring-inset",
                          checked
                            ? "bg-white/25 ring-white/40"
                            : "bg-white ring-slate-300",
                        ].join(" ")}
                      />
                      {checked ? "Included" : "Include"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className="rounded-md bg-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-600">
              Generate Alt Text
            </button>
            <button className="rounded-md bg-white px-5 py-2 text-sm font-semibold text-slate-800 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
              Discard unselected
            </button>

            <div className="ml-auto text-xs text-slate-500">
              Next: Alt text editor (tone, length, language)
            </div>
          </div>
        </main>

        {/* RIGHT: Guidance */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="space-y-6">
            <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-semibold text-slate-900">
                Best practices
              </div>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500" />
                  Skip purely decorative elements.
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500" />
                  For charts, mention the key takeaway, not every detail.
                </li>
                <li className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-teal-500" />
                  If text is already near the image, keep alt text
                  shorter.
                </li>
              </ul>
            </div>

            <div className="rounded-md bg-white p-5 shadow-sm ring-1 ring-slate-200">
              <div className="text-sm font-semibold text-slate-900">
                Quality checks
              </div>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Selected images</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCount}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
                  <span>Current page</span>
                  <span className="font-semibold text-slate-900">
                    {pages.find((p) => p.id === activePage)?.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
