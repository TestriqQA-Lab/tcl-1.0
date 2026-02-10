export interface Company {
    id: string;
    name: string;
    tagline: string;
    logo_bg: string; // Tailwind class for logo background
    logo_icon: string; // Material Symbol name
    banner_image?: string; // Optional banner
    location: string;
    employees: string;
    verified: boolean;
    about: string[];
    culture: {
        icon: string;
        icon_bg: string; // Tailwind class
        icon_color: string; // Tailwind class
        title: string;
        description: string;
    }[];
    roles: {
        id: string;
        title: string;
        type: string;
        location: string;
        posted_at: string;
    }[];
    perks: {
        label: string;
        bg: string; // Tailwind class
        text: string; // Tailwind class
        border?: string; // Tailwind class
    }[];
    headquarters: {
        address: string[];
        map_image: string;
        map_alt: string;
    };
    website: string;
    founded: string;
    socials: {
        platform: string;
        url: string;
        icon: string;
    }[];
}

export const COMPANY_DATA: Company = {
    id: "techflow-systems",
    name: "TechFlow Systems",
    tagline: "Building the future of cloud infrastructure",
    logo_bg: "bg-[#0f766d]/10",
    logo_icon: "cloud_done", // Using Verified Icon as logo based on code.html
    location: "San Francisco, CA",
    employees: "250-500 employees",
    verified: true,
    about: [
        "TechFlow Systems is a pioneer in hyperscale cloud orchestration. We enable modern enterprises to scale their infrastructure with unprecedented speed and security. Founded in 2018, we have rapidly become the backbone of hundreds of Fortune 500 tech stacks.",
        "Our mission is to democratize complex cloud infrastructure through intelligent automation and world-class developer experiences. We believe that the best engineering happens when people feel supported, inspired, and empowered to take risks."
    ],
    culture: [
        {
            icon: "diversity_3",
            icon_bg: "bg-[#0f766d]/10",
            icon_color: "text-[#0f766d]",
            title: "Collaboration",
            description: "We believe in cross-functional squads where every voice matters and silos are non-existent."
        },
        {
            icon: "lightbulb",
            icon_bg: "bg-amber-500/10",
            icon_color: "text-amber-600",
            title: "Innovation",
            description: "20% time for passion projects and a weekly engineering showcase for new experimental tech."
        },
        {
            icon: "trending_up",
            icon_bg: "bg-indigo-500/10",
            icon_color: "text-indigo-600",
            title: "Growth",
            description: "Dedicated mentorship programs and a $5k annual professional development budget for all."
        }
    ],
    roles: [
        {
            id: "1",
            title: "Senior Cloud Infrastructure Engineer",
            type: "Full-time",
            location: "Remote",
            posted_at: "2 days ago"
        },
        {
            id: "2",
            title: "Lead Product Designer",
            type: "Full-time",
            location: "San Francisco, CA",
            posted_at: "5 days ago"
        },
        {
            id: "3",
            title: "DevOps Specialist (K8s)",
            type: "Contract",
            location: "Hybrid",
            posted_at: "1 week ago"
        }
    ],
    perks: [
        { label: "Flexible PTO", bg: "bg-[#0f766d]/10", text: "text-[#0f766d]", border: "border-[#0f766d]/20" },
        { label: "Health Insurance", bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
        { label: "Equity (ESOP)", bg: "bg-[#0f766d]", text: "text-white" },
        { label: "Learning Budget", bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20" },
        { label: "Home Office Stipend", bg: "bg-[#0f766d]/5", text: "text-[#0f766d]/80", border: "border-[#0f766d]/10" },
        { label: "Parental Leave", bg: "bg-slate-100", text: "text-slate-600" },
        { label: "Free Lunch", bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200" },
    ],
    headquarters: {
        address: ["345 Market Street, Suite 1200", "San Francisco, CA 94105"],
        map_image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMFQJXklRkb9krADKPBF3x7m83YCa-a5HUTR-C2nK_VYTiKR_iwQxxUvro8TZPpz0Cj-TBo9WC21RJr6z1AsQypUuANaub7pux0fmRRyhjpuYef6vnWPzOZ70FYYKvpFK2w1frBMfUw62X9szrS74tU7P43P0vUb0MS78LBG_itmrAe_g5DEnFS3IHejumYDNbJ3MzeweBa5acdbHe_O5wc-F_jRIm0KSq70lhVIYchMPVv-uzRTR5KtNw0NGThvjEaxcMEnBhGQ",
        map_alt: "Map showing office location in San Francisco"
    },
    website: "techflow.systems",
    founded: "September 2018",
    socials: [
        { platform: "Share", url: "#", icon: "share" }
    ]
};
