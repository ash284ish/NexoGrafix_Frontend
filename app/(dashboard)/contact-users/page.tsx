"use client";

import React, { useEffect, useMemo, useState } from "react";
import DataTable, { Pill, TableActions, type DataTableColumn } from "@/components/ui/DataTable";
import ToastTopRight, { type ToastState } from "@/components/ui/Toast";
import SectionHeader from "@/components/dashboard/assets/SectionHeader";

type ContactStatus = "new" | "in_progress" | "resolved" | "declined";

type ContactRow = {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  note: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
  created: string;
  actions: string;
};

type ApiContact = {
  id: number | string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
  note?: string;
  status?: ContactStatus;
  created_at?: string;
  updated_at?: string;
};

type AddContactForm = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  note: string;
};

type EditContactForm = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  note: string;
  status: ContactStatus;
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
          className="w-full max-w-160 overflow-hidden rounded-md border border-black/10 bg-white shadow-[0_22px_70px_-30px_rgba(0,0,0,0.45)]"
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

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-10 w-full rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/12"
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      rows={4}
      className="w-full rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/12"
    />
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: Array<{ label: string; value: string }>;
  placeholder?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full cursor-pointer rounded-md border border-black/10 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-[#ff7a1a]/60 focus:ring-4 focus:ring-[#ff7a1a]/12"
    >
      {placeholder ? (
        <option value="" disabled>
          {placeholder}
        </option>
      ) : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function toDisplay(v: string) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString();
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const serviceOptions = [
  "AI-enabled Publishing Services",
  "Content Production / Conversion",
  "Assessment / Question Bank Solutions",
  "AI Automation / Workflow Setup",
  "Website / Product Engineering",
  "Support / Maintenance",
].map((s) => ({ label: s, value: s }));

function mapApiToRow(u: ApiContact): ContactRow {
  const firstName = u.first_name || "";
  const lastName = u.last_name || "";
  const name = `${firstName} ${lastName}`.trim();
  const createdAt = u.created_at || "";
  return {
    id: String(u.id),
    firstName,
    lastName,
    name,
    email: u.email || "",
    phone: u.phone || "",
    service: u.service || "",
    message: u.message || "",
    note: u.note || "",
    status: u.status || "new",
    createdAt,
    updatedAt: u.updated_at || "",
    created: createdAt,
    actions: "",
  };
}

async function readJsonSafe(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function ContactRequestsPage() {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [form, setForm] = useState<AddContactForm | EditContactForm | null>(null);
  const [activeRow, setActiveRow] = useState<ContactRow | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ContactRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);

  const pushToast = (t: Exclude<ToastState, null>, ttl = 4000) => {
    setToast(t);
    window.setTimeout(() => setToast(null), ttl);
  };

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/contact-requests`, { cache: "no-store" });
      const data = await readJsonSafe(res);
      if (!res.ok) throw new Error();
      setRows((data || []).map(mapApiToRow));
    } catch {
      pushToast({ type: "error", msg: "Failed to load contact requests." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return rows;
    return rows.filter((r) => r.status === statusFilter);
  }, [rows, statusFilter]);

  const columns = useMemo<DataTableColumn<ContactRow>[]>(
    () => [
      {
        key: "name",
        header: "Name",
        render: (r) => (
          <div>
            <div className="font-extrabold text-slate-900">
              {r.firstName} {r.lastName}
            </div>
            <div className="text-xs font-semibold text-slate-500">{r.email}</div>
          </div>
        ),
      },
      { key: "phone", header: "Phone", render: (r) => r.phone || "-" },
      { key: "service", header: "Service", render: (r) => r.service || "-" },
      {
        key: "status",
        header: "Status",
        render: (r) => (
          <Pill tone={r.status === "resolved" ? "slate" : r.status === "in_progress" ? "orange" : "slate"}>
            {r.status}
          </Pill>
        ),
      },
      { key: "created", header: "Created At", render: (r) => toDisplay(r.createdAt) },
      {
        key: "actions",
        header: "Actions",
        className: "text-right",
        render: (r) => (
          <div className="cursor-pointer">
            <TableActions
              onView={() => {
                setActiveRow(r);
                setViewOpen(true);
              }}
              onEdit={() => {
                setForm({
                  id: r.id,
                  firstName: r.firstName,
                  lastName: r.lastName,
                  email: r.email,
                  phone: r.phone,
                  service: r.service,
                  message: r.message,
                  note: r.note,
                  status: r.status,
                });
                setEditOpen(true);
              }}
              onDelete={() => {
                setPendingDelete(r);
                setConfirmOpen(true);
              }}
            />
          </div>
        ),
      },
    ],
    []
  );

  const saveAdd = async () => {
    if (!form) return;
    const f = form as AddContactForm;
    try {
      const res = await fetch(`/api/v1/contact-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, status: "new" }),
      });
      if (!res.ok) throw new Error();
      await fetchData();
      setAddOpen(false);
      pushToast({ type: "success", msg: "Contact request created." });
    } catch {
      pushToast({ type: "error", msg: "Create failed." });
    }
  };

  const saveEdit = async () => {
    if (!form) return;
    const f = form as EditContactForm;
    try {
      const res = await fetch(`/api/v1/contact-requests/${f.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: f.firstName,
          last_name: f.lastName,
          email: f.email,
          phone: f.phone,
          service: f.service,
          message: f.message,
          note: f.note,
          status: f.status,
        }),
      });
      if (!res.ok) throw new Error();
      await fetchData();
      setEditOpen(false);
      pushToast({ type: "success", msg: "Updated successfully." });
    } catch {
      pushToast({ type: "error", msg: "Update failed." });
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/contact-requests/${pendingDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setConfirmOpen(false);
      setPendingDelete(null);
      await fetchData();
      pushToast({ type: "success", msg: "Deleted successfully." });
    } catch {
      pushToast({ type: "error", msg: "Delete failed." });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <ToastTopRight toast={toast} onClose={() => setToast(null)} />

      <SectionHeader
        title="Contact Submissions"
        subtitle="View and manage all contact form submissions and follow-ups."
        right={<div className="text-sm font-semibold text-slate-500">{loading ? "Loading..." : `${rows.length} total`}</div>}
      />

      <DataTable<ContactRow>
        data={filtered}
        rowKey={(r: ContactRow) => r.id}
        columns={columns}
        searchPlaceholder="Search by name, email, phone..."
        primaryAction={{
          label: "Add Contact",
          onClick: () => {
            setForm({
              first_name: "",
              last_name: "",
              email: "",
              phone: "",
              service: "",
              message: "",
              note: "",
            });
            setAddOpen(true);
          },
        }}
        filters={[
          {
            key: "status",
            label: "Status",
            value: statusFilter,
            onChange: (v) => setStatusFilter(v as ContactStatus | "all"),
            options: [
              { label: "All", value: "all" },
              { label: "New", value: "new" },
              { label: "In Progress", value: "in_progress" },
              { label: "Resolved", value: "resolved" },
            ],
          },
        ]}
      />

      <Modal
        open={viewOpen}
        title="View Contact Request"
        onClose={() => {
          setViewOpen(false);
          setActiveRow(null);
        }}
        footer={
          <button
            className="h-10 cursor-pointer rounded-md border px-4 font-semibold"
            onClick={() => {
              setViewOpen(false);
              setActiveRow(null);
            }}
          >
            Close
          </button>
        }
      >
        {activeRow ? (
          <div className="grid gap-4">
            <div className="grid gap-2 rounded-lg border border-black/10 bg-slate-50 p-4">
              <div className="text-sm font-extrabold text-slate-900">
                {activeRow.firstName} {activeRow.lastName}
              </div>
              <div className="text-xs font-semibold text-slate-600">{activeRow.email || "-"}</div>
              <div className="text-xs font-semibold text-slate-600">{activeRow.phone || "-"}</div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-semibold text-slate-600">Service</div>
              <div className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                {activeRow.service || "-"}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-semibold text-slate-600">Message</div>
              <div className="whitespace-pre-wrap rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                {activeRow.message || "-"}
              </div>
            </div>

            <div className="grid gap-2">
              <div className="text-xs font-semibold text-slate-600">Note</div>
              <div className="whitespace-pre-wrap rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                {activeRow.note || "-"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <div className="text-xs font-semibold text-slate-600">Status</div>
                <div className="w-fit">
                  <Pill
                    tone={
                      activeRow.status === "resolved"
                        ? "slate"
                        : activeRow.status === "in_progress"
                          ? "orange"
                          : "slate"
                    }
                  >
                    {activeRow.status}
                  </Pill>

                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-xs font-semibold text-slate-600">Created</div>
                <div className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                  {toDisplay(activeRow.createdAt) || "-"}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="text-xs font-semibold text-slate-600">Updated</div>
                <div className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-slate-900">
                  {toDisplay(activeRow.updatedAt) || "-"}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={confirmOpen}
        title="Confirm Delete"
        onClose={() => {
          if (deleting) return;
          setConfirmOpen(false);
          setPendingDelete(null);
        }}
        footer={
          <>
            <button
              className="h-10 cursor-pointer rounded-md border px-4 font-semibold disabled:cursor-not-allowed disabled:opacity-60"
              disabled={deleting}
              onClick={() => {
                setConfirmOpen(false);
                setPendingDelete(null);
              }}
            >
              Cancel
            </button>
            <button
              className="h-10 cursor-pointer rounded-md bg-red-600 px-4 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </>
        }
      >
        <div className="grid gap-2">
          <div className="text-sm font-semibold text-slate-900">Are you sure you want to delete this contact request?</div>
          <div className="text-sm text-slate-600">
            {pendingDelete ? (
              <>
                <span className="font-semibold text-slate-900">
                  {pendingDelete.firstName} {pendingDelete.lastName}
                </span>{" "}
                — <span className="font-semibold">{pendingDelete.email || pendingDelete.phone || pendingDelete.id}</span>
              </>
            ) : null}
          </div>
          <div className="text-xs font-semibold text-slate-500">This action cannot be undone.</div>
        </div>
      </Modal>

      <Modal
        open={addOpen}
        title="Add Contact Request"
        onClose={() => setAddOpen(false)}
        footer={
          <>
            <button className="h-10 cursor-pointer rounded-md border px-4" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button className="h-10 cursor-pointer rounded-md bg-[#ff7a1a] px-4 font-semibold text-white" onClick={saveAdd}>
              Save
            </button>
          </>
        }
      >
        <div className="grid gap-4">
          <Input
            placeholder="First Name"
            value={(form as AddContactForm | null)?.first_name || ""}
            onChange={(e) => setForm({ ...(form as AddContactForm), first_name: e.target.value })}
          />
          <Input
            placeholder="Last Name"
            value={(form as AddContactForm | null)?.last_name || ""}
            onChange={(e) => setForm({ ...(form as AddContactForm), last_name: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={(form as AddContactForm | null)?.email || ""}
            onChange={(e) => setForm({ ...(form as AddContactForm), email: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={(form as AddContactForm | null)?.phone || ""}
            onChange={(e) => setForm({ ...(form as AddContactForm), phone: e.target.value })}
          />

          <Select
            value={(form as AddContactForm | null)?.service || ""}
            onChange={(v) => setForm({ ...(form as AddContactForm), service: v })}
            options={serviceOptions}
            placeholder="Select Service"
          />

          <Textarea
            placeholder="Message"
            value={(form as AddContactForm | null)?.message || ""}
            onChange={(e) => setForm({ ...(form as AddContactForm), message: e.target.value })}
          />
          <Textarea
            placeholder="Note"
            value={(form as AddContactForm | null)?.note || ""}
            onChange={(e) => setForm({ ...(form as AddContactForm), note: e.target.value })}
          />
        </div>
      </Modal>

      <Modal
        open={editOpen}
        title="Edit Contact Request"
        onClose={() => setEditOpen(false)}
        footer={
          <>
            <button className="h-10 cursor-pointer rounded-md border px-4" onClick={() => setEditOpen(false)}>
              Cancel
            </button>
            <button className="h-10 cursor-pointer rounded-md bg-[#ff7a1a] px-4 font-semibold text-white" onClick={saveEdit}>
              Save
            </button>
          </>
        }
      >
        {form ? (
          <div className="grid gap-4">
            <Input
              value={(form as EditContactForm).firstName || ""}
              onChange={(e) => setForm({ ...(form as EditContactForm), firstName: e.target.value })}
            />
            <Input
              value={(form as EditContactForm).lastName || ""}
              onChange={(e) => setForm({ ...(form as EditContactForm), lastName: e.target.value })}
            />
            <Input
              value={(form as EditContactForm).email || ""}
              onChange={(e) => setForm({ ...(form as EditContactForm), email: e.target.value })}
            />
            <Input
              value={(form as EditContactForm).phone || ""}
              onChange={(e) => setForm({ ...(form as EditContactForm), phone: e.target.value })}
            />

            <Select
              value={(form as EditContactForm).service || ""}
              onChange={(v) => setForm({ ...(form as EditContactForm), service: v })}
              options={serviceOptions}
            />

            <Textarea
              value={(form as EditContactForm).message || ""}
              onChange={(e) => setForm({ ...(form as EditContactForm), message: e.target.value })}
            />
            <Textarea
              value={(form as EditContactForm).note || ""}
              onChange={(e) => setForm({ ...(form as EditContactForm), note: e.target.value })}
            />

            <Select
              value={(form as EditContactForm).status}
              onChange={(v) => setForm({ ...(form as EditContactForm), status: v as ContactStatus })}
              options={[
                { label: "New", value: "new" },
                { label: "In Progress", value: "in_progress" },
                { label: "Resolved", value: "resolved" },
                { label: "Declined", value: "declined" },
              ]}
            />
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
