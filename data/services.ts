export type ServiceItem = {
  id: number;
  title: string;
  shortDescription: string;
};

export const services: ServiceItem[] = [
  {
    id: 1,
    title: "AI Services & Automation",
    shortDescription: "Workflow automation, AI tools and process optimization.",
  },
  {
    id: 2,
    title: "Book Publishing & Pre-press",
    shortDescription: "End-to-end pre-press, typesetting and production support.",
  },
  {
    id: 3,
    title: "Academic Content & Assessment",
    shortDescription: "Question banks, curriculum design and learning material.",
  },
];
