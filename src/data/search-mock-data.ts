// Mock data for search page jobs (based on code_phone.html)

export interface SearchJob {
    id: string;
    title: string;
    company: string;
    logoUrl: string;
    tags: string[];
    salary: string;
    postedTime: string;
    isBookmarked?: boolean;
}

export const SEARCH_JOBS: SearchJob[] = [
    {
        id: "1",
        title: "Senior Software Engineer",
        company: "TechFlow Solutions",
        logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC04heQ4q3XGw7MHKuIQvWAJVyE14MWHA9Aru6uOYqlfMkzEEeuhz-CzLb7EWdupHDUSF25yYHSRfwjBAJLxZxqbUzgp274PGr6x3W0MH_R8k2exWgSKbTUtuF0b2hCQR-0PrkYtQneGOMtlUZIQ-Cta1Drjmtl80zjdVwOROMdhRcu4EBimVLp_eROd3Eu_NdV3QROBhdG1bshjderh4EJBKogUHeEATzotBhiZK-wYGu3WgP6O1ln3IIxRoODhTSnMOehsmnmlsMp",
        tags: ["Full-time", "Remote"],
        salary: "$140k - $180k",
        postedTime: "2h ago",
        isBookmarked: false,
    },
    {
        id: "2",
        title: "Full Stack Developer",
        company: "GreenLeaf Tech",
        logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBofFHE-7OKk5ig07WeXi8vmDubJZNfi8OHP2GHvcxafgZk78uSefwor51heY8KZemgPuvj0-sIMaq8ovdbFfrkWJ2J7bk2yN0TJ7Q_0iLqNJR8dqrXLWL9CH3tGGjMSpvyjp3P6R1lCOTWVpiUgk0TIkHdPOT90Ye23HdToIpV9uKKlNAg683vndnxR9swNsfNiJ4QENWamVeDQasOZN3mQ_50G3UBIj7jqhh6PdOmlz4CexdtQ5eBYex3MMCVF5YYgOfXvVAfPjus",
        tags: ["Contract", "Hybrid"],
        salary: "$80 - $110/hr",
        postedTime: "5h ago",
        isBookmarked: true,
    },
    {
        id: "3",
        title: "Lead Frontend Engineer",
        company: "Nexus Systems",
        logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCcSIftx4Z6GpwAeSnfT0kaqoMXnzjeDK-9jeOn--r0ovPMLpAHtA_NaB9_FimtIUU4cAzKjc4-6ILWcmthWZJcgXbc_Q1kh_OzRMVaX4EwhspzRurrciEpZEYRtJ4KjV4ZW4vXA6EDMmNhgn_YxBZMvmed7os_jZ8nnEW0IRVsCll-LIU2IOEt9ZYoJPWrXJ0GXrxj7ZgHuKnKuxmEZsp6E-KeqIYYJ6RmLqmO7bG_8S_OZiItBhD-JQNZ-VCsvQf12sp0hkwl13lC",
        tags: ["Full-time", "On-site"],
        salary: "$160k - $210k",
        postedTime: "1d ago",
        isBookmarked: false,
    },
    {
        id: "4",
        title: "Senior Product Designer",
        company: "Google",
        logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBdAdZlkBNKNvl9pCfPHc0fMa4dpRGuayXm3cbr8CA9LDIqCO4beIUo1y9ouA6F3ZLw5YqA90dUFd4dmVZyh_MVyGe_1qIS0-IRcADI2NVPm7tWgPrYXn6befebSS-aAL3eCge73Z4PbjASJYOwHW4Wyi0gk05mZTnyKXl-6LRcZP0QTJEF6uWlyZKv9jTzUVS-08pWNnY--ABY0gRB02jARzfkpae7uIIqZcT7LTsAw1fXvJMz1AucwhPIg-_53dXRo0659YrEi8DB",
        tags: ["Full-time", "Hybrid"],
        salary: "$140k - $180k",
        postedTime: "3h ago",
        isBookmarked: false,
    },
    {
        id: "5",
        title: "UX Designer (Growth)",
        company: "Razorpay",
        logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAyksUJ4zn11jvirQ3rx-g5gSjlcD4t7hMWZLjMb94P71Q41E2uXVHde3vPMngKF0oL3-8kD4Ek8Rcki5poOAwRJ27eFxztD8ELInhBgT8ZI0cJKbxSK9LLnqXkk081YlrFcSMMV5v7mKNNhYpykHvvdB4QDbiaLiWwq3qDAjbxl9H_MtzTn_R9fbcnSdmqk59DQS-tQvZ-VZRKeneQZX6TEwLs1P8ARXCxFZEA9ma-80uVeLyA0ikcfwueXCAtivbzjKsh3lR6PnAd",
        tags: ["Full-time", "Remote Friendly"],
        salary: "$120k - $150k",
        postedTime: "6h ago",
        isBookmarked: false,
    },
    {
        id: "6",
        title: "Lead Visual Designer",
        company: "Swiggy",
        logoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBswTaKOfAwevTOvqVyAd_8Q1pE7p6lrvZpV2pXqDNGg8VM-L6NB9Bk304MqxgBX4xp6bUsB4njBay6hqATFeyIUI_6826KfDv8m1XN6nvZhwm_w-ipT7OnlfGSNeNijrql7mK6kmX-I4vSI9lyIUnmuOfl1OYIeqc9-Ai9dv50Sy16Y2Mxe_WB3ZFG_63Nfk5gaEng2wnmucXKoSIQOsNpyuC7SgYKkL4hluK9mS9fPxM4u42qghBtF0ulJM9N_C3MNmnP6-71zy4q",
        tags: ["Full-time", "On-site"],
        salary: "$100k - $140k",
        postedTime: "1d ago",
        isBookmarked: false,
    },
];

export const JOB_TYPE_FILTERS = ["Full-time", "Remote", "Contract", "Internship"];
export const DATE_POSTED_FILTERS = ["Last 24 hours", "Last 7 days", "Last 30 days"];
