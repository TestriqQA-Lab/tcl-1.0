"use client";

import Image from "next/image";
import Link from "next/link";

interface RelatedPost {
    title: string;
    category: string;
    readTime: string;
    publishedAt: string;
    slug: string;
    imageUrl: string;
}

interface RelatedPostsProps {
    posts: RelatedPost[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
    if (!posts || posts.length === 0) return null;

    return (
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">article</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Related Articles</h3>
            </div>

            {/* Article Cards */}
            <div className="space-y-5">
                {posts.map((article, i) => (
                    <Link key={i} href={`/blog/${article.slug}`} className="block group">
                        {/* Image with category badge */}
                        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-gray-100 mb-3">
                            <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="260px"
                            />
                            <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                                {article.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1.5">
                            {article.title}
                        </h4>

                        {/* Read time + arrow */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">{article.readTime}</span>
                            <span className="material-symbols-outlined text-gray-300 text-[18px] group-hover:text-primary transition-colors">
                                chevron_right
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
