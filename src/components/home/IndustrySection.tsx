import { CATEGORIES } from "@/data/mock-data";
import Link from "next/link";

export function IndustrySection() {
    return (
        <section className="py-20 max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
                <div className="space-y-3">
                    <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 tracking-tight">Explore by Industry</h2>
                    <p className="text-lg text-gray-500">Discover roles across high-growth startup sectors</p>
                </div>
                {/* <Link href="/search" className="hidden md:flex items-center gap-1 font-bold text-[#0f766d] bg-[#0f766d]/5 px-4 py-2 rounded-full hover:bg-[#0f766d]/10 transition-colors">
                    View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link> */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {CATEGORIES.map((category) => (
                    <Link
                        href={`/search?category=${encodeURIComponent(category.name)}`}
                        key={category.id}
                        className="group flex flex-col justify-center p-6 rounded-2xl bg-white border border-gray-200 hover:border-[#0f766d] hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="flex items-center justify-between z-10 w-full">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 shrink-0 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-[#0f766d]/10 group-hover:text-[#0f766d] transition-colors border border-gray-100 group-hover:border-transparent">
                                    <span className="material-symbols-outlined text-2xl">{category.iconName}</span>
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-gray-900 group-hover:text-[#0f766d] transition-colors">{category.name}</p>
                                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center justify-start flex-wrap gap-1">
                                        <span className="whitespace-nowrap">{category.jobCount || "500+"} jobs</span>
                                        <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                                        <span className="text-emerald-600 whitespace-nowrap">Actively hiring</span>
                                    </p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-300 group-hover:text-[#0f766d] group-hover:translate-x-1 transition-all shrink-0">chevron_right</span>
                        </div>
                        {/* Hover accent pulse effect */}
                        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-[#0f766d]/10 to-transparent blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0 translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                    </Link>
                ))}
            </div>

            {/* <div className="mt-8 flex justify-center md:hidden">
                <Link href="/search" className="flex items-center gap-2 font-bold text-[#0f766d] bg-[#0f766d]/5 px-6 py-3 rounded-full hover:bg-[#0f766d]/10 transition-colors w-full justify-center">
                    View All Categories <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </Link>
            </div> */}
        </section>
    );
}
