export type CaseStudy = {
    id: number;
    clientType: string;
    problem: string;
    delivered: string;
    outcome: string;
    category: string;
};

export const caseStudies: CaseStudy[] = [
    {
        id: 1,
        category: "EdTech & Learning",
        clientType: "K-12 EdTech Provider",
        problem:
            "High manual effort in tagging 10,000+ educational videos for curriculum alignment across multiple state standards.",
        delivered:
            "An AI-assisted tagging system combined with expert subject matter review to ensure pedagogical accuracy.",
        outcome:
            "70% reduction in turnaround time and 99% tagging accuracy, enabling a faster market launch for new curriculum modules.",
    },
    {
        id: 2,
        category: "Publishing & Digitization",
        clientType: "Global Academic Publisher",
        problem:
            "Transitioning a legacy catalog of 5,000+ textbooks to accessible EPUB formats while maintaining complex mathematical notation.",
        delivered:
            "A custom automated conversion pipeline with manual quality checks for math, complex tables, and alt-text for technical illustrations.",
        outcome:
            "Completed the migration in 6 months with full WCAG 2.1 Level AA compliance across the entire digital library.",
    },
    {
        id: 3,
        category: "Localization & Media",
        clientType: "Mobile Language Learning Startup",
        problem:
            "Scaling content localization for 12 European languages with limited internal bandwidth and tight deadlines.",
        delivered:
            "Managed localization services including transcreation, cultural sensitivity reviews, and automated QA workflows.",
        outcome:
            "Successfully launched in 12 new markets within a single quarter, resulting in a 40% increase in international user base.",
    },
];
