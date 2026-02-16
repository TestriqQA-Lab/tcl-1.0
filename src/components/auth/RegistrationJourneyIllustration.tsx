"use client";

import React from "react";

/**
 * RegistrationJourneyIllustration
 * 
 * A premium, production-ready inline SVG + CSS animated illustration
 * depicting the 9-scene user registration journey.
 * 
 * - Zero JS runtime / zero dependencies
 * - ~10s seamless infinite loop
 * - GPU-accelerated (transform + opacity only)
 * - prefers-reduced-motion: shows static success frame
 * - Accessible: role="img", aria-label, <title>, <desc>
 */
export function RegistrationJourneyIllustration() {
    return (
        <div
            className="w-full max-w-sm mx-auto max-h-[calc(100vh-10rem)]"
        >
            <svg
                viewBox="0 0 400 440"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Animated illustration showing the registration journey: sign up, fill profile, upload resume, select skills, verify email, and access your dashboard."
                className="w-full h-full registration-illustration"
            >
                <title>Registration Journey Illustration</title>
                <desc>
                    A 9-scene animated illustration that walks through the
                    user registration process on TopCareerLive: welcome,
                    form filling, profile setup, skills selection,
                    verification, completion, and dashboard access.
                </desc>

                <defs>
                    {/* Background gradient */}
                    <linearGradient id="bgGrad" x1="0" y1="0" x2="400" y2="500" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#f0fdfa" />
                        <stop offset="100%" stopColor="#ede9fe" />
                    </linearGradient>
                    {/* Card shadow filter */}
                    <filter id="cardShadow" x="-4%" y="-4%" width="108%" height="108%">
                        <feDropShadow dx="0" dy="2" stdDeviation="6" floodColor="#0f766d" floodOpacity="0.08" />
                    </filter>
                    {/* Glow filter */}
                    <filter id="successGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    {/* Teal gradient for progress */}
                    <linearGradient id="progressGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0f766d" />
                        <stop offset="100%" stopColor="#3FA296" />
                    </linearGradient>
                    {/* Purple accent gradient */}
                    <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#A78BFA" />
                    </linearGradient>
                </defs>

                {/* ============ BACKGROUND ============ */}
                <rect width="400" height="500" rx="24" fill="url(#bgGrad)" />

                {/* Decorative dots (static) */}
                <circle cx="40" cy="40" r="3" fill="#0f766d" opacity="0.1" />
                <circle cx="360" cy="40" r="3" fill="#8B5CF6" opacity="0.1" />
                <circle cx="40" cy="460" r="3" fill="#3B82F6" opacity="0.1" />
                <circle cx="360" cy="460" r="3" fill="#0f766d" opacity="0.1" />
                <circle cx="200" cy="30" r="2" fill="#0f766d" opacity="0.08" />
                <circle cx="80" cy="250" r="2" fill="#8B5CF6" opacity="0.06" />
                <circle cx="320" cy="250" r="2" fill="#3B82F6" opacity="0.06" />

                {/* ============ SCENE 1: WELCOME – Signup Card ============ */}
                <g className="scene-welcome">
                    {/* Main card */}
                    <rect x="80" y="60" width="240" height="300" rx="16" fill="white" filter="url(#cardShadow)" />
                    {/* Card header bar */}
                    <rect x="80" y="60" width="240" height="48" rx="16" fill="#0f766d" />
                    <rect x="80" y="92" width="240" height="16" fill="#0f766d" />
                    {/* Header dots */}
                    <circle cx="102" cy="84" r="5" fill="white" opacity="0.4" />
                    <circle cx="118" cy="84" r="5" fill="white" opacity="0.3" />
                    <circle cx="134" cy="84" r="5" fill="white" opacity="0.2" />
                    {/* Logo placeholder text */}
                    <text x="200" y="88" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Inter, sans-serif" opacity="0.9">TopCareerLive</text>
                    {/* Welcome text */}
                    <text x="200" y="138" textAnchor="middle" fill="#0f766d" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">Create Your Account</text>
                    <text x="200" y="156" textAnchor="middle" fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">Start your career journey today</text>
                </g>

                {/* ============ SCENE 2: USER AVATAR ============ */}
                <g className="scene-avatar">
                    {/* Avatar circle */}
                    <circle cx="200" cy="200" r="22" fill="#f0fdfa" stroke="#0f766d" strokeWidth="2" />
                    {/* Person icon */}
                    <circle cx="200" cy="194" r="7" fill="#3FA296" />
                    <path d="M186 214 a14 10 0 0 1 28 0" fill="#3FA296" />
                </g>

                {/* ============ SCENE 3: FORM FIELDS ============ */}
                <g className="scene-form-fields">
                    {/* Name field */}
                    <rect x="110" y="235" width="180" height="28" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="120" y="253" fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">Full Name</text>
                    {/* Name fill bar */}
                    <rect className="field-fill-1" x="110" y="235" width="0" height="28" rx="6" fill="#0f766d" opacity="0.06" />
                    <text className="field-text-1" x="120" y="253" fill="#0f766d" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0">John Doe</text>

                    {/* Email field */}
                    <rect x="110" y="270" width="180" height="28" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="120" y="288" fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">Email Address</text>
                    <rect className="field-fill-2" x="110" y="270" width="0" height="28" rx="6" fill="#0f766d" opacity="0.06" />
                    <text className="field-text-2" x="120" y="288" fill="#0f766d" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0">john@email.com</text>

                    {/* Password field */}
                    <rect x="110" y="305" width="180" height="28" rx="6" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
                    <text x="120" y="323" fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">Password</text>
                    <rect className="field-fill-3" x="110" y="305" width="0" height="28" rx="6" fill="#0f766d" opacity="0.06" />
                    <text className="field-text-3" x="120" y="323" fill="#0f766d" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif" opacity="0">• • • • • • • •</text>
                </g>

                {/* ============ SCENE 4: RESUME CARD ============ */}
                <g className="scene-resume">
                    <rect x="100" y="170" width="200" height="50" rx="10" fill="white" stroke="#e2e8f0" strokeWidth="1.5" filter="url(#cardShadow)" />
                    {/* File icon */}
                    <rect x="115" y="180" width="24" height="30" rx="4" fill="#f0fdfa" stroke="#0f766d" strokeWidth="1.5" />
                    <path d="M127 180 L139 180 L139 184 L133 184 Z" fill="#3FA296" opacity="0.5" />
                    <rect x="121" y="192" width="12" height="2" rx="1" fill="#0f766d" opacity="0.3" />
                    <rect x="121" y="196" width="8" height="2" rx="1" fill="#0f766d" opacity="0.2" />
                    <rect x="121" y="200" width="10" height="2" rx="1" fill="#0f766d" opacity="0.15" />
                    {/* Resume info */}
                    <text x="150" y="195" fill="#1e293b" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">Resume.pdf</text>
                    <text x="150" y="210" fill="#3FA296" fontSize="8" fontWeight="600" fontFamily="Inter, sans-serif">✓ Uploaded</text>
                    {/* Upload arrow */}
                    <path d="M275 195 L282 188 L289 195 M282 188 V207" stroke="#0f766d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.4" />
                </g>

                {/* ============ SCENE 5: SKILL CHIPS ============ */}
                <g className="scene-skills">
                    <rect className="skill-chip-1" x="100" y="238" width="72" height="26" rx="13" fill="#0f766d" />
                    <text className="skill-text-1" x="136" y="255" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">React</text>

                    <rect className="skill-chip-2" x="180" y="238" width="72" height="26" rx="13" fill="#8B5CF6" />
                    <text className="skill-text-2" x="216" y="255" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">Node.js</text>

                    <rect className="skill-chip-3" x="260" y="238" width="40" height="26" rx="13" fill="#3B82F6" />
                    <text className="skill-text-3" x="280" y="255" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">UI</text>

                    <rect className="skill-chip-4" x="100" y="272" width="60" height="26" rx="13" fill="#3FA296" />
                    <text className="skill-text-4" x="130" y="289" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">SQL</text>

                    <rect className="skill-chip-5" x="168" y="272" width="80" height="26" rx="13" fill="#6366F1" />
                    <text className="skill-text-5" x="208" y="289" textAnchor="middle" fill="white" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">TypeScript</text>
                </g>

                {/* ============ SCENE 6: VERIFICATION ============ */}
                <g className="scene-verify">
                    {/* Envelope */}
                    <rect x="160" y="200" width="80" height="50" rx="8" fill="white" stroke="#0f766d" strokeWidth="2" />
                    <path d="M160 208 L200 232 L240 208" stroke="#0f766d" strokeWidth="2" fill="none" strokeLinecap="round" />
                    {/* Check badge */}
                    <circle className="verify-badge" cx="240" cy="200" r="14" fill="#0f766d" />
                    <path className="verify-check" d="M233 200 L238 205 L247 194" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* OTP text */}
                    <text x="200" y="275" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">Email Verified</text>
                </g>

                {/* ============ SCENE 7: PROGRESS BAR ============ */}
                <g className="scene-progress">
                    <text x="200" y="195" textAnchor="middle" fill="#0f766d" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">Profile Completion</text>
                    {/* Track */}
                    <rect x="100" y="210" width="200" height="10" rx="5" fill="#e2e8f0" />
                    {/* Fill */}
                    <rect className="progress-fill" x="100" y="210" width="0" height="10" rx="5" fill="url(#progressGrad)" />
                    {/* Percentage */}
                    <text className="progress-text" x="200" y="240" textAnchor="middle" fill="#0f766d" fontSize="20" fontWeight="800" fontFamily="Inter, sans-serif">100%</text>
                </g>

                {/* ============ SCENE 8: SUCCESS CHECKMARK ============ */}
                <g className="scene-success">
                    {/* Outer ring */}
                    <circle className="success-ring" cx="200" cy="220" r="40" fill="none" stroke="#0f766d" strokeWidth="3" filter="url(#successGlow)" />
                    {/* Inner fill */}
                    <circle className="success-fill" cx="200" cy="220" r="36" fill="#0f766d" opacity="0.1" />
                    {/* Checkmark */}
                    <path className="success-check" d="M180 220 L193 233 L220 206" stroke="#0f766d" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Text */}
                    <text x="200" y="280" textAnchor="middle" fill="#0f766d" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">Account Created!</text>
                    <text x="200" y="296" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="Inter, sans-serif">Welcome aboard 🎉</text>
                </g>

                {/* ============ SCENE 9: DASHBOARD PREVIEW ============ */}
                <g className="scene-dashboard">
                    {/* Dashboard card */}
                    <rect x="70" y="80" width="260" height="340" rx="16" fill="white" filter="url(#cardShadow)" />
                    {/* Top nav bar */}
                    <rect x="70" y="80" width="260" height="40" rx="16" fill="#0f766d" />
                    <rect x="70" y="104" width="260" height="16" fill="#0f766d" />
                    <circle cx="92" cy="100" r="4" fill="white" opacity="0.5" />
                    <text x="200" y="104" textAnchor="middle" fill="white" fontSize="10" fontWeight="600" fontFamily="Inter, sans-serif">Dashboard</text>

                    {/* Profile summary row */}
                    <circle cx="105" cy="148" r="14" fill="#f0fdfa" stroke="#3FA296" strokeWidth="1.5" />
                    <circle cx="105" cy="144" r="5" fill="#3FA296" />
                    <path d="M96 157 a9 7 0 0 1 18 0" fill="#3FA296" />
                    <text x="130" y="145" fill="#1e293b" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">John Doe</text>
                    <text x="130" y="158" fill="#64748b" fontSize="8" fontFamily="Inter, sans-serif">Full Stack Developer</text>

                    {/* Stats row */}
                    <rect x="85" y="175" width="70" height="45" rx="8" fill="#f0fdfa" />
                    <text x="120" y="195" textAnchor="middle" fill="#0f766d" fontSize="16" fontWeight="800" fontFamily="Inter, sans-serif">12</text>
                    <text x="120" y="210" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif">New Jobs</text>

                    <rect x="165" y="175" width="70" height="45" rx="8" fill="#ede9fe" />
                    <text x="200" y="195" textAnchor="middle" fill="#8B5CF6" fontSize="16" fontWeight="800" fontFamily="Inter, sans-serif">5</text>
                    <text x="200" y="210" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif">Applied</text>

                    <rect x="245" y="175" width="70" height="45" rx="8" fill="#ecfdf5" />
                    <text x="280" y="195" textAnchor="middle" fill="#0f766d" fontSize="16" fontWeight="800" fontFamily="Inter, sans-serif">3</text>
                    <text x="280" y="210" textAnchor="middle" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif">Interviews</text>

                    {/* Job cards */}
                    <rect x="85" y="232" width="230" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="105" cy="253" r="10" fill="#0f766d" opacity="0.15" />
                    <text x="105" y="257" textAnchor="middle" fill="#0f766d" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">G</text>
                    <text x="125" y="249" fill="#1e293b" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">Senior Frontend Engineer</text>
                    <text x="125" y="262" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif">Google · Remote · ₹25-35 LPA</text>

                    <rect x="85" y="282" width="230" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="105" cy="303" r="10" fill="#8B5CF6" opacity="0.15" />
                    <text x="105" y="307" textAnchor="middle" fill="#8B5CF6" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">M</text>
                    <text x="125" y="299" fill="#1e293b" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">Full Stack Developer</text>
                    <text x="125" y="312" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif">Microsoft · Hybrid · ₹20-30 LPA</text>

                    <rect x="85" y="332" width="230" height="42" rx="8" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1" />
                    <circle cx="105" cy="353" r="10" fill="#3B82F6" opacity="0.15" />
                    <text x="105" y="357" textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="700" fontFamily="Inter, sans-serif">A</text>
                    <text x="125" y="349" fill="#1e293b" fontSize="9" fontWeight="600" fontFamily="Inter, sans-serif">React Native Developer</text>
                    <text x="125" y="362" fill="#64748b" fontSize="7" fontFamily="Inter, sans-serif">Amazon · On-site · ₹18-28 LPA</text>

                    {/* Bottom glow */}
                    <rect className="dashboard-glow" x="100" y="390" width="200" height="4" rx="2" fill="#0f766d" opacity="0" />
                </g>

                {/* ============ FLOATING PARTICLES (always visible, subtle) ============ */}
                <circle className="particle-1" cx="50" cy="100" r="3" fill="#0f766d" opacity="0" />
                <circle className="particle-2" cx="350" cy="150" r="2" fill="#8B5CF6" opacity="0" />
                <circle className="particle-3" cx="60" cy="400" r="2.5" fill="#3B82F6" opacity="0" />
                <circle className="particle-4" cx="340" cy="380" r="2" fill="#3FA296" opacity="0" />
            </svg>

            <style jsx>{`
                /* ============ MASTER TIMELINE: 10s loop ============
                 *  0% –  8%  Scene 1: Welcome (fade in)
                 *  8% – 16%  Scene 2: Avatar (slide in)
                 * 16% – 30%  Scene 3: Form fields (sequential fill)
                 * 30% – 40%  Scene 4: Resume card (slide in)
                 * 40% – 52%  Scene 5: Skills (staggered pop)
                 * 52% – 62%  Scene 6: Verification
                 * 62% – 72%  Scene 7: Progress bar
                 * 72% – 82%  Scene 8: Success checkmark
                 * 82% – 97%  Scene 9: Dashboard preview
                 * 97% –100%  Fade out → reset
                 */

                .registration-illustration {
                    overflow: visible;
                }

                /* ---- SCENE 1: Welcome ---- */
                .scene-welcome {
                    animation: sceneWelcome 10s ease-in-out infinite;
                }
                @keyframes sceneWelcome {
                    0% { opacity: 0; transform: translateY(10px) scale(0.97); }
                    3% { opacity: 1; transform: translateY(0) scale(1); }
                    14% { opacity: 1; }
                    18% { opacity: 0; }
                    100% { opacity: 0; }
                }

                /* ---- SCENE 2: Avatar ---- */
                .scene-avatar {
                    animation: sceneAvatar 10s ease-in-out infinite;
                }
                @keyframes sceneAvatar {
                    0%, 6% { opacity: 0; transform: translateX(-15px); }
                    11% { opacity: 1; transform: translateX(0); }
                    14% { opacity: 1; }
                    18% { opacity: 0; }
                    100% { opacity: 0; }
                }

                /* ---- SCENE 3: Form Fields ---- */
                .scene-form-fields {
                    animation: sceneForm 10s ease-in-out infinite;
                }
                @keyframes sceneForm {
                    0%, 14% { opacity: 0; }
                    18% { opacity: 1; }
                    28% { opacity: 1; }
                    32% { opacity: 0; }
                    100% { opacity: 0; }
                }

                .field-fill-1 { animation: fieldFill 10s ease-in-out infinite; }
                .field-text-1 { animation: fieldText 10s ease-in-out infinite; }
                @keyframes fieldFill {
                    0%, 18% { width: 0; }
                    22% { width: 180px; }
                    100% { width: 180px; }
                }
                @keyframes fieldText {
                    0%, 18% { opacity: 0; }
                    22% { opacity: 1; }
                    28% { opacity: 1; }
                    32% { opacity: 0; }
                    100% { opacity: 0; }
                }

                .field-fill-2 { animation: fieldFill2 10s ease-in-out infinite; }
                .field-text-2 { animation: fieldText2 10s ease-in-out infinite; }
                @keyframes fieldFill2 {
                    0%, 21% { width: 0; }
                    25% { width: 180px; }
                    100% { width: 180px; }
                }
                @keyframes fieldText2 {
                    0%, 21% { opacity: 0; }
                    25% { opacity: 1; }
                    28% { opacity: 1; }
                    32% { opacity: 0; }
                    100% { opacity: 0; }
                }

                .field-fill-3 { animation: fieldFill3 10s ease-in-out infinite; }
                .field-text-3 { animation: fieldText3 10s ease-in-out infinite; }
                @keyframes fieldFill3 {
                    0%, 24% { width: 0; }
                    28% { width: 180px; }
                    100% { width: 180px; }
                }
                @keyframes fieldText3 {
                    0%, 24% { opacity: 0; }
                    28% { opacity: 1; }
                    28% { opacity: 1; }
                    32% { opacity: 0; }
                    100% { opacity: 0; }
                }

                /* ---- SCENE 4: Resume ---- */
                .scene-resume {
                    animation: sceneResume 10s ease-in-out infinite;
                }
                @keyframes sceneResume {
                    0%, 28% { opacity: 0; transform: translateX(20px); }
                    33% { opacity: 1; transform: translateX(0); }
                    38% { opacity: 1; }
                    42% { opacity: 0; }
                    100% { opacity: 0; }
                }

                /* ---- SCENE 5: Skills ---- */
                .scene-skills {
                    animation: sceneSkills 10s ease-in-out infinite;
                }
                @keyframes sceneSkills {
                    0%, 38% { opacity: 0; }
                    42% { opacity: 1; }
                    50% { opacity: 1; }
                    54% { opacity: 0; }
                    100% { opacity: 0; }
                }

                .skill-chip-1, .skill-text-1 { animation: chipPop1 10s ease-out infinite; }
                .skill-chip-2, .skill-text-2 { animation: chipPop2 10s ease-out infinite; }
                .skill-chip-3, .skill-text-3 { animation: chipPop3 10s ease-out infinite; }
                .skill-chip-4, .skill-text-4 { animation: chipPop4 10s ease-out infinite; }
                .skill-chip-5, .skill-text-5 { animation: chipPop5 10s ease-out infinite; }

                @keyframes chipPop1 {
                    0%, 39% { opacity: 0; transform: scale(0.7); }
                    43% { opacity: 1; transform: scale(1); }
                    50% { opacity: 1; }
                    54% { opacity: 0; }
                    100% { opacity: 0; }
                }
                @keyframes chipPop2 {
                    0%, 40% { opacity: 0; transform: scale(0.7); }
                    44% { opacity: 1; transform: scale(1); }
                    50% { opacity: 1; }
                    54% { opacity: 0; }
                    100% { opacity: 0; }
                }
                @keyframes chipPop3 {
                    0%, 41% { opacity: 0; transform: scale(0.7); }
                    45% { opacity: 1; transform: scale(1); }
                    50% { opacity: 1; }
                    54% { opacity: 0; }
                    100% { opacity: 0; }
                }
                @keyframes chipPop4 {
                    0%, 42% { opacity: 0; transform: scale(0.7); }
                    46% { opacity: 1; transform: scale(1); }
                    50% { opacity: 1; }
                    54% { opacity: 0; }
                    100% { opacity: 0; }
                }
                @keyframes chipPop5 {
                    0%, 43% { opacity: 0; transform: scale(0.7); }
                    47% { opacity: 1; transform: scale(1); }
                    50% { opacity: 1; }
                    54% { opacity: 0; }
                    100% { opacity: 0; }
                }

                /* ---- SCENE 6: Verification ---- */
                .scene-verify {
                    animation: sceneVerify 10s ease-in-out infinite;
                }
                @keyframes sceneVerify {
                    0%, 50% { opacity: 0; }
                    55% { opacity: 1; }
                    60% { opacity: 1; }
                    64% { opacity: 0; }
                    100% { opacity: 0; }
                }
                .verify-badge {
                    animation: badgePop 10s ease-out infinite;
                }
                @keyframes badgePop {
                    0%, 53% { transform: scale(0); }
                    57% { transform: scale(1.15); }
                    59% { transform: scale(1); }
                    100% { transform: scale(1); }
                }
                .verify-check {
                    stroke-dasharray: 24;
                    animation: drawCheck 10s ease-out infinite;
                }
                @keyframes drawCheck {
                    0%, 55% { stroke-dashoffset: 24; }
                    60% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: 0; }
                }

                /* ---- SCENE 7: Progress Bar ---- */
                .scene-progress {
                    animation: sceneProgress 10s ease-in-out infinite;
                }
                @keyframes sceneProgress {
                    0%, 60% { opacity: 0; }
                    64% { opacity: 1; }
                    70% { opacity: 1; }
                    74% { opacity: 0; }
                    100% { opacity: 0; }
                }
                .progress-fill {
                    animation: fillProgress 10s ease-in-out infinite;
                }
                @keyframes fillProgress {
                    0%, 63% { width: 0; }
                    70% { width: 200px; }
                    100% { width: 200px; }
                }
                .progress-text {
                    animation: progressCount 10s ease-in-out infinite;
                }
                @keyframes progressCount {
                    0%, 63% { opacity: 0; }
                    66% { opacity: 1; }
                    70% { opacity: 1; }
                    74% { opacity: 0; }
                    100% { opacity: 0; }
                }

                /* ---- SCENE 8: Success ---- */
                .scene-success {
                    animation: sceneSuccess 10s ease-in-out infinite;
                }
                @keyframes sceneSuccess {
                    0%, 70% { opacity: 0; }
                    74% { opacity: 1; }
                    80% { opacity: 1; }
                    84% { opacity: 0; }
                    100% { opacity: 0; }
                }
                .success-ring {
                    stroke-dasharray: 252;
                    animation: drawRing 10s ease-out infinite;
                }
                @keyframes drawRing {
                    0%, 71% { stroke-dashoffset: 252; }
                    77% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: 0; }
                }
                .success-check {
                    stroke-dasharray: 50;
                    animation: drawSuccessCheck 10s ease-out infinite;
                }
                @keyframes drawSuccessCheck {
                    0%, 74% { stroke-dashoffset: 50; }
                    78% { stroke-dashoffset: 0; }
                    100% { stroke-dashoffset: 0; }
                }
                .success-fill {
                    animation: fillSuccess 10s ease-out infinite;
                }
                @keyframes fillSuccess {
                    0%, 73% { opacity: 0; transform: scale(0.8); }
                    77% { opacity: 0.1; transform: scale(1); }
                    100% { opacity: 0.1; transform: scale(1); }
                }

                /* ---- SCENE 9: Dashboard ---- */
                .scene-dashboard {
                    animation: sceneDashboard 10s ease-in-out infinite;
                }
                @keyframes sceneDashboard {
                    0%, 80% { opacity: 0; transform: translateY(10px) scale(0.97); }
                    85% { opacity: 1; transform: translateY(0) scale(1); }
                    95% { opacity: 1; }
                    100% { opacity: 0; }
                }
                .dashboard-glow {
                    animation: glowPulse 10s ease-in-out infinite;
                }
                @keyframes glowPulse {
                    0%, 84% { opacity: 0; }
                    88% { opacity: 0.6; }
                    92% { opacity: 0.2; }
                    96% { opacity: 0.6; }
                    100% { opacity: 0; }
                }

                /* ---- FLOATING PARTICLES ---- */
                .particle-1 { animation: float1 10s ease-in-out infinite; }
                .particle-2 { animation: float2 10s ease-in-out infinite; }
                .particle-3 { animation: float3 10s ease-in-out infinite; }
                .particle-4 { animation: float4 10s ease-in-out infinite; }

                @keyframes float1 {
                    0%, 100% { opacity: 0; transform: translateY(0); }
                    25% { opacity: 0.15; transform: translateY(-10px); }
                    50% { opacity: 0; transform: translateY(-20px); }
                }
                @keyframes float2 {
                    0%, 100% { opacity: 0; transform: translateY(0); }
                    35% { opacity: 0; }
                    55% { opacity: 0.12; transform: translateY(-12px); }
                    75% { opacity: 0; transform: translateY(-22px); }
                }
                @keyframes float3 {
                    0%, 100% { opacity: 0; transform: translateY(0); }
                    50% { opacity: 0; }
                    70% { opacity: 0.1; transform: translateY(-8px); }
                    90% { opacity: 0; transform: translateY(-18px); }
                }
                @keyframes float4 {
                    0%, 100% { opacity: 0; transform: translateX(0); }
                    60% { opacity: 0; }
                    80% { opacity: 0.12; transform: translateX(-8px); }
                    95% { opacity: 0; transform: translateX(-16px); }
                }

                /* ============ ACCESSIBILITY: Reduced Motion ============ */
                @media (prefers-reduced-motion: reduce) {
                    .scene-welcome,
                    .scene-avatar,
                    .scene-form-fields,
                    .scene-resume,
                    .scene-skills,
                    .scene-verify,
                    .scene-progress,
                    .scene-dashboard,
                    .particle-1, .particle-2, .particle-3, .particle-4,
                    .field-fill-1, .field-fill-2, .field-fill-3,
                    .field-text-1, .field-text-2, .field-text-3,
                    .skill-chip-1, .skill-chip-2, .skill-chip-3, .skill-chip-4, .skill-chip-5,
                    .skill-text-1, .skill-text-2, .skill-text-3, .skill-text-4, .skill-text-5,
                    .verify-badge, .verify-check,
                    .progress-fill, .progress-text,
                    .success-ring, .success-check, .success-fill,
                    .dashboard-glow {
                        animation: none !important;
                        opacity: 0 !important;
                    }
                    /* Show only the success scene as static fallback */
                    .scene-success {
                        animation: none !important;
                        opacity: 1 !important;
                    }
                    .scene-success .success-ring {
                        animation: none !important;
                        stroke-dashoffset: 0 !important;
                        opacity: 1 !important;
                    }
                    .scene-success .success-check {
                        animation: none !important;
                        stroke-dashoffset: 0 !important;
                        opacity: 1 !important;
                    }
                    .scene-success .success-fill {
                        animation: none !important;
                        opacity: 0.1 !important;
                    }
                }
            `}</style>
        </div>
    );
}
