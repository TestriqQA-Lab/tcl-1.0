"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-[#E2E8F0] py-4 px-5">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full focus:outline-none"
            >
                <span className="font-bold text-[14px] text-[#0e1b1a]">{title}</span>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#64748B]" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-[#64748B]" />
                )}
            </button>
            {isOpen && <div className="mt-4">{children}</div>}
        </div>
    );
}

// Mock Data
const MOCK_LOCATIONS = ["New York", "San Francisco", "London", "Paris", "Berlin", "Tokyo", "Delhi", "Mumbai", "Bangalore", "Pune"];
const MOCK_SKILLS = ["React", "TypeScript", "Node.js", "Python", "Java", "Figma", "Design", "Construction", "AutoCAD", "Primavera P6"];
const MOCK_INDUSTRIES = [
    "Accounting", "Advertising Services", "Airlines and Aviation", "Alternative Medicine", 
    "Animation and Post-production", "Architecture and Planning", "Artificial Intelligence", 
    "Automotive", "Banking", "Biotechnology", "Broadcast Media", "Building Materials", 
    "Business Consulting and Services", "Chemical Manufacturing", "Civil Engineering", 
    "Computer and Network Security", "Computer Games", "Computer Hardware Manufacturing", 
    "Computer Networking", "Construction", "Consumer Goods", "Consumer Services", 
    "Dairy Product Manufacturing", "Data Infrastructure and Cloud Services", "Design Services", 
    "E-Learning Providers", "Education Administration", "Entertainment Providers", 
    "Environmental Services", "Farming and Ranching", "Financial Services", "Fisheries", 
    "Food and Beverage Services", "Furniture and Home Furnishings Manufacturing", 
    "Government Administration", "Graphic Design", "Higher Education", "Hospitals and Health Care", 
    "Hospitality", "Human Resources Services", "Individual and Family Services", 
    "Industrial Machinery Manufacturing", "Information Technology & Services", "Insurance", 
    "International Affairs", "Investment Banking", "Investment Management", "Law Practice", 
    "Legal Services", "Logistics and Supply Chain", "Luxury Goods and Jewelry", "Manufacturing", 
    "Maritime Transportation", "Market Research", "Marketing and Advertising", 
    "Medical Equipment Manufacturing", "Medical Practices", "Mental Health Care", "Mining", 
    "Motor Vehicle Manufacturing", "Museums and Institutions", "Music and Audio", 
    "Nanotechnology", "Non-profit Organizations", "Oil and Gas", "Packaging and Containers Manufacturing", 
    "Pharmaceutical Manufacturing", "Philanthropy", "Photography", "Plastics Manufacturing", 
    "Primary and Secondary Education", "Printing Services", "Professional Training and Coaching", 
    "Public Relations and Communications Services", "Public Safety", "Publishing", "Real Estate", 
    "Renewable Energy Semiconductor Manufacturing", "Research Services", "Restaurants", "Retail", 
    "Semiconductor Manufacturing", "Software Development", "Staffing and Recruiting", 
    "Telecommunications", "Textile Manufacturing", "Transportation, Logistics, Supply Chain and Storage", 
    "Travel Arrangements", "Utilities", "Venture Capital and Private Equity Principals", 
    "Veterinary Services", "Warehousing and Storage", "Wellness and Fitness Services", 
    "Wholesale", "It Services & Consulting"
];

interface SearchFiltersProps {
    onSearch?: () => void;
    onClear?: () => void;
}

export function SearchFilters({ onSearch, onClear }: SearchFiltersProps) {
    // Location State
    const [locationInput, setLocationInput] = useState("");
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    
    // Skills State
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);

    // Industry State
    const [industryInput, setIndustryInput] = useState("");
    const [showIndustrySuggestions, setShowIndustrySuggestions] = useState(false);

    // Refs for outside click handling
    const locationRef = useRef<HTMLDivElement>(null);
    const skillsRef = useRef<HTMLDivElement>(null);
    const industryRef = useRef<HTMLDivElement>(null);

    // Filter suggestions based on input
    const filteredLocations = MOCK_LOCATIONS.filter(loc => loc.toLowerCase().includes(locationInput.toLowerCase()));
    const filteredSkills = MOCK_SKILLS.filter(
        skill => skill.toLowerCase().includes(skillInput.toLowerCase()) && !selectedSkills.includes(skill)
    );
    const filteredIndustries = MOCK_INDUSTRIES.filter(ind => ind.toLowerCase().includes(industryInput.toLowerCase()));

    // Click outside handler
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
                setShowLocationSuggestions(false);
            }
            if (skillsRef.current && !skillsRef.current.contains(event.target as Node)) {
                setShowSkillSuggestions(false);
            }
            if (industryRef.current && !industryRef.current.contains(event.target as Node)) {
                setShowIndustrySuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddSkill = (skill: string) => {
        if (!selectedSkills.includes(skill)) {
            setSelectedSkills([...selectedSkills, skill]);
        }
        setSkillInput("");
        setShowSkillSuggestions(false);
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
    };

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && skillInput.trim() !== "") {
            e.preventDefault();
            handleAddSkill(skillInput.trim());
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-white overflow-hidden">
            {/* Filter Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0] shrink-0">
                <h2 className="text-[16px] font-bold text-[#0e1b1a]">Filters</h2>
                <button type="button" onClick={onClear} className="text-[13px] text-[#64748B] underline hover:text-[#0e1b1a]">
                    Clear all
                </button>
            </div>

            {/* Scrollable Filter List */}
            <div className="flex-1 overflow-y-auto">
                <FilterSection title="Job titles">
                    <div className="flex flex-col gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter job title"
                                className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                            />
                        </div>
                    </div>
                </FilterSection>

                <FilterSection title="Location" defaultOpen={true}>
                    <div className="relative" ref={locationRef}>
                         <input
                            type="text"
                            placeholder="Enter location"
                            value={locationInput}
                            onChange={(e) => {
                                setLocationInput(e.target.value);
                                setShowLocationSuggestions(true);
                            }}
                            onFocus={() => setShowLocationSuggestions(true)}
                            className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                         />
                         {showLocationSuggestions && locationInput && filteredLocations.length > 0 && (
                             <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                                 {filteredLocations.map((loc) => (
                                     <button
                                         key={loc}
                                         className="w-full text-left px-3 py-2 text-[13px] text-[#0e1b1a] hover:bg-[#F1F5F9]"
                                         onClick={() => {
                                             setLocationInput(loc);
                                             setShowLocationSuggestions(false);
                                         }}
                                     >
                                         {loc}
                                     </button>
                                 ))}
                             </div>
                         )}
                    </div>
                </FilterSection>

                <FilterSection title="Company" defaultOpen={false}>
                    <div className="relative">
                            <input
                                type="text"
                                placeholder="Search company"
                                className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                            />
                    </div>
                </FilterSection>

                <FilterSection title="Skills" defaultOpen={true}>
                     <div className="flex flex-col gap-3" ref={skillsRef}>
                         {/* Selected Skills Tags */}
                         {selectedSkills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {selectedSkills.map(skill => (
                                    <div key={skill} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-full">
                                        <span className="text-[12px] font-medium text-[#1D4ED8]">{skill}</span>
                                        <button 
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="text-[#3B82F6] hover:text-[#1D4ED8]"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                         )}
                         <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Type a skill and press Enter"
                                    value={skillInput}
                                    onChange={(e) => {
                                        setSkillInput(e.target.value);
                                        setShowSkillSuggestions(true);
                                    }}
                                    onFocus={() => setShowSkillSuggestions(true)}
                                    onKeyDown={handleSkillKeyDown}
                                    className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                                />
                                {showSkillSuggestions && skillInput && filteredSkills.length > 0 && (
                                     <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                                         {filteredSkills.map((skill) => (
                                             <button
                                                 key={skill}
                                                 className="w-full text-left px-3 py-2 text-[13px] text-[#0e1b1a] hover:bg-[#F1F5F9]"
                                                 onClick={() => handleAddSkill(skill)}
                                             >
                                                 {skill}
                                             </button>
                                         ))}
                                     </div>
                                 )}
                        </div>
                    </div>
                </FilterSection>

                <FilterSection title="Years of exp.">
                    <div className="flex items-center gap-3">
                         <div className="relative flex-1">
                             <input 
                                type="number" 
                                placeholder="Min"
                                min={0}
                                className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                             />
                         </div>
                         <span className="text-[#94A3B8]">-</span>
                         <div className="relative flex-1">
                             <input 
                                type="number" 
                                placeholder="Max"
                                min={0}
                                className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                             />
                         </div>
                    </div>
                </FilterSection>

                <FilterSection title="Industry" defaultOpen={false}>
                     <div className="relative" ref={industryRef}>
                            <input
                                type="text"
                                placeholder="Search industry"
                                value={industryInput}
                                onChange={(e) => {
                                    setIndustryInput(e.target.value);
                                    setShowIndustrySuggestions(true);
                                }}
                                onFocus={() => setShowIndustrySuggestions(true)}
                                className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                            />
                            {showIndustrySuggestions && industryInput && filteredIndustries.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E2E8F0] rounded-md shadow-lg z-10 max-h-40 overflow-y-auto w-full max-w-[calc(100vw-48px)] lg:max-w-none">
                                    {filteredIndustries.map((ind) => (
                                        <button
                                            key={ind}
                                            className="w-full text-left px-3 py-2 text-[13px] text-[#0e1b1a] hover:bg-[#F1F5F9] whitespace-normal"
                                            onClick={() => {
                                                setIndustryInput(ind);
                                                setShowIndustrySuggestions(false);
                                            }}
                                        >
                                            {ind}
                                        </button>
                                    ))}
                                </div>
                            )}
                    </div>
                </FilterSection>

                <FilterSection title="Education" defaultOpen={true}>
                     <div className="relative">
                         <select 
                            className="w-full h-[38px] px-3 bg-white border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d] appearance-none"
                            defaultValue=""
                         >
                             <option value="" disabled>Select education level</option>
                             <option value="12th">12th pass</option>
                             <option value="undergraduate">Under graduate</option>
                             <option value="postgraduate">Post graduate</option>
                             <option value="diploma">Diploma</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                    </div>
                </FilterSection>

                <FilterSection title="Age (Years)" defaultOpen={false}>
                    <div className="flex items-center gap-3">
                         <div className="relative flex-1">
                             <input 
                                type="number" 
                                placeholder="Min"
                                min={18}
                                className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                             />
                         </div>
                         <span className="text-[#94A3B8]">-</span>
                         <div className="relative flex-1">
                             <input 
                                type="number" 
                                placeholder="Max"
                                min={18}
                                className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                             />
                         </div>
                    </div>
                </FilterSection>

                <FilterSection title="CTC" defaultOpen={false}>
                    <div className="flex items-center gap-3">
                         <div className="relative flex-1">
                             <input 
                                type="number" 
                                placeholder="Min"
                                min={0}
                                className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                             />
                         </div>
                         <span className="text-[#94A3B8]">-</span>
                         <div className="relative flex-1">
                             <input 
                                type="number" 
                                placeholder="Max"
                                min={0}
                                className="w-full h-[38px] px-3 border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d]"
                             />
                         </div>
                    </div>
                </FilterSection>

                <FilterSection title="Gender" defaultOpen={false}>
                     <div className="relative">
                         <select 
                            className="w-full h-[38px] px-3 bg-white border border-[#E2E8F0] rounded-md text-[13px] text-[#0e1b1a] focus:outline-none focus:border-[#0f766d] focus:ring-1 focus:ring-[#0f766d] appearance-none"
                            defaultValue=""
                         >
                             <option value="" disabled>Select gender</option>
                             <option value="any">Any</option>
                             <option value="male">Male</option>
                             <option value="female">Female</option>
                             <option value="other">Other</option>
                         </select>
                         <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B] pointer-events-none" />
                    </div>
                </FilterSection>
            </div>

            {/* Bottom Actions - Fixed to bottom of sidebar */}
            <div className="p-6 border-t border-[#E2E8F0] shrink-0 bg-white sticky bottom-0 z-10">
                <button
                    type="button"
                    onClick={onSearch}
                    className="flex justify-center items-center w-full h-11 bg-[#0f766d] hover:bg-[#0c5c55] text-white text-[15px] font-bold rounded-lg transition-colors"
                >
                    Search
                </button>
            </div>
        </div>
    );
}
