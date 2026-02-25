"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function EmployersPage() {
    return (
        <div>
            {/* Hero Section */}
            <section className="max-w-[1240px] mx-auto px-6 py-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-4">
                        <span className="text-[#0f766d] font-bold tracking-widest text-xs uppercase">For Forward-Thinking Teams</span>
                        <h1 className="font-sora text-5xl md:text-6xl font-extrabold leading-[1.1] text-slate-900">
                            Post jobs.<br />Review applicants.<br />Hire faster.
                        </h1>
                        <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
                            Experience the calm way to hire top talent. Our platform streamlines your recruitment process from initial posting to final onboarding.
                        </p>
                    </div>
                    <div className="hidden lg:flex flex-wrap gap-4">
                        <button className="bg-[#0f766d] hover:bg-[#0d635c] text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-[#0f766d]/20 transition-all flex items-center gap-2">
                            Create Employer Account
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                        <button className="bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all">
                            See how it works
                        </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                        <div className="flex -space-x-2">
                            <div
                                className="size-8 rounded-full border-2 border-white bg-slate-200 relative overflow-hidden"
                            >
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4r77fwqZmCxlPCkiv00JrXJky1mLcFoLmkgNuqTKq5z4MiBa1yGBOlDxcrv07heEwoJ2OiTJlagkE0vHtzEJn6PCDjJibUYIqehe5gtnbKiIObLXKZYH1BKge1UM4en0cyWZcJcvq1tpamjB7xA5WRv059phmAGEoo2F4eabhC1g7Thc4JKKVx51wru4CxZab4soieT1Teh7bjEv1xHwODON2IQz3JonYl6B3RzYzjiXhMnJ0SJNWSt3shDaP89G9WBQkP2q_YQ"
                                    alt="Portrait of a female hiring manager"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div
                                className="size-8 rounded-full border-2 border-white bg-slate-200 relative overflow-hidden"
                            >
                                <Image
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYCSp6H5IAEZks2OS0dMeo3uPhdc1tUuv_Nsnaqtz1zUjt1davC3AcmdRtPRHuEeGtIhxDbghyaSaG8lSQscqNKY5zhPwGYq9VJGsbxdsqM9nTI_9ZYRsaXyw3oQTBsbsJmbtdH-mI7CcjDA--ytsbJbnFlMUmRHcr0Xd06h-wsPZndf-ClbOHgSwXcXRBFn6R-2-MmXo_XaodB03zvOyfK_HiEpmn6lhsKtY6gq-DumwXAFER333o2Nk1tsHBDuz6obVw2weEyg"
                                    alt="Portrait of a smiling executive"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="size-8 rounded-full border-2 border-white bg-slate-300 flex items-center justify-center text-[10px] font-bold">500+</div>
                        </div>
                        <span>Trusted by 500+ global companies</span>
                    </div>
                </div>
                <div className="relative">
                    <div className="aspect-square rounded-3xl bg-[#0f766d]/5 flex items-center justify-center overflow-hidden border border-[#0f766d]/10 relative">
                        <Image
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8DX0ftO_gjcuWwNWrYhvCpvOUeSS5_resmm5E99TemBZfyzTNqwwhFyl6U3T13h7XlXLxVNX9dCbvI48TtgoFstuMlZMMGoOiFChEGXJidy0xRBMq8N-9KZYTnf_jnxRLL2BGnwNKSzFznTBzTdL5plGnNQ_GCUIxV7TnWDKZezQ6Zh48yUyU0Be3p5fuOtLgJcDEYR0Z96-ByeuE2Y_kdqOAyVqGAQRh2Z9GqqUV-MDPuHr1eCk4pXgJ7pmNZtflGN84L9fzbw"
                            alt="Modern clean employer dashboard interface screenshot"
                            fill
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {/* Decorative element */}
                    <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[200px]">
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <span className="material-symbols-outlined text-green-600 text-sm">check_circle</span>
                            </div>
                            <p className="text-xs font-semibold leading-tight text-slate-900">3 Applicants reviewed today</p>
                        </div>
                    </div>
                </div>

                {/* Mobile Buttons (Visible only on mobile/tablet) */}
                <div className="flex lg:hidden flex-col gap-4 w-full mt-8">
                    <button className="w-full bg-[#0f766d] hover:bg-[#0d635c] text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-[#0f766d]/20 transition-all flex items-center justify-center gap-2">
                        Create Employer Account
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                    <button className="w-full bg-[#2563eb] hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-base font-bold shadow-lg shadow-blue-500/20 transition-all">
                        See how it works
                    </button>
                </div>
            </section>

            {/* 3-Step Process */}
            <section className="bg-[#F8FAFC] py-24 border-y border-slate-200">
                <div className="max-w-[1240px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-sora text-3xl font-bold mb-4 text-slate-900">The 3-Step Hiring Process</h2>
                        <p className="text-slate-600">Simple, streamlined, and stress-free recruitment.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="size-12 bg-[#0f766d]/10 rounded-xl flex items-center justify-center text-[#0f766d] mb-6">
                                <span className="material-symbols-outlined text-2xl">storefront</span>
                            </div>
                            <h3 className="font-sora text-xl font-bold mb-3 text-slate-900">Create Profile</h3>
                            <p className="text-slate-600 leading-relaxed">Build your employer brand presence with a beautiful company page that attracts the right talent.</p>
                        </div>
                        {/* Step 2 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="size-12 bg-[#0f766d]/10 rounded-xl flex items-center justify-center text-[#0f766d] mb-6">
                                <span className="material-symbols-outlined text-2xl">post_add</span>
                            </div>
                            <h3 className="font-sora text-xl font-bold mb-3 text-slate-900">Post Job</h3>
                            <p className="text-slate-600 leading-relaxed">Create detailed job descriptions and reach targeted candidates instantly across our vast network.</p>
                        </div>
                        {/* Step 3 */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="size-12 bg-[#0f766d]/10 rounded-xl flex items-center justify-center text-[#0f766d] mb-6">
                                <span className="material-symbols-outlined text-2xl">group</span>
                            </div>
                            <h3 className="font-sora text-xl font-bold mb-3 text-slate-900">Review Applicants</h3>
                            <p className="text-slate-600 leading-relaxed">Filter, rank, and manage your talent pipeline with ease through our intuitive review dashboard.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights */}
            <section className="py-24 max-w-[1240px] mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <div className="max-w-xl">
                        <h2 className="font-sora text-3xl font-bold mb-4 text-slate-900">Powerful tools for modern teams</h2>
                        <p className="text-slate-600">Everything you need to manage your hiring cycle from start to finish without leaving the platform.</p>
                    </div>
                    <button className="text-[#0f766d] font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        View all features <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#0f766d]/50 transition-colors">
                        <div className="mb-8 overflow-hidden rounded-xl border border-slate-100 aspect-video relative">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHDwKgCfT18ErFPEB3P39cbUC1elxOYPXWItiCM1TBHvoAIpMxvF6haYmMFAlwHJ1RTq7wKo7K7AOHxi9QyT3k_dnVW4SBZcgu3Ea2VqjlTM0WPFvF7WJDchmuEGUMgC4H7C5yDQxWhJAJiPPNTlNnqNo9l-qlmPp9u3H5kRi7wsWlKbIr2DoFLsqRqpiFiopt8ocsdq2w05WEUXUjsa1OqTfBhowVpZa_EO_kjD0k4v739f7KGTLesPm5NmizofnMS4gIolJRrA"
                                alt="Mockup of job management dashboard with graphs"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h4 className="font-sora text-lg font-bold mb-2 text-slate-900">Job Management</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">Complete control over your listings. Edit, renew, or pause positions with a single click.</p>
                    </div>
                    {/* Card 2 */}
                    <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#0f766d]/50 transition-colors">
                        <div className="mb-8 overflow-hidden rounded-xl border border-slate-100 aspect-video relative">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPiowRo7XIxEkr2MfRs6Qri-47fZXacYQloOYIBa1AmlK1wd8RKTwjimIfaVhPY_AePBjzt9MTuvgy8Q5J2iZ1VvIT2pSp_KcLNq3gwCYBwSQfzyt7FfOs_-wDPQLNTfvVSPxD9Z994FhTkhjg5LLCkP98ge5u094dZ1fqim_YJXhr1cpenlP0SaavdeZ0bR6ca4rBxnamH0AgEQ4xUd334n6eFfMOCZlyOdOJj7CymeafTZnI7994Td6sPflv6jDwFjvTCUtR4A"
                                alt="List view of applicants with profiles"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h4 className="font-sora text-lg font-bold mb-2 text-slate-900">Applicant List</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">Centralized database for all incoming talent. Track progress through custom hiring stages.</p>
                    </div>
                    {/* Card 3 */}
                    <div className="group bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#0f766d]/50 transition-colors">
                        <div className="mb-8 overflow-hidden rounded-xl border border-slate-100 aspect-video relative">
                            <Image
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJrIJNQmFj2ti0DYK0Ual-3wXLX-pZigOQx3BqUPDXgUSQYY4bjRiDp_aFM3kiX_a2Gcx7sktIZJXcAh0L12Dai3b1_L9xEIXq_UY1fFrz84d4q65_zbVNR_Xiw7SlEvBdAAyMCStnKkqF0yELFO9_FrnY9oyu65NJAFTCMaKHURNdwDUJSemHVRa6ecKvzsf3sisLUZ_hqx56sw7Fo7IncZuEAVvlcONQ0gb-pbX48zXAM2TaKxxNxL_REnpcFpWxAu5-SN0UzQ"
                                alt="UI showing resume download and preview buttons"
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                        <h4 className="font-sora text-lg font-bold mb-2 text-slate-900">Resume Download</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">Quickly export candidate data and resumes in PDF format for offline review or sharing.</p>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-[800px] mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-sora text-3xl font-bold mb-4 text-slate-900">Frequently Asked Questions</h2>
                        <p className="text-slate-600">Everything you need to know about hiring on TopCareerLive.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                        {/* FAQ Item 1 */}
                        <details className="group bg-white rounded-xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden" open>
                            <summary className="flex cursor-pointer items-center justify-between p-6 text-slate-900">
                                <h3 className="font-semibold text-lg">How much does it cost to post a job?</h3>
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                We offer flexible pricing models starting from single-post options to monthly subscriptions for high-volume hiring teams. Contact our sales team for custom enterprise packages.
                            </div>
                        </details>
                        {/* FAQ Item 2 */}
                        <details className="group bg-white rounded-xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between p-6 text-slate-900">
                                <h3 className="font-semibold text-lg">How long do job posts remain active?</h3>
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                Standard job posts stay active for 30 days. You can choose to renew them or set them to auto-renew if the position hasn't been filled.
                            </div>
                        </details>
                        {/* FAQ Item 3 */}
                        <details className="group bg-white rounded-xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between p-6 text-slate-900">
                                <h3 className="font-semibold text-lg">Can I filter applicants by specific skills?</h3>
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                Yes, our advanced dashboard allows you to filter and sort candidates by experience level, specific skill tags, location, and custom questionnaire answers.
                            </div>
                        </details>
                        {/* FAQ Item 4 */}
                        <details className="group bg-white rounded-xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between p-6 text-slate-900">
                                <h3 className="font-semibold text-lg">Is there a limit to how many applicants I can receive?</h3>
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                No, we don't put a cap on talent. You can receive unlimited applications for any active job post.
                            </div>
                        </details>
                        {/* FAQ Item 5 */}
                        <details className="group bg-white rounded-xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex cursor-pointer items-center justify-between p-6 text-slate-900">
                                <h3 className="font-semibold text-lg">Do you offer integration with other ATS platforms?</h3>
                                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
                            </summary>
                            <div className="px-6 pb-6 text-slate-600 leading-relaxed">
                                Yes, TopCareerLive integrates with major Applicant Tracking Systems like Greenhouse, Lever, and Workday to keep your workflow seamless.
                            </div>
                        </details>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-24 max-w-[1240px] mx-auto px-6">
                <div className="bg-[#0f766d] rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <span className="material-symbols-outlined text-9xl">work</span>
                    </div>
                    <h2 className="font-sora text-4xl font-bold mb-6">Ready to find your next great hire?</h2>
                    <p className="text-white/90 text-lg mb-10 max-w-xl mx-auto opacity-90">Join thousands of companies scaling their teams with TopCareerLive.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="bg-white text-[#0f766d] px-10 py-4 rounded-xl text-lg font-bold shadow-xl hover:bg-slate-50 transition-all">
                            Get Started Now
                        </button>
                        <button className="bg-[#0f766d]/20 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-[#0f766d]/30 transition-all">
                            Talk to Sales
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
