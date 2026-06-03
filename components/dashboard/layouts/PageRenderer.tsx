"use client";

import { AnimatePresence, motion } from "framer-motion";
import PayrollPage from "./PayrollPage";
import UploadPdfPage from "./UploadPdfPage";
import ExtractedImagesPage from "./ExtractedImagesPage";
import AltTextEditorPage from "./AltTextEditorPage";
import ReviewApprovalPage from "./ReviewApprovalPage";
import ExportResultsPage from "./ExportResultsPage";
import ProjectsPage from "./ProjectsPage";

type Page =
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

type Props = {
  page: Page;
  setPage: (p: Page) => void;
};

export default function PageRenderer({ page, setPage }: Props) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={page}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.22 }}
        className="min-w-0"
      >
        {renderPage(page, setPage)}
      </motion.div>
    </AnimatePresence>
  );
}

/* -------- page switch logic stays isolated here -------- */

function renderPage(page: Page, setPage: (p: Page) => void) {
  switch (page) {
    case "dashboard":
      return <PayrollPage onUploadClick={() => setPage("upload")} />;

    case "projects":
      return <ProjectsPage />;

    case "upload":
      return <UploadPdfPage />;

    case "review-images":
      return <ExtractedImagesPage />;

    case "generate-alt":
      return <AltTextEditorPage />;

    case "review-approve":
      return <ReviewApprovalPage />;

    case "export":
      return <ExportResultsPage />;

    default:
      return (
        <div className="rounded-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
          This section is not available yet.
        </div>
      );
  }
}
