export interface Applicant {
    id: string;
    initials: string;
    name: string;
    email: string;
    position: string;
    jobId: string;
    experience: string;
    status: string;
    date: string;
    noticePeriod: string;
}

export const applicants: Applicant[] = [
    {
        id: "ps-1",
        initials: "PS",
        name: "Priya Sharma",
        email: "priya.sharma@email.com",
        position: "Sr. Frontend Developer",
        jobId: "frontend",
        experience: "5 years",
        status: "Shortlisted",
        date: "Mar 3, 2026",
        noticePeriod: "IMMEDIATE",
    },
    {
        id: "rm-1",
        initials: "RM",
        name: "Rahul Mehta",
        email: "rahul.mehta@email.com",
        position: "Backend Engineer",
        jobId: "backend",
        experience: "3 years",
        status: "In Review",
        date: "Mar 2, 2026",
        noticePeriod: "30_DAYS",
    },
    {
        id: "ad-1",
        initials: "AD",
        name: "Anita Desai",
        email: "anita.desai@email.com",
        position: "Product Designer",
        jobId: "designer",
        experience: "4 years",
        status: "Shortlisted",
        date: "Mar 1, 2026",
        noticePeriod: "15_DAYS",
    },
    {
        id: "vs-1",
        initials: "VS",
        name: "Vikram Singh",
        email: "vikram.singh@email.com",
        position: "Data Analyst",
        jobId: "analyst",
        experience: "2 years",
        status: "Rejected",
        date: "Feb 28, 2026",
        noticePeriod: "60_DAYS",
    },
    {
        id: "nk-1",
        initials: "NK",
        name: "Neha Kapoor",
        email: "neha.kapoor@email.com",
        position: "DevOps Engineer",
        jobId: "devops",
        experience: "6 years",
        status: "Shortlisted",
        date: "Feb 27, 2026",
        noticePeriod: "IMMEDIATE",
    },
    {
        id: "ak-1",
        initials: "AK",
        name: "Amit Kumar",
        email: "amit.kumar@email.com",
        position: "Sr. Frontend Developer",
        jobId: "frontend",
        experience: "4 years",
        status: "In Review",
        date: "Feb 26, 2026",
        noticePeriod: "30_DAYS",
    },
    {
        id: "sp-1",
        initials: "SP",
        name: "Sneha Patel",
        email: "sneha.patel@email.com",
        position: "Backend Engineer",
        jobId: "backend",
        experience: "5 years",
        status: "In Review",
        date: "Feb 25, 2026",
        noticePeriod: "15_DAYS",
    },
    {
        id: "rg-1",
        initials: "RG",
        name: "Rohan Gupta",
        email: "rohan.gupta@email.com",
        position: "Product Designer",
        jobId: "designer",
        experience: "3 years",
        status: "Shortlisted",
        date: "Feb 24, 2026",
        noticePeriod: "90_DAYS",
    },
];

export const activeJobs = [
    {
        id: "all",
        title: "All Applications",
        department: "",
        color: "bg-[#0f766d]",
    },
    {
        id: "frontend",
        title: "Sr. Frontend Developer",
        department: "Engineering",
        color: "bg-[#6366F1]",
    },
    {
        id: "backend",
        title: "Backend Engineer",
        department: "Engineering",
        color: "bg-[#0EA5E9]",
    },
    {
        id: "designer",
        title: "Product Designer",
        department: "Design",
        color: "bg-[#F59E0B]",
    },
    {
        id: "analyst",
        title: "Data Analyst",
        department: "Analytics",
        color: "bg-[#EF4444]",
    },
    {
        id: "devops",
        title: "DevOps Engineer",
        department: "Engineering",
        color: "bg-[#8B5CF6]",
    },
];

// Helper to compute counts
export function getJobCount(jobId: string): number {
    if (jobId === "all") return applicants.length;
    return applicants.filter((a) => a.jobId === jobId).length;
}

export function getStatusCount(status: string, jobId = "all"): number {
    const filtered = jobId === "all" ? applicants : applicants.filter((a) => a.jobId === jobId);
    if (status === "All") return filtered.length;
    return filtered.filter((a) => a.status === status).length;
}
