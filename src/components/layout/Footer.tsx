"use client";

import Link from "next/link";
import { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { MobileBottomNav } from "./MobileBottomNav";

interface FooterProps {
    session?: Session | null;
}

export function Footer({ session }: FooterProps) {
    const pathname = usePathname();
    const isLoggedIn = !!session?.user;

    return (
        <footer className={`bg-[#1a1f2e] text-gray-300 mt-20 ${isLoggedIn ? "pb-0 lg:pb-0" : ""} ${pathname === '/user-profile' ? 'pb-16' : ''}`}>
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 lg:gap-12">

                    {/* Brand & Context Block */}
                    <div className="col-span-2 md:col-span-3 lg:col-span-1 space-y-5">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="size-8 bg-[#0f766d] rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-lg">work</span>
                            </div>
                            <span className="text-white text-lg font-bold tracking-tight">TopCareerLive</span>
                        </Link>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                            Connecting professionals with opportunity since 2014. Trusted by millions of job seekers and thousands of employers worldwide.
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="LinkedIn">
                                <span className="material-symbols-outlined text-xl">share</span>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="Twitter">
                                <span className="material-symbols-outlined text-xl">language</span>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-white transition-colors" aria-label="Facebook">
                                <span className="material-symbols-outlined text-xl">contact_support</span>
                            </a>
                        </div>
                    </div>

                    {/* Job Seekers */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Job Seekers</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Browse Jobs</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Career Resources</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Application Tracking</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Salary Insights</Link></li>
                        </ul>
                    </div>

                    {/* Employers */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Employers</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Post a Job</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Employer Dashboard</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Pricing Plans</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Hire Talent</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Press & Media</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white text-sm font-semibold mb-5 uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white transition-colors">Accessibility</Link></li>
                        </ul>
                    </div>
                </div>


            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-700/50 bg-[#151926]">
                <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
                    <p>© 2026 TopCareerLive. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">public</span>
                            English (US)
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            SSL Secured
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation - Only on User Profile, at the very end */}
            {pathname === '/user-profile' && <MobileBottomNav />}
        </footer>
    );
}
