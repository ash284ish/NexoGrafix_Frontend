"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../dashboard/layouts/Sidebar";
import TopBar from "../dashboard/layouts/TopBar";
import PayrollPage from "../dashboard/layouts/PayrollPage";
import UploadPdfPage from "../dashboard/layouts/UploadPdfPage";
import ExtractedImagesPage from "../dashboard/layouts/ExtractedImagesPage";
import AltTextEditorPage from "../dashboard/layouts/AltTextEditorPage";
import ReviewApprovalPage from "../dashboard/layouts/ReviewApprovalPage";
import ExportResultsPage from "../dashboard/layouts/ExportResultsPage";
import ProjectsPage from "../dashboard/layouts/ProjectsPage";
import OnboardingStepContent from "../dashboard/layouts/OnboardingStepContent";

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

export default function DashboardRemoteStyle() {
  const [page, setPage] = useState<Page>("dashboard");
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [altFlowOpen, setAltFlowOpen] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<number | null>(0);

  const onboardingFlow: Page[] = [
    "dashboard",
    "projects",
    "upload",
    "review-images",
    "generate-alt",
    "review-approve",
    "export",
  ];

  const goToPage = (p: Page) => {
    setPage(p);
    if (
      p === "upload" ||
      p === "review-images" ||
      p === "generate-alt" ||
      p === "review-approve" ||
      p === "export"
    ) {
      setAltFlowOpen(true);
    }
  };

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-slate-100">
      <Sidebar
        page={page}
        setPage={goToPage}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        altFlowOpen={altFlowOpen}
        setAltFlowOpen={setAltFlowOpen}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="min-w-0 flex-1 overflow-y-auto px-6 py-6">
          {onboardingStep !== null && page === onboardingFlow[onboardingStep] && (
            <OnboardingPopup
              step={onboardingStep}
              onNext={() => {
                if (onboardingStep === null) return;

                const nextStep = onboardingStep + 1;

                if (nextStep >= onboardingFlow.length) {
                  setOnboardingStep(null);
                  return;
                }

                const nextPage = onboardingFlow[nextStep];
                goToPage(nextPage);
                setOnboardingStep(nextStep);
              }}
            />
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.22 }}
              className="min-w-0"
            >
              {renderPage(page, goToPage)}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

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

function OnboardingPopup({ step, onNext }: { step: number; onNext: () => void }) {
  return (
    <div className="absolute inset-0 z-40 flex items-start justify-center pt-40">
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative w-full max-w-lg rounded-md bg-white p-6 shadow-xl">
        <div className="text-sm font-semibold text-slate-500">
          Step {step + 1} of 7
        </div>
        <OnboardingStepContent step={step} />
        <div className="mt-6 flex justify-end">
          <button
            onClick={onNext}
            className="rounded-md bg-teal-500 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}