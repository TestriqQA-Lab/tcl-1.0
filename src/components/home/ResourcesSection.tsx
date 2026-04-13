import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export function ResourcesSection() {
    const blogs = [
        {
            id: "1",
            title: "How to Ace Your Technical Interview at a High-Growth Startup",
            excerpt: "Discover the exact questions asked by early-stage tech founders and how to frame the perfect technical response.",
            category: "Interview Tips",
            date: "Oct 24, 2026",
            readTime: "5 min read",
            imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800",
            link: "#"
        },
        {
            id: "2",
            title: "Understanding ESOPs: A Complete Guide for New Employees",
            excerpt: "Stock options can be confusing. Here is a breakdown of what ESOPs are, how vesting works, and why they matter.",
            category: "Compensation",
            date: "Oct 22, 2026",
            readTime: "8 min read",
            imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
            link: "#"
        },
        {
            id: "3",
            title: "Why Soft Skills Matter Just As Much As Coding in Remote Teams",
            excerpt: "In a fast-paced environment, your ability to communicate and adapt often outweighs your technical brilliance.",
            category: "Career Growth",
            date: "Oct 18, 2026",
            readTime: "4 min read",
            imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800",
            link: "#"
        }
    ];

    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Latest Career Insights</h2>
                        <p className="text-gray-500 text-lg max-w-2xl">Expert advice, industry trends, and practical guides to accelerate your career growth.</p>
                    </div>
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766d] hover:text-[#0b5c54] transition-colors py-2 px-4 rounded-lg hover:bg-[#0f766d]/5 whitespace-nowrap"
                    >
                        View all articles <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                
                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 cursor-pointer">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-[#0f766d]/30 transition-all duration-300 flex flex-col h-full relative">
                            
                            {/* Image Container */}
                            <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                                <img 
                                    src={blog.imageUrl} 
                                    alt={blog.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Category Badge overlapping image */}
                                <div className="absolute top-4 left-4">
                                    <span className="bg-white/95 backdrop-blur-sm text-[#0f766d] text-xs font-bold px-3 py-1.5 rounded-md shadow-sm">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 flex flex-col flex-grow">
                                {/* Meta Info */}
                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-4">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {blog.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {blog.readTime}
                                    </div>
                                </div>

                                {/* Title & Excerpt */}
                                <h3 className="text-[19px] font-bold text-gray-900 mb-3 leading-snug group-hover:text-[#0f766d] transition-colors line-clamp-2">
                                    {blog.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 flex-grow">
                                    {blog.excerpt}
                                </p>
                            </div>
                            
                            {/* Absolute Link Wrapper covering whole card */}
                            <Link href={blog.link} className="absolute inset-0 z-10" aria-label={`Read ${blog.title}`}></Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
