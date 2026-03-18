"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Sparkles, Check, X, ChevronDown } from "lucide-react";
import { updatePreferencesAction } from "@/actions/onboarding.actions";

export default function PreferencesPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    // Form State
    const [headline, setHeadline] = useState("");
    const [locations, setLocations] = useState<string[]>([]);
    const [locationInput, setLocationInput] = useState("");
    const [salary, setSalary] = useState<string>("");
    const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER" | "PREFER_NOT_TO_SAY" | "ANY" | "">("");
    const [position, setPosition] = useState("");

    // Fetch Data on Mount
    React.useEffect(() => {
        const fetchData = async () => {
            if (session?.user?.id) {
                try {
                    const { getPreferencesAction } = await import("@/actions/onboarding.actions");
                    const result = await getPreferencesAction(session.user.id);

                    if (result.success && result.data) {
                        const { headline, locations, salary, gender, position } = result.data;

                        if (headline) setHeadline(headline);
                        if (locations) setLocations(locations);
                        if (salary) setSalary(salary.toString());
                        if (gender) setGender(gender);
                        if (position) setPosition(position);
                    }
                } catch (error) {
                    console.error("Failed to load preferences data", error);
                }
            }
        };

        fetchData();
    }, [session?.user?.id]);

    const suggestions = ["Bengaluru", "Pune", "Hyderabad"];

    const handleAddLocation = (city: string) => {
        if (city && !locations.includes(city)) {
            setLocations([...locations, city]);
        }
        setLocationInput("");
    };

    const handleRemoveLocation = (city: string) => {
        setLocations(locations.filter((l) => l !== city));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddLocation(locationInput);
        }
    };

    const handleSubmit = async () => {
        console.log("Submitting Preferences...");
        if (!session?.user?.id) {
            console.error("No active session found.");
            alert("Session expired or invalid. Please sign in again.");
            return;
        }
        setIsLoading(true);

        try {
            const result = await updatePreferencesAction(session.user.id, {
                headline,
                locations,
                salary: parseInt(salary) || 0,
                gender: (gender || undefined) as any,
                position: position.trim() || undefined,
            });

            if (result.success) {
                console.log("Preferences saved successfully.");
                router.push("/seeker/dashboard"); // Redirect to the correct dashboard path
            } else {
                console.error("Server Action Error:", result.error);
                alert(`Error saving preferences: ${result.error}`);
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add headline & preferences</h1>
            </div>

            <p className="text-gray-500 mb-8 -mt-6">Make your profile stronger to get more relevant job recommendations</p>

            <div className="space-y-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

                {/* Resume Headline */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            Resume headline
                            <Check className="w-4 h-4 text-green-500 bg-green-100 rounded-full p-0.5" />
                        </label>
                        <span className="text-xs text-gray-400">{headline.length} / 250</span>
                    </div>
                    <textarea
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f766d] focus:border-transparent outline-none resize-none text-sm text-gray-700 min-h-[100px]"
                        placeholder="e.g. Full Stack Developer with 2.5 years of experience building scalable web applications with React and Node.js."
                        maxLength={250}
                    />

                </div>

                {/* Position */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900">Position / Role (Optional)</label>
                    <div className="relative">
                        <input
                            type="text"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#0f766d] focus:border-transparent outline-none text-sm text-gray-900"
                            placeholder="e.g. Full Stack, Frontend, Marketing..."
                        />
                    </div>
                    <p className="text-[10px] text-gray-500">This will be highlighted on your profile</p>
                </div>

                {/* Preferred Work Locations */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900">Preferred work locations</label>
                    <div className="relative">
                        <div className="flex flex-wrap items-center gap-2 w-full p-3 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-[#0f766d] focus-within:border-transparent bg-gray-50/50">
                            {locations.map((city) => (
                                <span key={city} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#0f766d] text-white text-xs font-medium">
                                    {city}
                                    <button onClick={() => handleRemoveLocation(city)} className="hover:bg-white/20 rounded-full p-0.5">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={locationInput}
                                onChange={(e) => setLocationInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent border-none outline-none text-sm min-w-[120px]"
                                placeholder={locations.length === 0 ? "Add location..." : "Add more..."}
                            />
                        </div>
                    </div>

                    {/* Suggestions */}
                    <div className="flex flex-wrap gap-2">
                        <span className="text-xs text-gray-400 py-1.5">Suggestions:</span>
                        {suggestions.map((city) => (
                            <button
                                key={city}
                                onClick={() => handleAddLocation(city)}
                                disabled={locations.includes(city)}
                                className={`px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${locations.includes(city)
                                    ? "bg-gray-100 text-gray-400 border-gray-200 cursor-default"
                                    : "bg-white border-gray-200 text-gray-600 hover:border-[#0f766d] hover:text-[#0f766d]"
                                    }`}
                            >
                                + {city}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Preferred Salary */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900">Preferred salary</label>
                    <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#0f766d] focus-within:border-transparent">
                        <div className="bg-gray-50 border-r border-gray-200 px-4 flex items-center gap-2">
                            <span className="text-gray-900 font-medium">₹</span>
                            <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                            className="flex-1 p-3 outline-none text-sm text-gray-900 font-bold"
                            placeholder="e.g. 500000"
                        />
                        <div className="bg-gray-50 border-l border-gray-200 px-4 flex items-center text-sm text-gray-500">
                            per year
                        </div>
                    </div>
                </div>

                {/* Gender */}
                <div className="space-y-3">
                    <label className="text-sm font-bold text-gray-900">Gender</label>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { label: "Male", value: "MALE" },
                            { label: "Female", value: "FEMALE" },
                            { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" }
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setGender(option.value as any)}
                                className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all ${gender === option.value
                                    ? "bg-[#0f766d] text-white border-[#0f766d] shadow-md shadow-[#0f766d]/20"
                                    : "bg-white text-gray-600 border-gray-200 hover:border-[#0f766d] hover:text-[#0f766d]"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>

            </div>

            {/* Footer Actions */}
            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 font-medium hover:text-gray-900"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="bg-[#0f766d] text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-[#0f766d]/30 hover:bg-[#0b5c55] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Saving..." : "Finish & Go to Dashboard"}
                </button>
            </div>
        </div>
    );
}
