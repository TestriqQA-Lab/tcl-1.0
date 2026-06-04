import React from "react";
import { MoveRight } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    hasArrow?: boolean;
}

export const Button = ({
    children,
    variant = "primary",
    size = "md",
    className = "",
    hasArrow = false,
    ...props
}: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md"; // standard rounded-md for modern look, 0px if strict swiss, but Figma shows rounded buttons. User said "0px border radius" in rules but "Rounded buttons" in my analysis of Figma.
    // Reviewing User Rules: "0px border radius" is listed under UI, LAYOUT & DESIGN RULES.
    // HOWEVER: "Match Figma design 1:1" is the absolute constraint.
    // Looking at the provided image: The "Search Jobs" button is rounded. The "Post a Job" button is rounded. The cards have rounded corners.
    // "0px border radius" might be a generic rule from the prompt template, but the Figma clearly shows rounded corners.
    // Constraint: "If any instruction conflicts with the Figma design: -> Figma always wins."
    // So I will use rounded corners as per Figma.

    const variants = {
        primary: "bg-[#0f766e] text-white hover:bg-[#0d6b63] focus:ring-[#0f766e]", // Teal
        secondary: "bg-[#f3f4f6] text-gray-900 hover:bg-[#e5e7eb] focus:ring-gray-500", // Gray
        outline: "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
    };

    const sizes = {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
            {hasArrow && <MoveRight className="ml-2 w-4 h-4" />}
        </button>
    );
};
