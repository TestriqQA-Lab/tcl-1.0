"use client";

import { useEffect, useState, useCallback } from "react";



interface TOCProps {
    sections: Array<{
        id: string;
        label: string;
        numbered?: boolean;
        num?: number;
    }>;
}

export function TableOfContents({ sections = [] }: TOCProps) {
    const [activeId, setActiveId] = useState<string>("");
    const [isOpen, setIsOpen] = useState(false);

    // IntersectionObserver to track active section
    useEffect(() => {
        if (sections.length === 0) return;

        const headings = sections.map(({ id }) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries.find((entry) => entry.isIntersecting);
                if (visible) {
                    setActiveId(visible.target.id);
                }
            },
            { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
        );

        headings.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const scrollTo = useCallback((id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveId(id);
            setIsOpen(false);
        }
    }, []);

    // Shared TOC item list
    const renderItems = () => (
        <ul className="space-y-1">
            {sections.map(({ id, label, numbered, num }) => {
                const isActive = activeId === id;
                return (
                    <li key={id}>
                        <button
                            onClick={() => scrollTo(id)}
                            className={`
                                w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all duration-200
                                ${isActive
                                    ? "bg-primary/8 text-primary font-semibold border-l-[3px] border-primary"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-l-[3px] border-transparent"
                                }
                            `}
                        >
                            {numbered ? `${num}. ${label}` : label}
                        </button>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <>
            {/* ── Desktop: TOC Card ── */}
            <div className="hidden lg:block">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <p className="text-xs font-bold text-primary uppercase tracking-[0.15em] mb-4 px-4">
                        Table of Contents
                    </p>
                    {renderItems()}
                </div>
            </div>

            {/* ── Mobile: Floating Button + Drawer ── */}
            <div className="lg:hidden">
                {/* Floating Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-40 bg-primary text-white shadow-lg shadow-primary/25 rounded-full px-4 py-2.5 flex items-center gap-2 text-sm font-medium hover:bg-primary/90 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-[18px]">toc</span>
                    Contents
                </button>

                {/* Backdrop */}
                {isOpen && (
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                        onClick={() => setIsOpen(false)}
                    />
                )}

                {/* Slide-up Drawer */}
                <div
                    className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-y-0" : "translate-y-full"
                        }`}
                >
                    {/* Drawer Handle */}
                    <div className="flex justify-center pt-3 pb-1">
                        <div className="w-10 h-1 bg-gray-200 rounded-full" />
                    </div>

                    <div className="px-5 pb-8 pt-2">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-primary uppercase tracking-[0.15em]">Table of Contents</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="size-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>
                        {renderItems()}
                    </div>
                </div>
            </div>
        </>
    );
}
