"use client";

import React, { useMemo, useState } from "react";
import { FiChevronDown, FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

type Option = { label: string; value: string };

export type DataTableFilter = {
  key: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (value: string) => void;
};

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

type PrimaryAction = {
  label: string;
  onClick: () => void;
};

type DataTableProps<T> = {
  data: T[];
  columns: Array<DataTableColumn<T>>;
  rowKey: (row: T) => string;

  searchValue?: string;
  onSearchChange?: (v: string) => void;
  searchPlaceholder?: string;

  filters?: DataTableFilter[];
  primaryAction?: PrimaryAction;
  primaryActionTone?: "orange" | "ghost";

  pageSize?: number;
  pageSizeOptions?: number[];
  emptyText?: string;

  footerLeft?: (meta: { from: number; to: number; total: number }) => React.ReactNode;

  className?: string;
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function SelectPill({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-600">{label}:</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 appearance-none rounded-md border border-black/10 bg-white/80 pl-3 pr-8 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/12"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  const pages = useMemo(() => {
    const out: Array<number | "…"> = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) out.push(i);
      return out;
    }
    const push = (v: number | "…") => out.push(v);
    push(1);
    if (page > 3) push("…");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) push(i);
    if (page < totalPages - 2) push("…");
    push(totalPages);
    return out;
  }, [page, totalPages]);

  const btn =
    "h-9 min-w-[38px] rounded-md border border-black/10 bg-white/70 px-3 text-sm font-bold text-slate-700 transition hover:bg-black/5 disabled:opacity-50 disabled:hover:bg-white/70";

  return (
    <div className="flex items-center gap-2">
      <button className={btn} disabled={page <= 1} onClick={() => onPage(page - 1)}>
        Previous
      </button>

      <div className="flex items-center gap-2">
        {pages.map((p, idx) =>
          p === "…" ? (
            <span key={`e-${idx}`} className="px-1 text-sm font-bold text-slate-500">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPage(p)}
              className={cx(btn, p === page && "border-[#ff7a1a]/30 bg-[#ff7a1a]/10 text-[#ff7a1a]")}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button className={btn} disabled={page >= totalPages} onClick={() => onPage(page + 1)}>
        Next
      </button>
    </div>
  );
}

export default function DataTable<T>({
  data,
  columns,
  rowKey,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search by name/email...",
  filters = [],
  primaryAction,
  primaryActionTone = "orange",
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  emptyText = "No records found.",
  footerLeft,
  className,
}: DataTableProps<T>) {
  const [qLocal, setQLocal] = useState("");
  const [page, setPage] = useState(1);
  const [ps, setPs] = useState(pageSize);

  const q = searchValue ?? qLocal;

  const filtered = useMemo(() => {
    if (!q.trim()) return data;
    const s = q.trim().toLowerCase();
    return data.filter((row) => JSON.stringify(row).toLowerCase().includes(s));
  }, [data, q]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / ps));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * ps;
  const end = start + ps;
  const pageRows = filtered.slice(start, end);

  const from = total === 0 ? 0 : start + 1;
  const to = Math.min(end, total);

  const onSearch = (v: string) => {
    if (onSearchChange) onSearchChange(v);
    else setQLocal(v);
    setPage(1);
  };

  const primaryCls =
    primaryActionTone === "ghost"
      ? "border border-black/10 bg-white/80 text-slate-900 hover:bg-black/5 focus:ring-[#ff7a1a]/12"
      : "bg-[#ff7a1a] text-white hover:brightness-95 focus:ring-[#ff7a1a]/20";

  return (
    <div
      className={cx(
        "w-full rounded-md border border-black/10 bg-white/70 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.25)] backdrop-blur",
        className
      )}
    >
      <div className="flex flex-col gap-3 border-b border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative w-full max-w-[420px]">
            <input
              value={q}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-10 w-full rounded-md border border-black/10 bg-white/80 px-4 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/12"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3">
          {filters.map((f) => (
            <SelectPill
              key={f.key}
              label={f.label}
              value={f.value}
              options={f.options}
              onChange={(v) => {
                f.onChange(v);
                setPage(1);
              }}
            />
          ))}

          {primaryAction ? (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className={cx(
                "inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-extrabold shadow-sm transition focus:outline-none focus:ring-4",
                primaryCls
              )}
            >
              <span className="text-lg leading-none">+</span>
              {primaryAction.label}
            </button>
          ) : null}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-[860px] w-full">
          <thead>
            <tr className="text-left">
              {columns.map((c) => (
                <th key={c.key} className={cx("px-5 py-3 text-[11px] font-extrabold tracking-wider text-slate-600", c.className)}>
                  {c.header.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-10 text-center text-sm font-semibold text-slate-600">
                  {emptyText}
                </td>
              </tr>
            ) : (
              pageRows.map((row, idx) => (
                <tr key={rowKey(row)} className={cx("border-t border-black/5", idx === 0 && "border-t border-[#ff7a1a]/40")}>
                  {columns.map((c) => (
                    <td key={c.key} className={cx("px-5 py-4 text-sm text-slate-800", c.className)}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-black/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm font-semibold text-slate-700">
          {footerLeft ? footerLeft({ from, to, total }) : (
            <span>
              Showing <span className="font-extrabold">{from}</span>-<span className="font-extrabold">{to}</span> of{" "}
              <span className="font-extrabold">{total}</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-end">
          <div className="relative">
            <select
              value={ps}
              onChange={(e) => {
                setPs(Number(e.target.value));
                setPage(1);
              }}
              className="h-9 appearance-none rounded-md border border-black/10 bg-white/80 pl-3 pr-8 text-sm font-semibold text-slate-800 outline-none transition focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/12"
            >
              {pageSizeOptions.map((n) => (
                <option key={n} value={n}>
                  {n}/page
                </option>
              ))}
            </select>
            <FiChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
        </div>
      </div>
    </div>
  );
}

export function Pill({
  children,
  tone = "orange",
}: {
  children: React.ReactNode;
  tone?: "orange" | "slate";
}) {
  const toneCls =
    tone === "orange"
      ? "border-[#ff7a1a]/25 bg-[#ff7a1a]/10 text-[#ff7a1a]"
      : "border-black/10 bg-black/5 text-slate-700";

  return <span className={cx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-extrabold", toneCls)}>{children}</span>;
}

export function TableActions({
  onView,
  onEdit,
  onDelete,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const a =
    "inline-flex h-9 w-9 items-center justify-center rounded-md border border-black/10 bg-white/70 text-slate-700 transition hover:bg-black/5";
  const d =
    "inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-200 bg-rose-50 text-rose-600 transition hover:brightness-95";

  return (
    <div className="flex items-center gap-2">
      {onView ? (
        <button type="button" onClick={onView} className={a} aria-label="View">
          <FiEye className="h-4 w-4" />
        </button>
      ) : null}
      {onEdit ? (
        <button type="button" onClick={onEdit} className={a} aria-label="Edit">
          <FiEdit2 className="h-4 w-4" />
        </button>
      ) : null}
      {onDelete ? (
        <button type="button" onClick={onDelete} className={d} aria-label="Delete">
          <FiTrash2 className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}
