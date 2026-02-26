"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, BookOpen, TrendingUp, Lightbulb, Target, Users } from "lucide-react";

interface BlogPost {
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    date: string;
    icon: React.ElementType;
    iconColor: string;
    iconBg: string;
    href: string;
    imageUrl: string;
}

const blogPosts: BlogPost[] = [
    {
        title: "10 Resume Tips That Actually Get You Hired in 2026",
        excerpt: "Learn the latest strategies recruiters look for when scanning resumes, including ATS optimization and impact-driven formatting.",
        category: "Career Tips",
        readTime: "5 min read",
        date: "Feb 20, 2026",
        icon: Target,
        iconColor: "text-[#0f766d]",
        iconBg: "bg-[#e8f5f3]",
        href: "/blogs",
        imageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=340&fit=crop&q=80",
    },
    {
        title: "How to Negotiate Your Salary Like a Pro",
        excerpt: "Salary negotiation doesn't have to be scary. Discover proven techniques to maximize your compensation package.",
        category: "Salary & Growth",
        readTime: "7 min read",
        date: "Feb 18, 2026",
        icon: TrendingUp,
        iconColor: "text-violet-600",
        iconBg: "bg-violet-50",
        href: "/blogs",
        imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=340&fit=crop&q=80",
    },
    {
        title: "Top Skills Employers Are Looking For This Year",
        excerpt: "Stay ahead of the curve with the most in-demand technical and soft skills that companies are prioritizing.",
        category: "Industry Insights",
        readTime: "4 min read",
        date: "Feb 15, 2026",
        icon: Lightbulb,
        iconColor: "text-amber-600",
        iconBg: "bg-amber-50",
        href: "/blogs",
        imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=340&fit=crop&q=80",
    },
    {
        title: "Remote Work Best Practices for Job Seekers",
        excerpt: "Stand out in remote job applications with tips on communication, portfolio presentation, and virtual interviews.",
        category: "Remote Work",
        readTime: "6 min read",
        date: "Feb 12, 2026",
        icon: Users,
        iconColor: "text-blue-600",
        iconBg: "bg-blue-50",
        href: "/blogs",
        imageUrl: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&h=340&fit=crop&q=80",
    },
];

export const DashboardBlogSection = () => {
    return (
        <div className="mt-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#e8f5f3] flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-[#0f766d]" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Career Insights</h2>
                        <p className="text-xs text-gray-400 font-medium">Curated articles to boost your career</p>
                    </div>
                </div>
                <Link
                    href="/blogs"
                    className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f766d] hover:text-[#0d6b63] transition-colors group"
                >
                    View all
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {blogPosts.map((post, index) => (
                    <Link
                        key={index}
                        href={post.href}
                        className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.04)]
                            hover:shadow-lg hover:border-gray-200 hover:-translate-y-0.5
                            transition-all duration-300"
                    >
                        {/* Cover Image */}
                        <div className="relative h-36 sm:h-40 w-full overflow-hidden">
                            <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                            {/* Category Badge on image */}
                            <div className="absolute top-3 left-3">
                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow-sm`}>
                                    <post.icon className={`w-3 h-3 ${post.iconColor}`} strokeWidth={2.5} />
                                    <span className={`text-[10px] font-bold uppercase tracking-wider ${post.iconColor}`}>
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Read time badge */}
                            <div className="absolute top-3 right-3">
                                <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/40 backdrop-blur-sm">
                                    <Clock className="w-2.5 h-2.5 text-white/80" />
                                    <span className="text-[10px] font-medium text-white/90">{post.readTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-5">
                            {/* Title */}
                            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-2 group-hover:text-[#0f766d] transition-colors line-clamp-2">
                                {post.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                                {post.excerpt}
                            </p>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                <span className="text-[10px] text-gray-400 font-medium">{post.date}</span>
                                <span className="text-xs font-semibold text-[#0f766d] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                                    Read more
                                    <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Mobile View All Link */}
            <div className="sm:hidden mt-4 text-center">
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f766d] hover:text-[#0d6b63] transition-colors"
                >
                    View all articles
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
};
