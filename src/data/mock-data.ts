// Updated to use Material Symbol strings matching code.html

export interface Category {
  id: string;
  name: string;
  iconName: string; // Material Symbol name
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full Time" | "Part Time" | "Contract" | "Remote" | "Internship" | "Urgent" | "Hybrid";
  salary: string;
  tags: string[];
  logoBg: string; // Tailwind class for logo background
  logoUrl: string; // URL from code.html
  urgent?: boolean;
}

export const CATEGORIES: Category[] = [
  { id: "1", name: "Technology", iconName: "terminal" },
  { id: "2", name: "Finance", iconName: "account_balance" },
  { id: "3", name: "Marketing", iconName: "campaign" },
  { id: "4", name: "Healthcare", iconName: "healing" },
  { id: "5", name: "Education", iconName: "school" },
  { id: "6", name: "Design", iconName: "palette" },
];

export const FEATURED_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "Stripe",
    location: "San Francisco, CA",
    type: "Full Time",
    salary: "₹14L - ₹18L",
    tags: ["Figma", "SaaS", "₹14L-₹18L"],
    logoBg: "bg-gray-50",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdAdZlkBNKNvl9pCfPHc0fMa4dpRGuayXm3cbr8CA9LDIqCO4beIUo1y9ouA6F3ZLw5YqA90dUFd4dmVZyh_MVyGe_1qIS0-IRcADI2NVPm7tWgPrYXn6befebSS-aAL3eCge73Z4PbjASJYOwHW4Wyi0gk05mZTnyKXl-6LRcZP0QTJEF6uWlyZKv9jTzUVS-08pWNnY--ABY0gRB02jARzfkpae7uIIqZcT7LTsAw1fXvJMz1AucwhPIg-_53dXRo0659YrEi8DB"
  },
  {
    id: "2",
    title: "Lead Backend Engineer",
    company: "Airbnb",
    location: "Remote, USA",
    type: "Remote",
    salary: "₹18L+",
    tags: ["Rust", "AWS", "₹18L+"],
    logoBg: "bg-gray-50",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyksUJ4zn11jvirQ3rx-g5gSjlcD4t7hMWZLjMb94P71Q41E2uXVHde3vPMngKF0oL3-8kD4Ek8Rcki5poOAwRJ27eFxztD8ELInhBgT8ZI0cJKbxSK9LLnqXkk081YlrFcSMMV5v7mKNNhYpykHvvdB4QDbiaLiWwq3qDAjbxl9H_MtzTn_R9fbcnSdmqk59DQS-tQvZ-VZRKeneQZX6TEwLs1P8ARXCxFZEA9ma-80uVeLyA0ikcfwueXCAtivbzjKsh3lR6PnAd"
  },
  {
    id: "3",
    title: "Content Strategist",
    company: "Notion",
    location: "New York, NY",
    type: "Hybrid",
    salary: "₹12L - ₹16L",
    tags: ["B2B", "Writing", "₹12L-₹16L"],
    logoBg: "bg-gray-50",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBswTaKOfAwevTOvqVyAd_8Q1pE7p6lrvZpV2pXqDNGg8VM-L6NB9Bk304MqxgBX4xp6bUsB4njBay6hqATFeyIUI_6826KfDv8m1XN6nvZhwm_w-ipT7OnlfGSNeNijrql7mK6kmX-I4vSI9lyIUnmuOfl1OYIeqc9-Ai9dv50Sy16Y2Mxe_WB3ZFG_63Nfk5gaEng2wnmucXKoSIQOsNpyuC7SgYKkL4hluK9mS9fPxM4u42qghBtF0ulJM9N_C3MNmnP6-71zy4q"
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "Spotify",
    location: "Stockholm, SE",
    type: "Full Time",
    salary: "Relocation",
    tags: ["Python", "ML", "Relocation"],
    logoBg: "bg-gray-50",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcmUGDgNhKo7ZWc40WzXY3gXJhncDZIISB9ydVuNKYT2PL0_CTfyYPzoNGgCsCM8Yy8itnyLwNE6-FaBrOwqo8n0_nrOinAzFT2Ln0u-NsR-Uh52TvNUXG7npWbbZR90RSAG1-F_w6gCegOrbOuEm9fosiySKCdkoDqwQTs_53eVv53-pbRLC4VF99BX3EBIKGMY80sskfmy3C57GHp3RvEGhu2z5CzhASO-w_w3LIojPBnZmcd96g12KfuJD8Q8WQXAEfbHMusqG9"
  },
  {
    id: "5",
    title: "Growth Marketer",
    company: "Canva",
    location: "Sydney, AU",
    type: "Urgent", // Mapped from "Urgent" pill in HTML
    salary: "₹8L - ₹12L",
    tags: ["SEO", "Ads", "₹8L-₹12L"],
    logoBg: "bg-yellow-50",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvW-L8Er0uPoQZcU8aFYfN6on4BJzYfaGYHryQ0Yp4TIvivRNzUcHxqgEyQWYcozW_hlZdzTZujf6yAiZENLRv_AD7n0NqzvKAtKwFwN2BXEnmjQJdabQAiHVK0gIbeGRvFI4EMG7xtOHhsuPaoD8oBoZ7cxiP9Mji0X6y5_fER5UUlOcYd3TlfTOP8HaAZpGtCdfznDeIf7g-hnjJ5ahaU7zfRAuwQxdAMg4AYi0vyIw9mJ8HRvFF7WOiflrZIO727YOmudaWc1_p"
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "Slack",
    location: "Remote, EMEA",
    type: "Remote",
    salary: "₹16L+",
    tags: ["Kubernetes", "CI/CD", "₹16L+"],
    logoBg: "bg-gray-50",
    logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA4r1sxSw0jBDDytvi5FD8-aokVogA2CEey4rsBqYAcofRb2HLw3PjiofvB6fmZvcajygMMddNRFfGCJpqp0djOvGFg_yZYl6sc_m7wm20L1GNuejP4FEgoAV8xbXFcYggOfhQ-kT4crpIZqQ3zQHV_lWy-KkUQ-B-lSWmTzSJe5yvXLytFzM2ImuJOz17mmiC8shMQdK3DqgrXaOp1_2mDcMuvAdYwS6zJ1dE5Qx4tozeVZDobI0ek0J5wCBjhJTsq9HLSf2TTcQTI"
  },
];

export const TRUSTED_COMPANIES = [
  "GOOGLE",
  "MICROSOFT",
  "AMAZON",
  "NETFLIX",
  "STRIPE"
];

// Stats for CTA
export const PLATFORM_STATS = {
  activeCandidates: "1.2M",
  companiesHiring: "15k"
};
