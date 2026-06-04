"use client";

import Link from "next/link";
import { ArticleCard } from "./ArticleCard";
import { DownloadCard } from "./DownloadCard";

const ARTICLES = [
    {
        category: "Interview",
        title: "Mastering the Behavioral Interview: The STAR Method",
        excerpt: "Don't get caught off guard. Learn the structured way to answer \"Tell me about a time when...\"",
        date: "Oct 24, 2023",
        views: "1.2k",
        imageUrl: "/images/blog-interview.png"
    },
    {
        category: "Growth",
        title: "5 Signs It's Time for a Promotion (or a New Job)",
        excerpt: "Feeling stagnant? Here is a checklist to determine your next career move with confidence.",
        date: "Oct 22, 2023",
        views: "850",
        imageUrl: "/images/blog-career-growth.png"
    },
    // Download Card Check
    {
        type: "download"
    },
    {
        category: "Leadership",
        title: "Leading with Empathy: A Manager's Guide",
        excerpt: "The old ways of strict management are dying. Here is how to lead modern teams effectively.",
        date: "Oct 20, 2023",
        views: "3.4k",
        imageUrl: "/images/blog-leadership.png"
    },
    {
        category: "Productivity",
        title: "Deep Work: How to Focus in a Distracted World",
        excerpt: "Strategies to reclaim your attention span and produce higher quality output in less time.",
        date: "Oct 18, 2023",
        views: "2.1k",
        imageUrl: "/images/blog-deep-work.png"
    },
    {
        category: "Finance",
        title: "Negotiating Salary: What Not To Say",
        excerpt: "Avoid these common pitfalls when discussing compensation with your future employer.",
        date: "Oct 15, 2023",
        views: "5k",
        imageUrl: "/images/blog-salary-negotiation.png"
    }
];

export function ArticleGrid() {
    return (
        <section className="max-w-[1440px] mx-auto pb-20">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
                <Link href="#" className="text-sm font-semibold text-[#0f766d] flex items-center hover:underline">
                    View all <span className="material-symbols-outlined text-lg ml-0.5">arrow_forward</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ARTICLES.map((item, index) => {
                    if (item.type === "download") {
                        return <DownloadCard key={index} />;
                    }
                    // Explicitly destructure to satisfy TypeScript that these are the "article" type props
                    // treating the item as the article variant
                    const { category, title, excerpt, date, views, imagePlaceholder, imageUrl } = item as any;
                    return (
                        <ArticleCard
                            key={index}
                            category={category}
                            title={title}
                            excerpt={excerpt}
                            date={date}
                            views={views}
                            imagePlaceholder={imagePlaceholder}
                            imageUrl={imageUrl}
                        />
                    );
                })}
            </div>

            <div className="flex justify-center mt-12">
                <button className="bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-full hover:bg-gray-50 transition-colors shadow-sm">
                    Load More Articles
                </button>
            </div>
        </section>
    );
}
