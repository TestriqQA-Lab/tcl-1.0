// Mock data for job detail page

export interface JobDetail {
    id: string;
    title: string;
    company: {
        name: string;
        logo: string;
        industry: string;
        description: string;
    };
    location: string;
    type: string;
    salary: string;
    overview: string[];
    responsibilities: string[];
    requirements: string[];
    howToApply: string;
    breadcrumbs: { label: string; href: string }[];
}

export interface SimilarJob {
    id: string;
    title: string;
    company: string;
    location: string;
    color: string;
}

export const JOB_DETAIL: JobDetail = {
    id: "1",
    title: "Product Designer",
    company: {
        name: "Stripe",
        logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9Zr0zZLAImweO7R3BvYv5fTdgteiAgQO6aBmEvQ9_4XDCeZxqdG6iFrsK3XnPjCaosMgqEDduy9dvcBlS0ceyWB8wYDvqFb_j6IPnIvD36tvqaPsc7YElzJFxLNGEO6MW8EWJHR9VbX9BqKWAICKZtGierY06MK2-q1iT2YxQA6Pe6K-cYsYNL8SB4QcMGCJhk5KJCGF-mODYbKYh6T4t2NWXTolIs3Rljq_cTQ6lAVJp8On2TcO8zPL_eLJJYxABRk10u8wrTSxj",
        industry: "Fintech",
        description: "A technology company that builds economic infrastructure for the internet. Millions of companies of all sizes use Stripe's software.",
    },
    location: "Remote / San Francisco",
    type: "Full-time",
    salary: "$140k - $180k",
    overview: [
        "Stripe is looking for a Product Designer to help us build the future of economic infrastructure. You will work closely with engineering and product to create seamless payment experiences used by millions.",
        "At Stripe, we're building the infrastructure that powers the global economy. As a Product Designer on our team, you'll be at the forefront of designing how businesses of all sizes interact with financial systems. Your work will directly impact how people start, run, and scale their businesses online.",
    ],
    responsibilities: [
        "Design end-to-end user journeys that make complex financial operations feel simple and intuitive.",
        "Collaborate with product managers and engineers to define product roadmaps and technical requirements.",
        "Develop high-fidelity prototypes to test and validate your design hypotheses with real users.",
        "Contribute to and maintain Stripe's global design system, ensuring consistency across all platforms.",
    ],
    requirements: [
        "4+ years of experience designing digital products, preferably in the B2B or fintech space.",
        "Strong portfolio showcasing your problem-solving process and visual design excellence.",
        "Proficiency in Figma and modern design tools for prototyping and specification.",
        "Excellent communication skills and the ability to articulate design decisions to stakeholders.",
    ],
    howToApply: "If you're interested in this role, please submit your resume and a link to your portfolio. We value diversity and welcome applications from people of all backgrounds.",
    breadcrumbs: [
        { label: "Jobs", href: "/search" },
        { label: "Design", href: "/search?category=design" },
        { label: "Product Designer", href: "" },
    ],
};

export const SIMILAR_JOBS: SimilarJob[] = [
    {
        id: "s1",
        title: "Senior UI Designer",
        company: "Coinbase",
        location: "Remote",
        color: "bg-blue-600",
    },
    {
        id: "s2",
        title: "Product Designer",
        company: "Wise",
        location: "London, UK",
        color: "bg-blue-400",
    },
    {
        id: "s3",
        title: "Visual Designer",
        company: "Brex",
        location: "San Francisco",
        color: "bg-orange-500",
    },
];
