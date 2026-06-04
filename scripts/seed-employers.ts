import { config } from "dotenv";
config({ path: ".env.local" });

import { hash } from "bcryptjs";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

const { users, employerProfiles } = schema;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
const db = drizzle(pool, { schema });

const mumbaiBusinessHubs = [
    "BKC, Bandra", "Lower Parel", "Nariman Point", "Powai", "Andheri East", 
    "Worli", "Vikhroli", "Mittage, Thane", "Belapur, Navi Mumbai"
];

const fancyCompanyNames = [
    "Stellar Tech Solutions", "Apex Global", "Ethereal Design Studio", "Quantum Nexus",
    "Celestial FinTech", "Lumina Global", "Nova Synergy", "Zenith Systems",
    "Blue Horizons", "Emerald Insight", "Phoenix Creative", "Silver Lining IT",
    "Golden Gate Logistics", "Orion Analytics", "Aura Wellness", "Titan Industries",
    "Vanguard Venture", "Sapphire Soft", "Infinite Ideas", "Pinnacle Partners",
    "Velocity Advisors", "Meridian Media", "Obsidian Security", "Crystal Consulting",
    "Radiant Retail", "Nebula Networking", "Oasis Offshore", "Prism Professional",
    "Solaris Solar", "Gravity Games", "Fusion FoodTech", "Element EdTech"
];

const firstNames = [
    "Rajesh", "Amit", "Sanjay", "Vikram", "Sunil", "Anil", "Rahul", "Pankaj", "Deepak", "Manoj",
    "Snehal", "Priya", "Anusha", "Megha", "Shweta", "Riya", "Kavita", "Sita", "Gita", "Lata",
    "Arvind", "Bhavesh", "Chetan", "Dinesh", "Eknath", "Farhan", "Girish", "Harish", "Ishwar", "Jatin"
];

const lastNames = [
    "Kulkarni", "Deshpande", "Patil", "Sharma", "Varma", "Jain", "Mehta", "Shah", "Gupta", "Malhotra",
    "Shinde", "More", "Bhosale", "Pawar", "Jadhav", "Salunkhe", "Sawant", "Thorat", "Kadam", "Bhatt"
];

const designations = [
    "HR Manager", "CEO", "Technical Lead", "Operations Manager", "Talent Acquisition Specialist",
    "Founder", "Director", "Marketing Head", "Sales Manager", "Project Coordinator"
];

const industries = ["IT", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "E-commerce", "Media", "Consulting"];

const OFFICE_BUILDING_LOGO = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM2YjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cmVjdCB3aWR0aD0iMTYiIGhlaWdodD0iMjAiIHg9IjQiIHk9IjIiIHJ4PSIyIiByeT0iMiIvPjxwYXRoIGQ9Ik05IDIydi00aDZ2NCIvPjxwYXRoIGQ9Ik04IDZoLjAxIi8+PHBhdGggZD0iTTE2IDZoLjAxIi8+PHBhdGggZD0iTTggMTBoLjAxIi8+PHBhdGggZD0iTTE2IDEwaC4wMSIvPjxwYXRoIGQ9Ik04IDE0aC4wMSIvPjxwYXRoIGQ9Ik0xNiAxNGguMDEiLz48cGF0aCBkPSJNMTUgMThoLjAxIi8+PHBhdGggZD0iTTkgMThoLjAxIi8+PC9zdmc+";

async function seed() {
    try {
        console.log("🚀 Cleaning up existing employers...");
        await db.execute(sql`DELETE FROM "users" WHERE "user_role" = 'EMPLOYER'`);

        console.log("🌱 Seeding 160 Employer profiles with unique Base64 logos...");

        const hashedPassword = await hash("Password@123", 10);

        // 1. Seed 150 COMPANY accounts
        for (let i = 0; i < 150; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const fullName = `${firstName} ${lastName}`;
            const compName = fancyCompanyNames[Math.floor(Math.random() * fancyCompanyNames.length)] + (Math.random() > 0.5 ? " PVT LTD" : " Group");
            const email = `employer${i+1}@${compName.toLowerCase().replace(/\s+/g, '')}.com`;
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const username = `emp_${firstName.toLowerCase()}${i+1}_${randomCode}`;
            const location = mumbaiBusinessHubs[Math.floor(Math.random() * mumbaiBusinessHubs.length)];
            const industry = industries[Math.floor(Math.random() * industries.length)];
            const desig = designations[Math.floor(Math.random() * designations.length)];

            await db.transaction(async (tx) => {
                const [newUser] = await tx.insert(users).values({
                    email,
                    password: hashedPassword,
                    username,
                    userRole: "EMPLOYER",
                    phoneNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
                    isVerified: true,
                    accountStatus: "ACTIVE",
                    isPhoneVerified: true,
                    termsAccepted: true,
                    consentShared: true,
                }).returning();

                await tx.insert(employerProfiles).values({
                    userId: newUser.id,
                    fullName,
                    accountType: "COMPANY",
                    hiringFor: "COMPANY",
                    designation: desig,
                    companyName: compName,
                    companyLogo: OFFICE_BUILDING_LOGO,
                    companyIndustry: industry,
                    companyLocation: location,
                    companyAddress: `${Math.floor(Math.random() * 500) + 1}, Business Park, ${location}, Mumbai`,
                    pincode: (400001 + Math.floor(Math.random() * 99)).toString(),
                    verificationStatus: "APPROVED",
                    companyWebsite: `https://www.${compName.toLowerCase().replace(/\s+/g, '')}.com`,
                    companySize: "51-200",
                });
            });
            console.log(`✅ Added COMPANY Employer [${i+1}/150]: ${compName} with Base64 Logo`);
        }

        // 2. Seed 10 INDIVIDUAL accounts
        console.log("🏠 Seeding 10 INDIVIDUAL Employer accounts...");
        for (let i = 150; i < 160; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const fullName = `${firstName} ${lastName}`;
            const email = `indiv${i+1}@testmail.com`;
            const randomCode = Math.floor(1000 + Math.random() * 9000);
            const username = `ind_${firstName.toLowerCase()}${i+1}_${randomCode}`;
            const location = mumbaiBusinessHubs[Math.floor(Math.random() * mumbaiBusinessHubs.length)];

            await db.transaction(async (tx) => {
                const [newUser] = await tx.insert(users).values({
                    email,
                    password: hashedPassword,
                    username,
                    userRole: "EMPLOYER",
                    phoneNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
                    isVerified: true,
                    accountStatus: "ACTIVE",
                    isPhoneVerified: true,
                    termsAccepted: true,
                    consentShared: true,
                }).returning();

                await tx.insert(employerProfiles).values({
                    userId: newUser.id,
                    fullName,
                    accountType: "INDIVIDUAL",
                    hiringFor: "INDIVIDUAL_PROPRIETOR",
                    designation: "Independent Consultant",
                    companyName: `${fullName} & Associates`,
                    companyLogo: OFFICE_BUILDING_LOGO,
                    companyIndustry: "Consulting",
                    companyLocation: location,
                    companyAddress: `Residence ${Math.floor(Math.random() * 100) + 1}, ${location}, Mumbai`,
                    pincode: (400001 + Math.floor(Math.random() * 99)).toString(),
                    verificationStatus: "APPROVED",
                });
            });
            console.log(`✅ Added INDIVIDUAL Employer [${i+1-150}/10]: ${fullName} with Base64 Logo`);
        }

        console.log("🎉 Employer seeding complete!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        process.exit(0);
    }
}

seed();
