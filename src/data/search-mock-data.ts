// Mock data for search page

export interface SearchJob {
    id: string;
    title: string;
    company: string;
    companyLogo: string;
    location: string;
    type: string;
    description: string;
    salary: string;
}

export const SEARCH_JOBS: SearchJob[] = [
    {
        id: "1",
        title: "Senior Product Designer",
        company: "Google",
        companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdZa_HZnMhN8Y16gaQS0wmgJAX2QQPz7g8xYDA-CFKERzCSQyWqTXeboGl6ZLyt3dzfKl3hEyjjKWzF50mUvAFLYNxcbhyonFHndN8VAgQtbENjbC_IXiKlUhGlLOkrGuJnLEx8LK38Pd14SF-jHoD_kLRKZVb6-LgeEBiJd1_3hZulgs-bPp2NREZoWNTjbHbB3J40eI2_VRb-uafIV2i2Vffh_LAgxI4fGGEdl42UBJX2Ia5eNRIlStZF320YYiXBW04S0r3D3rh",
        location: "Bengaluru (Hybrid)",
        type: "Full-time",
        description: "We are looking for a Senior Product Designer to lead design initiatives for our cloud infrastructure products. You will collaborate closely with engineering and PMs to define the user journey...",
        salary: "$140k - $180k",
    },
    {
        id: "2",
        title: "UX Designer (Growth)",
        company: "Razorpay",
        companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhlor9VzdD8vX3YDQePkFjBsfp4c2Xws4UBQVap-Ye0bTqi0RgdNJeZGxy4RMAXyfQsk8l9NfkyJHUs6N7qS_l961MbASsqfl8s9OMF2IIAAeVMV25nY7rCZKgu7kbAql5cQi5P0vQGtbJ1V-SWwCyPVNi_dkIy4Z68XwDVCq7Njj-aN_swc60UKuaH-bB8Wuo68mtLymPgQcFEOLXvAjHfQEPk4h83TsWszrWpmPEdjUaoetJj514pnDg4e6S-WN1Fp5hTEZj91jU",
        location: "Koramangala, Bengaluru",
        type: "Remote Friendly",
        description: "Join the growth team at India's leading fintech platform. You will be responsible for optimizing onboarding funnels and running A/B tests to improve conversion rates...",
        salary: "$120k - $150k",
    },
    {
        id: "3",
        title: "Lead Visual Designer",
        company: "Swiggy",
        companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCw2puTohRujx7XoA10TVVrYH39PX2duHda_hKI-8UOpoVXsBm6c8Z-TIN__1FF8wLPmBWucmE0BgO-LgirNAWbYtqSj4ELxpaPdetRDbctJz5DCPyyxKZ7c_zVT8KZ2lwfOHR551oCwvPwDDJLX0ZGNZDILIWrb7ddooXjRZXIauzK96lgGDk2anY4TsLgvX4s2CJ_oazaYLO-dv8pm0bRn0ZS62e-Wq9PCv6ERgAbiAUjG_A-SjB04r0AgFqr8KCy2kFyShJD02a3",
        location: "Bengaluru (On-site)",
        type: "Full-time",
        description: "Lead the brand identity and visual strategy across all customer touchpoints. We are looking for a visionary who can elevate our aesthetic standards...",
        salary: "$100k - $140k",
    },
    {
        id: "4",
        title: "Product Designer",
        company: "Flipkart",
        companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuA9Zr0zZLAImweO7R3BvYv5fTdgteiAgQO6aBmEvQ9_4XDCeZxqdG6iFrsK3XnPjCaosMgqEDduy9dvcBlS0ceyWB8wYDvqFb_j6IPnIvD36tvqaPsc7YElzJFxLNGEO6MW8EWJHR9VbX9BqKWAICKZtGierY06MK2-q1iT2YxQA6Pe6K-cYsYNL8SB4QcMGCJhk5KJCGF-mODYbKYh6T4t2NWXTolIs3Rljq_cTQ6lAVJp8On2TcO8zPL_eLJJYxABRk10u8wrTSxj",
        location: "Bengaluru (Hybrid)",
        type: "Full-time",
        description: "Design intuitive shopping experiences for millions of users. Work on features that impact India's largest e-commerce platform and its diverse customer base...",
        salary: "$90k - $130k",
    },
    {
        id: "5",
        title: "UI/UX Designer",
        company: "PhonePe",
        companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDQSE2tzOxcUhSAD1bn8uJTSLE8q_yNQkDARmc5TU-z3a_UyKUjhf9wl0LKrYvMnHDNrDfn2v_feQ12R7oFy-YunVi0baDXpUFRdfN1Cg689Geusf_yTd1REODX5cZ-xLT74JuPuYH10rSwewqKZPLt-JDr4vJdYdGRcplGUT0_rx1ugSR-5qVKGV1p1G9msOhC2Hp81v9daKZZJXw9tgAt3coCsFBUYVhq4JVPy3ikrA3Je_gBHUNR1UruAyI6FhuNxpTpoSRoJDe",
        location: "Bengaluru (Remote)",
        type: "Remote Friendly",
        description: "Create seamless payment experiences for one of India's fastest-growing fintech apps. Design for scale and simplicity across mobile platforms...",
        salary: "$80k - $120k",
    },
];

export const JOB_TYPE_FILTERS = ["Full-time", "Remote", "Contract", "Internship"];

export const DATE_POSTED_FILTERS = ["Last 24 hours", "Last 7 days", "Last 30 days"];

