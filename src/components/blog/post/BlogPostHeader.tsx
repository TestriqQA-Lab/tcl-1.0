"use client";

import Image from "next/image";
import Link from "next/link";

interface BlogPostHeaderProps {
    title: string;
    description: string;
    author: {
        name: string;
        role: string;
        image: string;
    };
    publishedAt: string;
    readTime: string;
    heroImage: string;
}

export function BlogPostHeader({ title, description, author, publishedAt, readTime, heroImage }: BlogPostHeaderProps) {
    return (
        <header className="mb-10">

            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
                <span className="material-symbols-outlined text-[14px]">Home</span>
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                <span className="text-gray-600 max-w-[180px] truncate inline-block align-bottom">{title}</span>
            </nav>

            {/* Title — large, bold, no-frills */}
            <h1 className="text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem] font-extrabold text-[#1a1a2e] leading-[1.12] tracking-[-0.015em] mb-4 max-w-7xl">
                {title}
            </h1>

            {/* Description */}
            <p className="text-gray-500 text-base sm:text-lg max-w-5xl mb-8 leading-relaxed">
                {description}
            </p>

            {/* Author meta row */}
            <div className="flex items-center gap-3 mb-8">
                {author?.image && (
                    <div className="relative size-15 rounded-full overflow-hidden shrink-0">
                        <Image
                            src={author.image}
                            alt={author.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}
                <div className="text-sm leading-snug">
                    <p>
                        <span className="font-semibold text-gray-900">{author?.name}</span>
                        {author?.role && (
                            <>
                                <span className="text-gray-300 mx-1.5">|</span>
                                <span className="text-gray-500">{author.role}</span>
                            </>
                        )}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                        {new Date(publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        <span className="mx-1">•</span> {readTime}
                    </p>
                </div>
            </div>

            {/* Hero Image — full width, clean */}
            {heroImage && (
                <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] rounded-xl overflow-hidden bg-gray-100">
                    <Image
                        src={heroImage}
                        alt={title}
                        fill
                        className="object-fit"
                        priority
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />
                </div>
            )}
        </header>
    );
}
