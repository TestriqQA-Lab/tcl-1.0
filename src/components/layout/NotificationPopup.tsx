"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, Check, Settings, Briefcase, Users, Bell, Eye, MessageCircle, Star, TrendingUp, Shield } from "lucide-react";

interface Notification {
    id: string;
    type: "job" | "community" | "system";
    title: string;
    description: string;
    time: string;
    read: boolean;
    icon: React.ReactNode;
    accentColor: string;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "job",
        title: "New Job Match: Senior React Developer",
        description: "GlobalStream Systems posted a role matching your profile — ₹18-25L, Mumbai.",
        time: "2 min ago",
        read: false,
        icon: <Briefcase className="w-4 h-4" />,
        accentColor: "bg-emerald-500",
    },
    {
        id: "2",
        type: "community",
        title: "Your profile was viewed 12 times",
        description: "Recruiters from TCS, Infosys, and 3 others viewed your profile this week",
        time: "1 hr ago",
        read: false,
        icon: <Eye className="w-4 h-4" />,
        accentColor: "bg-blue-500",
    },
    {
        id: "3",
        type: "job",
        title: "Application Update: Fullstack Developer",
        description: "Your application at TechVista Inc. moved to the interview stage 🎉",
        time: "3 hrs ago",
        read: false,
        icon: <Star className="w-4 h-4" />,
        accentColor: "bg-amber-500",
    },
    {
        id: "4",
        type: "community",
        title: "New message from a Recruiter",
        description: "Hi Rohan, I came across your profile and would love to discuss an opportunity...",
        time: "5 hrs ago",
        read: true,
        icon: <MessageCircle className="w-4 h-4" />,
        accentColor: "bg-violet-500",
    },
    {
        id: "5",
        type: "system",
        title: "Profile Strength Tip",
        description: "Add 2 more skills to boost your profile visibility by 3x",
        time: "1 day ago",
        read: true,
        icon: <TrendingUp className="w-4 h-4" />,
        accentColor: "bg-orange-500",
    },
    {
        id: "6",
        type: "system",
        title: "Security Alert: New Login",
        description: "A new login was detected from Chrome on Windows. Was this you?",
        time: "2 days ago",
        read: true,
        icon: <Shield className="w-4 h-4" />,
        accentColor: "bg-red-500",
    },
];

const tabs = [
    { id: "all", label: "All" },
    { id: "job", label: "Jobs" },
    { id: "community", label: "Community" },
    { id: "system", label: "System" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface NotificationPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export const NotificationPopup = ({ isOpen, onClose }: NotificationPopupProps) => {
    const [activeTab, setActiveTab] = useState<TabId>("all");
    const [notifications, setNotifications] = useState(mockNotifications);
    const popupRef = useRef<HTMLDivElement>(null);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        if (isOpen) {
            // Small delay to avoid the trigger click closing immediately
            const timer = setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 100);
            return () => {
                clearTimeout(timer);
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen, onClose]);

    // ESC to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const filtered = activeTab === "all" ? notifications : notifications.filter((n) => n.type === activeTab);
    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAllRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const markRead = (id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    };

    const dismiss = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <div
            ref={popupRef}
            className="absolute right-0 top-full mt-2 w-[420px] max-h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[100] flex flex-col"
            style={{
                animation: "popupSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
        >
            {/* Inline keyframes */}
            <style>{`
                @keyframes popupSlideIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>

            {/* Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2.5">
                        <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[11px] font-bold text-white bg-gradient-to-r from-[#0f766d] to-[#10b981] px-2.5 py-0.5 rounded-full shadow-sm">
                                {unreadCount} new
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs font-semibold text-[#0f766d] hover:bg-[#0f766d]/10 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                            >
                                <Check className="w-3.5 h-3.5" /> Mark all read
                            </button>
                        )}
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <Settings className="w-4 h-4" />
                        </button>
                        <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mt-3 bg-gray-50 p-1 rounded-xl">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        const count = tab.id === "all" ? notifications.length : notifications.filter((n) => n.type === tab.id).length;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all duration-200 ${isActive
                                    ? "bg-white text-[#0f766d] shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.label}
                                <span className={`ml-1 text-[10px] ${isActive ? "text-[#0f766d]/70" : "text-gray-400"}`}>
                                    ({count})
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto px-2 pb-2" style={{ maxHeight: "380px" }}>
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                        <Bell className="w-10 h-10 mb-3 opacity-30" />
                        <p className="text-sm font-medium">No notifications here</p>
                        <p className="text-xs mt-1">Check back later for updates</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {filtered.map((notification) => (
                            <div
                                key={notification.id}
                                onClick={() => markRead(notification.id)}
                                className={`group relative flex gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:bg-gray-50 ${!notification.read ? "bg-[#f0fdf9]" : ""
                                    }`}
                            >
                                {/* Unread Indicator */}
                                {!notification.read && (
                                    <div className="absolute top-3 left-1 w-1.5 h-1.5 bg-[#0f766d] rounded-full" />
                                )}

                                {/* Icon */}
                                <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${notification.accentColor} text-white flex items-center justify-center shadow-sm mt-0.5`}>
                                    {notification.icon}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm leading-snug ${!notification.read ? "font-semibold text-gray-900" : "font-medium text-gray-700"}`}>
                                        {notification.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                                        {notification.description}
                                    </p>
                                    <span className="text-[11px] text-gray-400 mt-1 block">{notification.time}</span>
                                </div>

                                {/* Dismiss */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dismiss(notification.id);
                                    }}
                                    className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 px-5 py-3">
                <button className="w-full text-center text-sm font-semibold text-[#0f766d] hover:bg-[#0f766d]/5 py-2 rounded-lg transition-colors">
                    View all notifications →
                </button>
            </div>
        </div>
    );
};
