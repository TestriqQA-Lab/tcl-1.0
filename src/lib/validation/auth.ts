import { z } from "zod";

// Login schema
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

// Register schema
export const registerSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .min(2, "Name must be at least 2 characters"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Invalid email format"),
    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters"),
});

// Inferred types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
