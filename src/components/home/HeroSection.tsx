"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HERO_JOB_TITLES, HERO_LOCATIONS } from "@/lib/heroSuggestions";

function AutocompleteInput({ 
    value, 
    onChange, 
    placeholder, 
    icon, 
    options,
    className
}: { 
    value: string, 
    onChange: (val: string) => void, 
    placeholder: string, 
    icon: string, 
    options: string[],
    className?: string
}) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(opt => opt.toLowerCase().includes(value.toLowerCase())).slice(0, 8); // Show top 8 matched suggestions

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={wrapperRef} className={`relative flex-1 flex items-center px-4 gap-3 ${className || ''}`}>
            <span className="material-symbols-outlined text-gray-400">{icon}</span>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                className="w-full bg-transparent py-4 text-sm font-medium outline-none placeholder:text-gray-400 truncate"
            />
            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-3 md:mt-4 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <ul className="max-h-64 overflow-y-auto py-2 custom-scrollbar">
                        {filteredOptions.map((opt) => (
                            <li 
                                key={opt}
                                className="px-5 py-3 hover:bg-[#0f766d]/5 hover:text-[#0f766d] cursor-pointer text-sm font-medium text-gray-700 transition-colors flex items-center gap-3"
                                onClick={() => {
                                    onChange(opt);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="material-symbols-outlined text-gray-400 text-lg">{icon}</span>
                                {opt}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export function HeroSection() {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [experience, setExperience] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (location) params.append("location", location);
        if (experience) params.append("experience", experience);
        
        const queryString = params.toString();
        router.push(queryString ? `/search?${queryString}` : "/search");
    };

    return (
        <section className="pt-16 pb-8 lg:pt-24 lg:pb-12">
            {/* Primary Zone: Headline + Search */}
            <div className="max-w-4xl mx-auto text-center space-y-8">
                {/* Headline */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-tight">
                    Your career.{" "}
                    <span className="text-[#0f766d]">Our commitment.</span>
                </h1>

                {/* Subheading */}
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto px-4">
                    Connecting skilled professionals with the world's leading companies for over a decade. Your next opportunity is one search away.
                </p>

                {/* Search Module */}
                <form 
                    onSubmit={handleSearch}
                    className="bg-white rounded-2xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 p-2 md:p-2 flex flex-col md:flex-row items-stretch gap-2 max-w-4xl mx-auto"
                >
                    <AutocompleteInput 
                        value={keyword}
                        onChange={setKeyword}
                        placeholder="Job title, skills, or company"
                        icon="search"
                        options={HERO_JOB_TITLES}
                        className="border-b md:border-b-0 md:border-r border-gray-200"
                    />

                    <AutocompleteInput 
                        value={location}
                        onChange={setLocation}
                        placeholder="City, state, or 'Remote'"
                        icon="location_on"
                        options={HERO_LOCATIONS}
                        className="border-b md:border-b-0 md:border-r border-gray-200"
                    />

                    {/* Experience Input */}
                    <div className="flex-1 flex items-center px-4 gap-3 relative">
                        <span className="material-symbols-outlined text-gray-400">work_history</span>
                        <select
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-full bg-transparent py-4 text-sm font-medium outline-none text-gray-600 focus:outline-none cursor-pointer appearance-none"
                        >
                            <option value="">Any Experience</option>
                            <option value="fresher">Fresher</option>
                            {Array.from({ length: 30 }, (_, i) => i + 1).map(year => (
                                <option key={year} value={year.toString()}>{year} {year === 1 ? 'Year' : 'Years'}</option>
                            ))}
                        </select>
                        <span className="material-symbols-outlined text-gray-400 absolute right-4 pointer-events-none text-lg">expand_more</span>
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        className="bg-[#0f766d] text-white font-semibold px-8 py-4 rounded-xl md:rounded-full hover:bg-[#0f766d]/90 transition-all active:scale-[0.98] w-full md:w-36 flex justify-center items-center shrink-0"
                    >
                        Search
                    </button>
                </form>

                {/* Quick Filters / Trending */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                    <span className="text-sm font-semibold text-gray-500 mr-2 hidden sm:inline-block">Trending Searches:</span>
                    {["Remote", "Founding Engineer", "AI/ML", "SaaS", "FinTech"].map((tag) => (
                        <button 
                            key={tag}
                            type="button"
                            onClick={() => {
                                setKeyword(tag === "Remote" ? "" : tag);
                                if (tag === "Remote") setLocation("Remote");
                            }}
                            className="text-xs md:text-sm px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-[#0f766d] hover:text-[#0f766d] hover:bg-[#0f766d]/5 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
