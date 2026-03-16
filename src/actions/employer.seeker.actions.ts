"use server";

import { db } from "@/lib/db/db";
import { seekerProfiles, users } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, desc, ilike, or, and, gte, lte } from "drizzle-orm";

// A simple string hash function for consistent color generation
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
}

function getInitials(name: string) {
    if (!name) return "Na";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Fetches seeker profiles for the employer database search.
 * This logic mirrors the search API but is accessible as a server action.
 */
export async function getSeekerProfilesForEmployerAction(filters: any = {}) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'EMPLOYER') {
            return { error: 'Unauthorized. Employer access required.' };
        }

        const {
            query = "",
            location = "",
            company = "",
            skills = [],
            experienceMin = 0,
            experienceMax = 99,
            industry = "",
            educationLevel = "",
            gender = ""
        } = filters;

        // Base query with relations
        const profiles = await db.query.seekerProfiles.findMany({
            where: (sp, { and, ilike, gte, lte, eq, or }) => {
                const conditions = [];

                if (query) {
                    conditions.push(
                        or(
                            ilike(sp.fullName, `%${query}%`),
                            ilike(sp.position, `%${query}%`)
                        )
                    );
                }

                if (location) {
                    conditions.push(ilike(sp.currentLocation, `%${location}%`));
                }

                if (gender && gender !== "any") {
                    conditions.push(eq(sp.gender, gender.toUpperCase() as any));
                }

                if (industry) {
                    conditions.push(ilike(sp.currentIndustry, `%${industry}%`));
                }

                // Experience range
                if (Number(experienceMin) > 0) {
                    conditions.push(gte(sp.totalExperienceYears, Number(experienceMin)));
                }
                if (Number(experienceMax) < 99 && Number(experienceMax) > 0) {
                    conditions.push(lte(sp.totalExperienceYears, Number(experienceMax)));
                }

                // We only want public profiles
                conditions.push(eq(sp.isPublic, true));

                return and(...conditions);
            },
            with: {
                user: {
                    with: {
                        experience: true,
                        education: true,
                        skills: true
                    }
                }
            },
            orderBy: [desc(seekerProfiles.createdAt)]
        });

        // In-memory Array Filtering for Relations
        const filteredProfiles = profiles.filter((profile: any) => {
            // 1. Company Filter (Current or Latest Experience)
            if (company) {
                const hasCompany = profile.user.experience.some((exp: any) => 
                    exp.companyName?.toLowerCase().includes(company.toLowerCase())
                );
                if (!hasCompany) return false;
            }

            // 2. Education Filter
            if (educationLevel) {
                const hasEd = profile.user.education.some((ed: any) => {
                    const type = ed.type?.toLowerCase() || "";
                    if (educationLevel === "12th") return type.includes("class xii");
                    if (educationLevel === "undergraduate") return type.includes("degree");
                    if (educationLevel === "postgraduate") return type.includes("post graduation");
                    if (educationLevel === "diploma") return type.includes("diploma");
                    return type.includes(educationLevel.toLowerCase());
                });
                if (!hasEd) return false;
            }

            // 3. Skills Filter (Multi-select)
            if (skills && skills.length > 0) {
                const profileSkillNames = profile.user.skills.map((s: any) => s.skillName.toLowerCase());
                const hasAllSkills = skills.every((skill: string) => 
                    profileSkillNames.some((ps: any) => ps.includes(skill.toLowerCase()))
                );
                if (!hasAllSkills) return false;
            }

            return true;
        });

        // Map to UI representation (CandidateProps)
        const candidates = filteredProfiles.map((profile: any) => {
            // Get latest education
            const latestEd = [...profile.user.education].sort((a: any, b: any) => {
                const yearA = a.endDate ? new Date(a.endDate).getTime() : 0;
                const yearB = b.endDate ? new Date(b.endDate).getTime() : 0;
                return yearB - yearA;
            })[0];
            const educationStr = latestEd ? latestEd.institute || latestEd.type : "Not provided";

            // Get latest experience for company
            const latestExp = [...profile.user.experience].sort((a: any, b: any) => {
                const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                return dateB - dateA; // Descending
            })[0];
            
            const companyName = latestExp ? latestExp.companyName : "Independent";
            const candidateRole = profile.position || latestExp?.designation || "Professional";

            let constructedTitle = candidateRole;
            if (latestExp && latestExp.companyName) {
                constructedTitle += ` at ${latestExp.companyName}`;
            }

            return {
                id: profile.userId,
                name: profile.fullName || "Anonymous Candidate",
                initials: getInitials(profile.fullName),
                avatarColor: stringToColor(profile.fullName || "User"),
                title: constructedTitle,
                company: companyName,
                location: profile.currentLocation || "Location not specified",
                education: educationStr,
                skills: profile.user.skills.map((s: any) => s.skillName),
                companyInitials: getInitials(companyName),
                companyColor: stringToColor(companyName)
            };
        });

        return { success: true, data: candidates };

    } catch (error) {
        console.error("Error in getSeekerProfilesForEmployerAction:", error);
        return { error: "Failed to fetch seeker profiles." };
    }
}
