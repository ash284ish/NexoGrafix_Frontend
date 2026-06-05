"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Folder,
  CreditCard,
  User,
  HelpCircle,
  LogOut,
  MessageCircle,
  Upload,
  FolderOpen,
  MessageSquare,
  CheckCircle,
  Download,
} from "lucide-react";

export type Page =
  | "dashboard"
  | "projects"
  | "billing"
  | "settings"
  | "privacy"
  | "security"
  | "profile"
  | "preferences"
  | "support"
  | "upload"
  | "review-images"
  | "generate-alt"
  | "review-approve"
  | "export";

type IconType = React.ComponentType<{ className?: string }>;

type SidebarProps = {
  page: Page;
  setPage: (p: Page) => void;
  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;
  altFlowOpen: boolean;
  setAltFlowOpen: (v: boolean) => void;
};

export default function Sidebar({
  page,
  setPage,
  settingsOpen,
  setSettingsOpen,
  altFlowOpen,
  setAltFlowOpen,
}: SidebarProps) {
  return (
    <aside className="flex w-50 shrink-0 flex-col bg-linear-to-b from-[#0B1A2E] to-[#081425] px-4 py-5 text-white">
      {/* Logo */}
      <div className="mb-6 flex items-center gap-2 px-1">
        <img src="/images/logo.png" alt="Arohio" className="h-10 w-auto" />
      </div>

      {/* Navigation */}
      <nav className="space-y-1 text-sm">
        <NavItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={page === "dashboard"}
          onClick={() => setPage("dashboard")}
        />

        {/* Alt Text Flow */}
        <div className="mt-2">
          <NavItem
            icon={MessageCircle}
            label="Alt Text Flow"
            active={[
              "upload",
              "review-images",
              "generate-alt",
              "review-approve",
              "export",
            ].includes(page)}
            onClick={() => setAltFlowOpen(!altFlowOpen)}
            right={
              <span
                className={`ml-auto text-white/70 transition ${
                  altFlowOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            }
          />

          <AnimatePresence initial={false}>
            {altFlowOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-7 mt-1 space-y-1">
                  <NavSubItem
                    icon={Upload}
                    label="Upload PDF"
                    active={page === "upload"}
                    onClick={() => setPage("upload")}
                  />
                  <NavSubItem
                    icon={FolderOpen}
                    label="Review Images"
                    active={page === "review-images"}
                    onClick={() => setPage("review-images")}
                  />
                  <NavSubItem
                    icon={MessageSquare}
                    label="Generate Alt Text"
                    active={page === "generate-alt"}
                    onClick={() => setPage("generate-alt")}
                  />
                  <NavSubItem
                    icon={CheckCircle}
                    label="Review & Approve"
                    active={page === "review-approve"}
                    onClick={() => setPage("review-approve")}
                  />
                  <NavSubItem
                    icon={Download}
                    label="Export Results"
                    active={page === "export"}
                    onClick={() => setPage("export")}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <NavItem
          icon={Folder}
          label="Projects"
          active={page === "projects"}
          onClick={() => setPage("projects")}
        />

        <NavItem icon={CreditCard} label="Billing & Subscription" />
        <NavItem icon={User} label="My Profile" />
        <NavItem icon={HelpCircle} label="Help / Support" />
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-4">
        <NavItem icon={LogOut} label="Logout" danger />
      </div>
    </aside>
  );
}

/* ---------- NavItem ---------- */

function NavItem({
  label,
  active,
  icon: Icon,
  onClick,
  right,
  danger,
}: {
  label: string;
  active?: boolean;
  icon?: IconType;
  onClick?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}) {
  const base =
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition";
  const activeCls =
    "bg-white/12 text-white shadow-[0_10px_28px_rgba(0,0,0,0.20)]";
  const idleCls = "text-white/80 hover:bg-white/8";
  const dangerCls =
    "text-rose-200 hover:text-rose-100 hover:bg-rose-500/10";

  return (
    <button
      onClick={onClick}
      className={[base, active ? activeCls : idleCls, danger ? dangerCls : ""].join(
        " "
      )}
    >
      {Icon && <Icon className="h-4 w-4 opacity-90" />}
      <span className="font-medium">{label}</span>
      {right}
    </button>
  );
}

/* ---------- NavSubItem ---------- */

function NavSubItem({
  label,
  icon: Icon,
  active,
  onClick,
}: {
  label: string;
  icon?: IconType;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-[13px] transition ${
        active
          ? "bg-white/10 text-white"
          : "text-white/70 hover:bg-white/6 hover:text-white/85"
      }`}
    >
      {Icon && <Icon className="h-4 w-4 opacity-90" />}
      <span className="font-medium">{label}</span>
    </button>
  );
}
