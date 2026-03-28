// ─── Types ────────────────────────────────────────────────────────────────────
export type ApplicationStatus = "Pending" | "Reviewed" | "Rejected";

export interface TimelineEvent {
    title: string;
    description: string;
    date: string;
    icon: "send" | "eye" | "calendar" | "check" | "x" | "draft" | "video";
    isHighlighted?: boolean;
    actionLabel?: string;
    actionUrl?: string;
}

export interface ApplicationMock {
    id: string;
    jobTitle: string;
    company: string;
    companyInitials: string;
    companyColor: string;           // bg color for avatar
    location: string;
    jobType: string;                // Full-time, Part-time, Contract
    workMode: string;               // Remote, Hybrid, On-site
    salary: string;
    dateApplied: string;            // Human readable
    daysAgo: number;
    status: ApplicationStatus;
    matchScore: number;             // 0-100 percentage
    resumeUsed: string;
    coverLetterAttached: boolean;
    timeline: TimelineEvent[];
    jobSummary: string;
    requiredSkills: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
export const mockApplications: ApplicationMock[] = [
    {
        id: "APP-2024-4801",
        jobTitle: "Senior Product Manager",
        company: "TechFlow Inc.",
        companyInitials: "TF",
        companyColor: "bg-[#115e59]",
        location: "San Francisco, CA",
        jobType: "Full-time",
        workMode: "Remote",
        salary: "₹14L – ₹18L",
        dateApplied: "Oct 24, 2023",
        daysAgo: 2,
        status: "Reviewed",
        matchScore: 92,
        resumeUsed: "Product_Manager_Resume_v4.pdf",
        coverLetterAttached: true,
        timeline: [
            {
                title: "Profile Viewed by Employer",
                description: "Your application was reviewed by the hiring team",
                date: "Oct 25, 2023",
                icon: "eye",
                isHighlighted: true,
            },
            {
                title: "Application Submitted",
                description: "Successfully sent to TechFlow Inc.",
                date: "Oct 24, 2023",
                icon: "send",
            },
            {
                title: "Draft Saved",
                description: "You saved a draft of this application",
                date: "Oct 23, 2023",
                icon: "draft",
            },
        ],
        jobSummary:
            "Leading the product roadmap for our core SaaS platform. Responsible for feature definition, sprint planning, and cross-functional team leadership. You will work directly with engineering and design to ship high-quality products.",
        requiredSkills: ["Product Strategy", "Agile", "Roadmapping", "SQL", "Figma"],
    },
    {
        id: "APP-2024-4802",
        jobTitle: "Frontend Developer",
        company: "Pixelcraft Studios",
        companyInitials: "PS",
        companyColor: "bg-violet-600",
        location: "Austin, TX",
        jobType: "Full-time",
        workMode: "Hybrid",
        salary: "₹12L – ₹15L",
        dateApplied: "Oct 22, 2023",
        daysAgo: 4,
        status: "Reviewed",
        matchScore: 87,
        resumeUsed: "Frontend_Dev_Resume.pdf",
        coverLetterAttached: true,
        timeline: [
            {
                title: "Profile Viewed by Employer",
                description: "Your application was reviewed",
                date: "Oct 23, 2023",
                icon: "eye",
            },
            {
                title: "Application Submitted",
                description: "Successfully sent to Pixelcraft Studios",
                date: "Oct 22, 2023",
                icon: "send",
            },
        ],
        jobSummary:
            "Build high-performance, accessible web applications using React, Next.js, and TypeScript. Collaborate closely with designers and backend engineers.",
        requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git"],
    },
    {
        id: "APP-2024-4803",
        jobTitle: "Data Analyst",
        company: "FinGroup Analytics",
        companyInitials: "FG",
        companyColor: "bg-amber-600",
        location: "Chicago, IL",
        jobType: "Contract",
        workMode: "On-site",
        salary: "₹9L – ₹11L",
        dateApplied: "Oct 20, 2023",
        daysAgo: 6,
        status: "Pending",
        matchScore: 78,
        resumeUsed: "Data_Analyst_Resume.pdf",
        coverLetterAttached: false,
        timeline: [
            {
                title: "Application Submitted",
                description: "Successfully sent to FinGroup Analytics",
                date: "Oct 20, 2023",
                icon: "send",
            },
        ],
        jobSummary:
            "Analyze large datasets to drive business decisions. Strong SQL, Python, and data visualization skills required.",
        requiredSkills: ["SQL", "Python", "Tableau", "Excel", "Statistics"],
    },
    {
        id: "APP-2024-4804",
        jobTitle: "UX Designer",
        company: "DesignHub Co.",
        companyInitials: "DH",
        companyColor: "bg-rose-600",
        location: "New York, NY",
        jobType: "Full-time",
        workMode: "Remote",
        salary: "₹13L – ₹16L",
        dateApplied: "Oct 18, 2023",
        daysAgo: 8,
        status: "Reviewed",
        matchScore: 95,
        resumeUsed: "UX_Designer_Resume.pdf",
        coverLetterAttached: true,
        timeline: [
            {
                title: "Profile Viewed by Employer",
                description: "Your application was reviewed",
                date: "Oct 20, 2023",
                icon: "eye",
                isHighlighted: true,
            },
            {
                title: "Application Submitted",
                description: "Successfully sent to DesignHub Co.",
                date: "Oct 18, 2023",
                icon: "send",
            },
        ],
        jobSummary:
            "Design beautiful, intuitive user experiences for our flagship product. Lead user research and prototype testing sessions.",
        requiredSkills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
    },
    {
        id: "APP-2024-4805",
        jobTitle: "Backend Engineer",
        company: "CloudScale Systems",
        companyInitials: "CS",
        companyColor: "bg-sky-600",
        location: "Seattle, WA",
        jobType: "Full-time",
        workMode: "Hybrid",
        salary: "₹15L – ₹19L",
        dateApplied: "Oct 15, 2023",
        daysAgo: 11,
        status: "Rejected",
        matchScore: 72,
        resumeUsed: "Backend_Engineer_Resume.pdf",
        coverLetterAttached: true,
        timeline: [
            {
                title: "Application Not Selected",
                description: "CloudScale Systems has moved forward with other candidates",
                date: "Oct 22, 2023",
                icon: "x",
            },
            {
                title: "Profile Viewed by Employer",
                description: "Your application was reviewed",
                date: "Oct 18, 2023",
                icon: "eye",
            },
            {
                title: "Application Submitted",
                description: "Successfully sent to CloudScale Systems",
                date: "Oct 15, 2023",
                icon: "send",
            },
        ],
        jobSummary:
            "Build scalable microservices and APIs powering millions of requests daily using Node.js, Go, and AWS infrastructure.",
        requiredSkills: ["Node.js", "Go", "AWS", "PostgreSQL", "Docker"],
    },
    {
        id: "APP-2024-4806",
        jobTitle: "Marketing Lead",
        company: "GrowthCo",
        companyInitials: "GC",
        companyColor: "bg-emerald-600",
        location: "Miami, FL",
        jobType: "Full-time",
        workMode: "Remote",
        salary: "₹11L – ₹14L",
        dateApplied: "Oct 12, 2023",
        daysAgo: 14,
        status: "Pending",
        matchScore: 81,
        resumeUsed: "Marketing_Lead_Resume.pdf",
        coverLetterAttached: false,
        timeline: [
            {
                title: "Application Submitted",
                description: "Successfully sent to GrowthCo",
                date: "Oct 12, 2023",
                icon: "send",
            },
        ],
        jobSummary:
            "Lead go-to-market strategy for B2B SaaS products. Own the full marketing funnel from awareness to conversion.",
        requiredSkills: ["SEO", "Content Marketing", "Google Analytics", "HubSpot", "Copywriting"],
    },
];

// ─── Stats derived from mock ──────────────────────────────────────────────────
export const applicationStats = {
    total: 24,
    pending: 14,
    reviewed: 7,
    rejected: 3,
};
