"use client";

import React from "react";
import { FiEdit3 } from "react-icons/fi";

type EditableSectionCardProps = {
  title: string;
  subtitle?: string;
  onEdit: () => void;
  editLabel?: string;
};

export default function EditableSectionCard({
  title,
  subtitle,
  onEdit,
  editLabel = "Edit",
}: EditableSectionCardProps) {
  return (
    <div className="rounded-md bg-white p-5 ring-1 ring-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          {subtitle ? (
            <div className="text-sm text-slate-500">{subtitle}</div>
          ) : null}
        </div>

        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
        >
          <FiEdit3 />
          {editLabel}
        </button>
      </div>
    </div>
  );
}
