// components/onboarding/OnboardingStepContent.tsx

type Props = {
  step: number;
};

export default function OnboardingStepContent({ step }: Props) {
  const content = [
    {
      title: "This is your dashboard",
      desc: "Track progress, credits, analytics, and quick actions from one place.",
    },
    {
      title: "Manage your projects",
      desc: "Organize PDFs into projects so accessibility workflows stay clean and structured.",
    },
    {
      title: "Upload your PDFs",
      desc: "Upload PDFs to extract images and start generating alt text automatically.",
    },
    {
      title: "Review extracted images",
      desc: "Select only meaningful images that require alt text. Skip decorative elements.",
    },
    {
      title: "Generate alt text",
      desc: "Edit AI-generated alt text for tone, length, and clarity.",
    },
    {
      title: "Review & approve",
      desc: "Collaborate with reviewers and approvers before final export.",
    },
    {
      title: "Export results",
      desc: "Download accessibility-ready files in your preferred format.",
    },
  ];

  const c = content[step];

  if (!c) return null;

  return (
    <>
      <h2 className="mt-1 text-xl font-semibold text-slate-900">
        {c.title}
      </h2>

      <p className="mt-2 text-sm text-slate-600">
        {c.desc}
      </p>
    </>
  );
}
