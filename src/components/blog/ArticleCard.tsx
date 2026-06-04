"use client";

import Link from "next/link";

interface ArticleCardProps {
    category: string;
    readTime?: string;
    title: string;
    excerpt: string;
    date: string;
    views: string;
    imagePlaceholder?: string; // For now
    imageUrl?: string; // Add real image URL prop
}

export function ArticleCard({ category, title, excerpt, date, views, imagePlaceholder, imageUrl }: ArticleCardProps) {
    return (
        <div className="flex flex-col group cursor-pointer">
            <div className="relative h-60 bg-gray-100 rounded-xl overflow-hidden mb-4">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={title}
                        className="object-cover w-full h-full transition-transform group-hover:scale-105 duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-200 transition-transform group-hover:scale-105 duration-500">
                        [{imagePlaceholder || "Article Image"}]
                    </div>
                )}
                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur text-gray-800 text-xs font-bold px-3 py-1 rounded-md shadow-sm">
                    {category}
                </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0f766d] transition-colors line-clamp-2">
                {title}
            </h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
                {excerpt}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-400 mt-auto">
                <span>{date}</span>
                <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    <span>{views}</span>
                </div>
            </div>
        </div>
    );
}
