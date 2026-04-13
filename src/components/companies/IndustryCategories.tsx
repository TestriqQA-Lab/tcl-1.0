"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const categories = [
    { label: "Information Technology", icon: "computer" },
    { label: "Finance & Banking", icon: "account_balance" },
    { label: "Healthcare", icon: "health_and_safety" },
    { label: "Education", icon: "school" },
    { label: "E-Commerce", icon: "shopping_cart" },
    { label: "Manufacturing", icon: "precision_manufacturing" },
    { label: "Consulting", icon: "assignment" },
    { label: "Real Estate", icon: "home_work" },
    { label: "Marketing", icon: "campaign" },
    { label: "Logistics", icon: "local_shipping" },
    { label: "Media & Entertainment", icon: "movie" },
    { label: "Telecom", icon: "cell_tower" },
];

export function IndustryCategories() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeIndustry = searchParams.get("industry") || "";

    const handleCategoryClick = (label: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (activeIndustry === label) {
            params.delete("industry");
        } else {
            params.set("industry", label);
        }
        params.delete("page");
        // Use scroll: false via router.push and prevent scroll reset
        router.push(`/companies?${params.toString()}`, { scroll: false });
    };

    return (
        <section className="mb-8 md:mb-10">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-[#0f766d]/10 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0f766d]" style={{ fontSize: "18px" }}>category</span>
                </div>
                <div>
                    <h2 className="text-base md:text-lg font-bold text-gray-900">Browse by Industry</h2>
                    <p className="text-xs text-gray-500 hidden sm:block">Explore companies across different sectors</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
                {categories.map((cat, i) => (
                    <motion.button
                        key={cat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.25, delay: i * 0.03 }}
                        onClick={() => handleCategoryClick(cat.label)}
                        className={`group inline-flex items-center gap-2 px-3.5 py-2 md:px-4 md:py-2.5 rounded-xl text-xs md:text-sm font-medium border transition-all duration-300 cursor-pointer ${
                            activeIndustry === cat.label
                                ? "bg-[#0f766d] text-white border-[#0f766d] shadow-md shadow-[#0f766d]/20"
                                : "bg-white text-gray-700 border-gray-200 hover:border-[#0f766d]/40 hover:bg-[#0f766d]/[0.02] hover:text-gray-900 hover:shadow-sm"
                        }`}
                    >
                        <span 
                            className={`material-symbols-outlined transition-colors duration-300 ${
                                activeIndustry === cat.label 
                                    ? "text-white" 
                                    : "text-gray-400 group-hover:text-[#0f766d]"
                            }`} 
                            style={{ fontSize: "16px" }}
                        >
                            {cat.icon}
                        </span>
                        {cat.label}
                    </motion.button>
                ))}
            </div>
        </section>
    );
}
