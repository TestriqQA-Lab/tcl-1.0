"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function HeroSection() {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (keyword) params.append("keyword", keyword);
        if (location) params.append("location", location);
        
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
                <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto">
                    Connecting skilled professionals with the world's leading companies for over a decade. Your next opportunity is one search away.
                </p>

                {/* Search Module */}
                <form 
                    onSubmit={handleSearch}
                    className="bg-white rounded-2xl md:rounded-full shadow-lg border border-gray-200 p-2 md:p-2 flex flex-col md:flex-row items-stretch gap-2 max-w-3xl mx-auto"
                >
                    {/* Job Title Input */}
                    <div className="flex-1 flex items-center px-4 gap-3 border-b md:border-b-0 md:border-r border-gray-200">
                        <span className="material-symbols-outlined text-gray-400">search</span>
                        <input
                            type="text"
                            placeholder="Job title or keyword"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full bg-transparent py-4 text-sm font-medium outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Location Input */}
                    <div className="flex-1 flex items-center px-4 gap-3">
                        <span className="material-symbols-outlined text-gray-400">location_on</span>
                        <input
                            type="text"
                            placeholder="City or remote"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-transparent py-4 text-sm font-medium outline-none placeholder:text-gray-400"
                        />
                    </div>

                    {/* Submit Button */}
                    <button 
                        type="submit"
                        className="bg-[#0f766d] text-white font-semibold px-8 py-4 rounded-xl md:rounded-full hover:bg-[#0f766d]/90 transition-colors active:scale-[0.98] w-full md:w-auto"
                    >
                        Find Jobs
                    </button>
                </form>

                {/* Quick Filters */}
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                    <span className="text-gray-400 font-medium self-center">Popular:</span>
                    <button className="text-gray-600 hover:text-[#0f766d] transition-colors">Remote</button>
                    <span className="text-gray-300">•</span>
                    <button className="text-gray-600 hover:text-[#0f766d] transition-colors">Full-time</button>
                    <span className="text-gray-300">•</span>
                    <button className="text-gray-600 hover:text-[#0f766d] transition-colors">Tech</button>
                    <span className="text-gray-300">•</span>
                    <button className="text-gray-600 hover:text-[#0f766d] transition-colors">Marketing</button>
                </div>
            </div>
        </section>
    );
}
