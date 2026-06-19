"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataTable, { Pill, TableActions, type DataTableColumn } from "@/components/ui/DataTable";
import ToastTopRight, { type ToastState } from "@/components/ui/Toast";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";

type Status = "Active" | "Unsubscribed";

type NewsletterUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: Status;
  subscribedAt: string;
};

type ApiUser = {
  id: string | number;
  first_name?: string;
  last_name?: string;
  email?: string;
  status?: string;
  updated_at?: string;
  created_at?: string;
};

function cx(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <>
      <div
        className={cx(
          "fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onMouseDown={onClose}
      />
      <div
        className={cx(
          "fixed inset-0 z-50 flex items-center justify-center p-4 transition",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className="w-full max-w-130 overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_22px_70px_-30px_rgba(0,0,0,0.45)]"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <div className="text-sm font-extrabold text-slate-900">{title}</div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-md border border-black/10 bg-white/80 text-slate-700 transition hover:bg-black/5"
            >
              ✕
            </button>
          </div>

          <div className="px-5 py-4">{children}</div>

          {footer ? (
            <div className="flex items-center justify-end gap-2 border-t border-black/10 px-5 py-4">{footer}</div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-semibold text-slate-600">{label}</span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        "h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition",
        "focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/12",
        props.className
      )}
    />
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full cursor-pointer rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/12"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function toInputDateTime(v: string) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toDisplay(v: string) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString();
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

function mapApiToRow(u: ApiUser): NewsletterUser {
  const statusRaw = String(u.status || "").toLowerCase();
  const status: Status = statusRaw === "unsubscribed" ? "Unsubscribed" : "Active";
  return {
    id: String(u.id),
    firstName: String(u.first_name || ""),
    lastName: String(u.last_name || ""),
    email: String(u.email || ""),
    status,
    subscribedAt: String(u.updated_at || u.created_at || ""),
  };
}

function mapRowToApiPayload(form: { firstName: string; lastName: string; email: string; status: Status }) {
  return {
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    email: form.email.trim(),
    status: form.status === "Unsubscribed" ? "unsubscribed" : "active",
  };
}

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function NewsletterUsersPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [rows, setRows] = useState<NewsletterUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [activeRow, setActiveRow] = useState<NewsletterUser | null>(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "Active" as Status,
    subscribedAt: "",
  });

  const [toast, setToast] = useState<ToastState>(null);

  const pushToast = (t: Exclude<ToastState, null>, ttl = 4000) => {
    setToast(t);
    window.setTimeout(() => setToast(null), ttl);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/newsletter-subscribers`, { cache: "no-store" });
      if (!res.ok) {
        const data = await readJsonSafe(res);
        pushToast({ type: "error", msg: data?.detail || data?.message || "Failed to load users." }, 4500);
        setRows([]);
        return;
      }
      const data = await readJsonSafe(res);
      const list: ApiUser[] = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setRows(list.map(mapApiToRow));
    } catch {
      pushToast({ type: "error", msg: "Network error while loading users." }, 4500);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((r) => r.status.toLowerCase() === statusFilter);
  }, [rows, statusFilter]);

  const columns = useMemo<DataTableColumn<NewsletterUser>[]>(() => {
    return [
      {
        key: "user",
        header: "User",
        className: "min-w-[320px]",
        render: (u) => (
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-slate-900">
              {u.firstName} {u.lastName}
            </div>
            <div className="text-xs font-semibold text-slate-500">{u.email}</div>
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (u) => <Pill tone={u.status === "Active" ? "orange" : "slate"}>{u.status}</Pill>,
      },
      {
        key: "subscribedAt",
        header: "Updated At",
        render: (u) => <span className="text-sm font-semibold text-slate-600">{toDisplay(u.subscribedAt)}</span>,
      },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        render: (u) => (
          <div className="flex justify-end">
            <TableActions
              onView={() => {
                setActiveRow(u);
                setViewOpen(true);
              }}
              onEdit={() => {
                setActiveRow(u);
                setForm({
                  firstName: u.firstName,
                  lastName: u.lastName,
                  email: u.email,
                  status: u.status,
                  subscribedAt: toInputDateTime(u.subscribedAt),
                });
                setEditOpen(true);
              }}
              onDelete={async () => {
                const prev = rows;
                setRows((p) => p.filter((x) => x.id !== u.id));
                try {
                  const res = await fetch(`/api/v1/newsletter-subscribers/${u.id}`, { method: "DELETE" });
                  if (!res.ok) {
                    const data = await readJsonSafe(res);
                    setRows(prev);
                    pushToast({ type: "error", msg: data?.detail || data?.message || "Delete failed." }, 4500);
                    return;
                  }
                  pushToast({ type: "success", msg: "User deleted." }, 3000);
                } catch {
                  setRows(prev);
                  pushToast({ type: "error", msg: "Network error. Delete failed." }, 4500);
                }
              }}
            />
          </div>
        ),
      },
    ];
  }, [rows]);

  const openAdd = () => {
    setForm({ firstName: "", lastName: "", email: "", status: "Active", subscribedAt: "" });
    setAddOpen(true);
  };

  const saveAdd = async () => {
    const fn = form.firstName.trim();
    const ln = form.lastName.trim();
    const em = form.email.trim();
    if (!fn || !ln || !em) return;

    try {
      const res = await fetch(`/api/v1/newsletter-subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapRowToApiPayload({ firstName: fn, lastName: ln, email: em, status: form.status })),
      });

      if (!res.ok) {
        const data = await readJsonSafe(res);
        pushToast({ type: "error", msg: data?.detail || data?.message || "Create failed." }, 4500);
        return;
      }

      const created = await readJsonSafe(res);
      const newRow = created?.id ? mapApiToRow(created) : null;

      if (newRow) setRows((p) => [newRow, ...p]);
      else await fetchUsers();

      setAddOpen(false);
      pushToast({ type: "success", msg: "User added." }, 3000);
    } catch {
      pushToast({ type: "error", msg: "Network error. Create failed." }, 4500);
    }
  };

  const saveEdit = async () => {
    if (!activeRow) return;

    const fn = form.firstName.trim();
    const ln = form.lastName.trim();
    const em = form.email.trim();
    if (!fn || !ln || !em) return;

    const prev = rows;

    setRows((p) => p.map((r) => (r.id === activeRow.id ? { ...r, firstName: fn, lastName: ln, email: em, status: form.status } : r)));

    try {
      const res = await fetch(`/api/v1/newsletter-subscribers/${activeRow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mapRowToApiPayload({ firstName: fn, lastName: ln, email: em, status: form.status })),
      });

      if (!res.ok) {
        const data = await readJsonSafe(res);
        setRows(prev);
        pushToast({ type: "error", msg: data?.detail || data?.message || "Update failed." }, 4500);
        return;
      }

      const updated = await readJsonSafe(res);
      if (updated?.id) {
        const updatedRow = mapApiToRow(updated);
        setRows((p) => p.map((r) => (r.id === updatedRow.id ? updatedRow : r)));
      } else {
        await fetchUsers();
      }

      setEditOpen(false);
      setActiveRow(null);
      pushToast({ type: "success", msg: "User updated." }, 3000);
    } catch {
      setRows(prev);
      pushToast({ type: "error", msg: "Network error. Update failed." }, 4500);
    }
  };

  return (
    <div className="p-6">
      <ToastTopRight toast={toast} onClose={() => setToast(null)} duration={4000} />

      <SectionHeader
        title="Newsletter Subscribers"
        subtitle="Manage newsletter users, status updates, and quick actions."
        right={
          <div className="text-sm font-semibold text-slate-500">
            {loading ? "Loading..." : `${rows.length} total`}
          </div>
        }
      />

      <div className="w-full overflow-x-auto">
        <div className="min-w-225"> 
          <DataTable
            data={filtered}
            rowKey={(r) => r.id}
            columns={columns}
            searchPlaceholder="Search by name/email..."
            filters={[
              {
                key: "status",
                label: "Status",
                value: statusFilter,
                onChange: setStatusFilter,
                options: [
                  { label: "All", value: "all" },
                  { label: "Active", value: "active" },
                  { label: "Unsubscribed", value: "unsubscribed" },
                ],
              },
            ]}
            primaryActionTone="orange"
            primaryAction={{ label: "Add User", onClick: openAdd }}
          />
        </div>
      </div>


      <Modal
        open={addOpen}
        title="Add Newsletter User"
        onClose={() => setAddOpen(false)}
        footer={
          <>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="h-10 cursor-pointer rounded-md border border-black/10 bg-white px-4 text-sm font-extrabold text-slate-800 transition hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveAdd}
              className="h-10 cursor-pointer rounded-md bg-[#ff7a1a] px-4 text-sm font-extrabold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-[#ff7a1a]/20"
            >
              Save
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First Name">
              <Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
            </Field>
            <Field label="Last Name">
              <Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
            </Field>
          </div>

          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </Field>

          <Field label="Status">
            <Select
              value={form.status}
              onChange={(v) => setForm((p) => ({ ...p, status: v as Status }))}
              options={[
                { label: "Active", value: "Active" },
                { label: "Unsubscribed", value: "Unsubscribed" },
              ]}
            />
          </Field>
        </div>
      </Modal>

      <Modal
        open={viewOpen}
        title="Newsletter User"
        onClose={() => {
          setViewOpen(false);
          setActiveRow(null);
        }}
        footer={
          <button
            type="button"
            onClick={() => {
              setViewOpen(false);
              setActiveRow(null);
            }}
            className="h-10 cursor-pointer rounded-md border border-black/10 bg-white px-4 text-sm font-extrabold text-slate-800 transition hover:bg-black/5"
          >
            Close
          </button>
        }
      >
        {activeRow ? (
          <div className="grid gap-3 text-sm font-semibold text-slate-800">
            <div className="grid grid-cols-[140px_1fr] gap-3">
              <span className="text-slate-500">First Name</span>
              <span>{activeRow.firstName}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-3">
              <span className="text-slate-500">Last Name</span>
              <span>{activeRow.lastName}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-3">
              <span className="text-slate-500">Email</span>
              <span>{activeRow.email}</span>
            </div>
            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <span className="text-slate-500">Status</span>
              <span>
                <Pill tone={activeRow.status === "Active" ? "orange" : "slate"}>{activeRow.status}</Pill>
              </span>
            </div>
            <div className="grid grid-cols-[140px_1fr] gap-3">
              <span className="text-slate-500">Updated At</span>
              <span>{toDisplay(activeRow.subscribedAt)}</span>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={editOpen}
        title="Edit Newsletter User"
        onClose={() => {
          setEditOpen(false);
          setActiveRow(null);
        }}
        footer={
          <>
            <button
              type="button"
              onClick={() => {
                setEditOpen(false);
                setActiveRow(null);
              }}
              className="h-10 cursor-pointer rounded-md border border-black/10 bg-white px-4 text-sm font-extrabold text-slate-800 transition hover:bg-black/5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveEdit}
              className="h-10 cursor-pointer rounded-md bg-[#ff7a1a] px-4 text-sm font-extrabold text-white transition hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-[#ff7a1a]/20"
            >
              Save Changes
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="First Name">
              <Input value={form.firstName} onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))} />
            </Field>
            <Field label="Last Name">
              <Input value={form.lastName} onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))} />
            </Field>
          </div>

          <Field label="Email">
            <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </Field>

          <Field label="Status">
            <Select
              value={form.status}
              onChange={(v) => setForm((p) => ({ ...p, status: v as Status }))}
              options={[
                { label: "Active", value: "Active" },
                { label: "Unsubscribed", value: "Unsubscribed" },
              ]}
            />
          </Field>
        </div>
      </Modal>
    </div>
  );
}
