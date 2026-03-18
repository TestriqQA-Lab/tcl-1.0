import { CATEGORIES } from "@/data/mock-data";
import Link from "next/link";

export function IndustrySection() {
    return (
        <section className="py-20">
            <div className="flex items-end justify-between mb-10">
                <div className="space-y-2">
                    <h2 className="text-3xl hidden md:block font-bold font-heading">Explore by Industries</h2>
                    <h2 className="text-3xl w-full md:hidden font-bold font-heading">Explore Industries</h2>
                    <p className="text-gray-500">Find the perfect niche for your career growth</p>
                </div>
                <button className="text-[#0f766d] hidden md:block font-bold text-sm flex items-center gap-1 px-4 mb-3 hover:text-[#0f766d]/80 transition-colors">
                    View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {CATEGORIES.map((category) => (
                    <div
                        key={category.id}
                        className="group flex flex-col items-center justify-center p-8 rounded-2xl bg-white border border-gray-100 hover:border-[#0f766d]/50 hover:shadow-xl transition-all cursor-pointer"
                    >
                        <div className="size-14 rounded-xl bg-[#0f766d]/5 flex items-center justify-center text-[#0f766d] group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">{category.iconName}</span>
                        </div>
                        <p className="mt-4 font-bold text-sm md:text-base">{category.name}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
