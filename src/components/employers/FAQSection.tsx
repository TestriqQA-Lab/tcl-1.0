"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQSection() {
    const faqs = [
        "How much does it cost to post a job?",
        "How long do job posts remain active?",
        "Can I filter applicants by specific skills?",
        "Is there a limit to how many applicants I can receive?",
        "Do you offer integrations with other ATS platforms?"
    ];

    return (
        <section className="py-10 w-full">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-3xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
                <p className="text-lg text-slate-500 font-medium">Everything you need to know about hiring on TopCareerLive.</p>
            </div>
            <div className="flex flex-col gap-3">
                {faqs.map((faq, idx) => (
                    <FAQItem key={idx} question={faq} answer="Yes, our advanced dashboard allows you to manage all aspects of recruitment effortlessly. For detailed pricing and extended features, please consult our documentation." isOpen={idx === 0} />
                ))}
            </div>
        </section>
    );
}

function FAQItem({ question, answer, isOpen = false }: { question: string, answer: string, isOpen?: boolean }) {
    const [open, setOpen] = useState(isOpen);

    return (
        <div
            className={`border rounded-2xl transition-all cursor-pointer overflow-hidden ${open ? 'border-slate-200 bg-white shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            onClick={() => setOpen(!open)}
        >
            <div className="flex items-center justify-between p-6">
                <h3 className="font-bold text-slate-800">{question}</h3>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
            </div>
            {open && (
                <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed font-medium">
                    {answer}
                </div>
            )}
        </div>
    );
}
