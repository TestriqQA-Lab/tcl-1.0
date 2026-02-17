import React from 'react';
import { Mail, Phone, MapPin, CheckCircle, ShieldCheck, User } from 'lucide-react';

const ProfileHeader = () => {
    return (
        <div className="flex flex-col xl:flex-row gap-6 mb-6">
            {/* User Info Card */}
            <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative shrink-0">
                    <div className="w-28 h-28 relative">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle
                                cx="56"
                                cy="56"
                                r="48"
                                stroke="#e5e7eb"
                                strokeWidth="6"
                                fill="transparent"
                            />
                            <circle
                                cx="56"
                                cy="56"
                                r="48"
                                stroke="#0f766e" // emerald-700
                                strokeWidth="6"
                                fill="transparent"
                                strokeDasharray="301.6"
                                strokeDashoffset="205" // ~32% filled
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-2xl font-bold text-gray-900">32%</span>
                            <span className="text-[10px] text-gray-500 uppercase font-medium">COMPLETE</span>
                        </div>
                    </div>
                    <button className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-[#117a7a] text-white text-[10px] font-bold py-1 px-3 rounded-full border-2 border-white shadow-sm whitespace-nowrap">
                        ADD PHOTO
                    </button>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                        <h1 className="text-2xl font-bold text-gray-900 break-words text-center md:text-left">Shravan More</h1>
                        <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-50 shrink-0" />
                    </div>

                    <p className="text-sm text-gray-600 mb-4 font-medium">
                        B.Tech/B.E, Indian Institute of Technology (IIT), Mumbai
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                            <MapPin className="w-3.5 h-3.5" />
                            Mumbai
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                            <Phone className="w-3.5 h-3.5" />
                            +91 98765 43210
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                            <Mail className="w-3.5 h-3.5" />
                            shravan.m@email.com
                            <span className="text-[#117a7a] text-xs font-bold cursor-pointer ml-1 uppercase">Verify</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full">
                            <User className="w-3.5 h-3.5" />
                            Male
                        </div>
                    </div>

                    {/* Visibility Note Section embedded in card if needed, or separate. 
                   Design shows it as a strip below nav. 
                   Actually in the image 'desktop.png', the "View & Edit | Activity insights" tab is below this.
                   And "Your profile is visible..." is a green strip below that. 
               */}
                </div>
            </div>

            {/* Missing Details Card - Styled as 'Fix Now' */}
            <div className="w-full xl:w-[320px] shrink-0 bg-[#f0f9f9] rounded-2xl p-5 border border-[#cce3e3] flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="text-[#117a7a] mt-0.5">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-[#0f766d] leading-snug">
                            Complete your profile to unlock premium matches
                        </p>
                    </div>
                </div>

                <button className="bg-[#0f766d] hover:bg-[#0d655d] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm whitespace-nowrap uppercase">
                    Fix Now
                </button>
            </div>
        </div>
    );
};

export default ProfileHeader;
