import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us | TopCareerLive — Empowering Careers, Connecting Talent",
    description:
        "Discover how TopCareerLive is redefining recruitment in India. We connect talented professionals with forward-thinking employers through smart technology and human-first design.",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const STATS = [
    { value: "50K+", label: "Active Job Seekers" },
    { value: "1,200+", label: "Employer Partners" },
    { value: "15K+", label: "Successful Placements" },
    { value: "4.8★", label: "User Rating" },
];

const CORE_VALUES = [
    {
        icon: "diversity_3",
        title: "People First",
        description:
            "Every feature we build begins with one question — how does this make life better for job seekers and employers?",
    },
    {
        icon: "verified",
        title: "Trust & Transparency",
        description:
            "We verify every employer listing and ensure honest communication, because trust is the foundation of great hiring.",
    },
    {
        icon: "rocket_launch",
        title: "Speed & Innovation",
        description:
            "From AI-powered matching to instant apply, we move fast to solve real hiring problems — not create new ones.",
    },
    {
        icon: "handshake",
        title: "Inclusivity",
        description:
            "Whether you're a fresher from a small town or a senior professional in a metro — our platform welcomes everyone equally.",
    },
    {
        icon: "trending_up",
        title: "Growth Focused",
        description:
            "We don't just help people find jobs. We help them build careers — with skill insights, resume tools, and guided applications.",
    },
    {
        icon: "shield",
        title: "Data Privacy",
        description:
            "Your data is yours. We follow strict privacy standards and never share personal information without explicit consent.",
    },
];

const WHY_CHOOSE_US = [
    {
        icon: "smart_toy",
        title: "AI-Powered Matching",
        description: "Our intelligent algorithms connect candidates to roles that truly fit their skills, experience, and career goals.",
        image: "/images/about/hiring.png",
    },
    {
        icon: "verified_user",
        title: "Verified Employers Only",
        description: "Every employer on our platform undergoes a thorough verification process — no fake listings, no scams, no wasted time.",
        image: "/images/about/vision.png",
    },
    {
        icon: "support_agent",
        title: "Dedicated Support",
        description: "Our India-based support team is available to help with every step of your hiring or job search journey.",
        image: "/images/about/support.png",
    },
];

const TESTIMONIALS = [
    {
        name: "Riya Deshmukh",
        role: "Software Developer, Pune",
        quote: "I was struggling to find a role that matched my skills. TopCareerLive's smart matching landed me 3 interview calls within a week. The whole process was seamless.",
        initials: "RD",
    },
    {
        name: "Vikram Singh",
        role: "HR Manager, Delhi",
        quote: "As a recruiter, I've tried many platforms. TopCareerLive gives us quality candidates with verified profiles, saving us hours of screening time.",
        initials: "VS",
    },
    {
        name: "Ananya Iyer",
        role: "Marketing Associate, Bangalore",
        quote: "What I love about this platform is how intuitive it feels. The interface, the application tracker, and the real-time updates — everything just works.",
        initials: "AI",
    },
];

// ─── Page Component ──────────────────────────────────────────────────────────
export default function AboutPage() {
    return (
        <div className="text-slate-900">
            {/* ═══════════ HERO SECTION ═══════════ */}
            <section className="pt-16 pb-12 lg:pt-24 lg:pb-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Text */}
                    <div className="space-y-6 order-2 lg:order-1">
                        <span className="inline-block text-[#0f766d] text-sm font-bold uppercase tracking-widest">
                            About TopCareerLive
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
                            Redefining how{" "}
                            <span className="text-[#0f766d]">India hires.</span>
                        </h1>
                        <p className="text-lg text-gray-500 leading-relaxed max-w-xl">
                            TopCareerLive is on a mission to make hiring smarter, faster, and more
                            human. We combine cutting-edge technology with deep local understanding
                            to connect the right talent with the right opportunity — every single time.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <Link
                                href="/search"
                                className="bg-[#0f766d] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#0d6b63] transition-all inline-block"
                            >
                                Explore Opportunities
                            </Link>
                            <Link
                                href="/employers"
                                className="bg-transparent text-[#0f766d] border-2 border-[#0f766d]/30 font-bold px-8 py-4 rounded-xl hover:bg-[#0f766d]/5 transition-all inline-block"
                            >
                                For Employers
                            </Link>
                        </div>
                    </div>
                    {/* Image */}
                    <div className="relative order-1 lg:order-2">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
                            <Image
                                src="/images/about/hero.png"
                                alt="Indian professionals collaborating in a modern office"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Floating card */}
                        <div className="absolute -bottom-6 -left-4 md:-left-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-100 hidden sm:block">
                            <p className="text-3xl font-black text-[#0f766d]">15K+</p>
                            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                                Careers Launched
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ STATS BAR ═══════════ */}
            <section className="py-12 lg:py-16">
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 lg:p-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        {STATS.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl lg:text-4xl font-black text-[#0f766d]">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-gray-500 font-medium mt-2">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ OUR STORY ═══════════ */}
            <section className="py-16 lg:py-24">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Image */}
                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                        <Image
                            src="/images/about/culture.png"
                            alt="TopCareerLive office culture in India"
                            fill
                            className="object-cover"
                        />
                    </div>
                    {/* Text */}
                    <div className="space-y-6">
                        <span className="inline-block text-[#0f766d] text-sm font-bold uppercase tracking-widest">
                            Who We Are
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                            Built for India.{" "}
                            <span className="text-[#0f766d]">Designed for impact.</span>
                        </h2>
                        <p className="text-gray-500 leading-relaxed">
                            India's job market is enormous — yet the hiring process remains riddled
                            with inefficiencies. Fake listings, ghost applications, and broken
                            communication plague both sides. We saw a better way.
                        </p>
                        <p className="text-gray-500 leading-relaxed">
                            TopCareerLive was created to fix this — a platform where every job listing
                            is verified, every candidate profile is genuine, and every connection is
                            meaningful. Whether it's a fresher in Jaipur or a tech lead in Hyderabad,
                            we level the playing field for everyone.
                        </p>
                        <div className="flex items-center gap-4 pt-4">
                            <div className="w-12 h-12 bg-[#0f766d]/10 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#0f766d]">
                                    emoji_objects
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Our Mission</p>
                                <p className="text-sm text-gray-500">
                                    To democratize access to meaningful employment for every Indian professional.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#0f766d]/10 rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#0f766d]">
                                    visibility
                                </span>
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">Our Vision</p>
                                <p className="text-sm text-gray-500">
                                    To become India's most trusted and intelligent hiring ecosystem.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ CORE VALUES ═══════════ */}
            <section className="py-16 lg:py-24">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="inline-block text-[#0f766d] text-sm font-bold uppercase tracking-widest mb-3">
                        What Drives Us
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        Our Core Values
                    </h2>
                    <p className="text-gray-500 mt-4">
                        These principles shape every feature, every partnership, and every
                        interaction on our platform.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CORE_VALUES.map((value) => (
                        <div
                            key={value.title}
                            className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-lg hover:border-[#0f766d]/20 transition-all group"
                        >
                            <div className="w-12 h-12 bg-[#0f766d]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#0f766d] transition-colors">
                                <span className="material-symbols-outlined text-[#0f766d] group-hover:text-white transition-colors">
                                    {value.icon}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ WHY CHOOSE US ═══════════ */}
            <section className="py-16 lg:py-24">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="inline-block text-[#0f766d] text-sm font-bold uppercase tracking-widest mb-3">
                        What Sets Us Apart
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        Why Thousands Choose TopCareerLive
                    </h2>
                </div>
                <div className="space-y-16">
                    {WHY_CHOOSE_US.map((item, index) => (
                        <div
                            key={item.title}
                            className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${index % 2 !== 0 ? "lg:direction-rtl" : ""
                                }`}
                        >
                            {/* Image — alternates left/right on desktop */}
                            <div
                                className={`relative rounded-3xl overflow-hidden shadow-lg aspect-[16/10] ${index % 2 !== 0 ? "lg:order-2" : ""
                                    }`}
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Content */}
                            <div className={`space-y-5 ${index % 2 !== 0 ? "lg:order-1" : ""}`}>
                                <div className="w-14 h-14 bg-[#0f766d]/10 rounded-2xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[#0f766d] text-2xl">
                                        {item.icon}
                                    </span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed text-lg">
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ TESTIMONIALS ═══════════ */}
            <section className="py-16 lg:py-24">
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <span className="inline-block text-[#0f766d] text-sm font-bold uppercase tracking-widest mb-3">
                        What People Say
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        Trusted by Professionals Across India
                    </h2>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((testimonial) => (
                        <div
                            key={testimonial.name}
                            className="bg-white rounded-2xl border border-gray-100 p-7 hover:shadow-lg transition-all flex flex-col"
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-5">
                                {[...Array(5)].map((_, i) => (
                                    <span
                                        key={i}
                                        className="material-symbols-outlined text-amber-400 text-lg"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        star
                                    </span>
                                ))}
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm flex-grow italic">
                                &ldquo;{testimonial.quote}&rdquo;
                            </p>
                            <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                                <div className="w-10 h-10 bg-gradient-to-br from-[#0f766d] to-[#0d5c55] rounded-full flex items-center justify-center text-white font-bold text-sm">
                                    {testimonial.initials}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                                    <p className="text-xs text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ CTA SECTION ═══════════ */}
            <section className="py-16 lg:py-20 mb-8">
                <div className="bg-[#0f766d] rounded-3xl p-10 lg:p-20 relative overflow-hidden shadow-2xl">
                    {/* Abstract Pattern Overlays */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 text-center max-w-3xl mx-auto space-y-6">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                            Your next chapter starts here.
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                            Whether you're looking for your dream role or your next great hire,
                            TopCareerLive is here to make it happen. Join thousands who already trust us.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <Link
                                href="/register"
                                className="bg-white text-[#0f766d] font-bold px-8 py-4 rounded-xl hover:shadow-xl transition-all inline-block"
                            >
                                Get Started Free
                            </Link>
                            <Link
                                href="/employers"
                                className="bg-transparent text-white border-2 border-white/30 font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all inline-block"
                            >
                                I'm an Employer
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
