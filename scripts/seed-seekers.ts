import { config } from "dotenv";
config({ path: ".env.local" });

import { hash } from "bcryptjs";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/lib/db/schema";
import { sql } from "drizzle-orm";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const { users, seekerProfiles } = schema;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
});
const db = drizzle(pool, { schema });

const westernLineStations = [
    "Churchgate", "Marine Lines", "Charni Road", "Grant Road", "Mumbai Central",
    "Mahalaxmi", "Lower Parel", "Prabhadevi", "Dadar", "Matunga Road",
    "Mahim Junction", "Bandra", "Khar Road", "Santacruz", "Vile Parle",
    "Andheri", "Jogeshwari", "Ram Mandir", "Goregaon", "Malad",
    "Kandivali", "Borivali", "Dahisar", "Mira Road", "Bhayandar",
    "Naigaon", "Vasai Road", "Nalla Sopara", "Virar"
];

const firstNames = [
    "Abhishek", "Aman", "Aditya", "Amit", "Ankit", "Deepak", "Karan", "Rahul", "Rajesh", "Sanjay", 
    "Sneha", "Priya", "Anjali", "Neha", "Riya", "Kunal", "Mahesh", "Siddharth", "Pooja", "Vikram",
    "Arjun", "Ishaan", "Vihaan", "Pranav", "Sai", "Aavya", "Ananya", "Diya", "Myra", "Saanvi",
    "Rohan", "Sameer", "Tushar", "Varun", "Yash", "Kavita", "Meera", "Palak", "Shweta", "Tanvi"
];
const lastNames = [
    "Sharma", "Patel", "Singh", "Mehta", "Iyer", "Jain", "Desai", "Kulkarni", "Patil", "Shah", 
    "Gupta", "Malhotra", "Shinde", "More", "Bhatia", "Kapur", "Verma", "Reddy", "Nair", "Gokhale",
    "Chaudhary", "Dubey", "Pandey", "Sawant", "Thorat", "Salunkhe", "Jadhav", "Bhosale", "Pawar", "Kadam"
];

const jobPositions = ["Frontend Developer", "Backend Developer", "Fullstack Engineer", "Data Analyst", "UI/UX Designer", "Product Manager", "HR Generalist", "Sales Executive", "Marketing Specialist", "Customer Support Lead", "DevOps Engineer", "QA Engineer", "Business Analyst"];
const industries = ["IT", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "E-commerce", "Apparel", "Logistics"];
const departments = ["Engineering", "Product", "Sales", "Marketing", "Human Resources", "Finance", "Operations", "Design", "Quality Assurance"];

async function seed() {
    try {
        console.log("🚀 Starting database cleanup...");
        // Clear existing data to avoid conflicts with usernames/emails
        await db.execute(sql`TRUNCATE TABLE "seeker_profiles", "users" CASCADE`);

        console.log("🌱 Seeding 100 COMPLETE seeker profiles...");

        const hashedPassword = await hash("Password@123", 10);

        // Prepare Resume Base64
        let resumeBase64 = "https://example.com/resumes/dummy-resume.pdf";
        const resumePath = join(process.cwd(), "public", "resumes", "dummy-resume.pdf");
        
        if (existsSync(resumePath)) {
            const fileBuffer = readFileSync(resumePath);
            const base64Content = fileBuffer.toString('base64');
            resumeBase64 = `data:application/pdf;base64,${base64Content}`;
            console.log("📄 Resume converted to Base64 successfully.");
        } else {
            console.warn("⚠️ Dummy resume file not found at public/resumes/dummy-resume.pdf. Using fallback URL.");
        }

        for (let i = 0; i < 100; i++) {
            const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const fullName = `${firstName} ${lastName}`;
            // Use static parts of email/username for consistency within the 100
            const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${i+1}@example.com`;
            const username = `${firstName.toLowerCase()}${i+1}_${Math.floor(Math.random() * 1000)}`;
            const location = westernLineStations[Math.floor(Math.random() * westernLineStations.length)];
            const position = jobPositions[Math.floor(Math.random() * jobPositions.length)];
            const industry = industries[Math.floor(Math.random() * industries.length)];
            const dept = departments[Math.floor(Math.random() * departments.length)];

            const gender = ["MALE", "FEMALE", "OTHER"][Math.floor(Math.random() * 3)];
            const lookingFor = ["JOB", "INTERNSHIP", "BOTH"][Math.floor(Math.random() * 3)];
            const empStatus = ["UNEMPLOYED", "EMPLOYED", "STUDENT"][Math.floor(Math.random() * 3)];
            const notice = ["IMMEDIATE", "15_DAYS", "30_DAYS", "60_DAYS", "90_DAYS"][Math.floor(Math.random() * 5)];
            const workStatus = Math.random() > 0.3 ? "EXPERIENCED" : "FRESHER";

            const currentSalary = Math.floor(Math.random() * 1500000) + 300000;
            const expectedSalaryMin = currentSalary + 200000;
            const expectedSalaryMax = expectedSalaryMin + 500000;

            await db.transaction(async (tx) => {
                const [newUser] = await tx.insert(users).values({
                    email,
                    password: hashedPassword,
                    username,
                    userRole: "SEEKER",
                    phoneNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
                    isVerified: true,
                    accountStatus: "ACTIVE",
                    isPhoneVerified: true,
                    termsAccepted: true,
                    consentShared: true,
                }).returning();

                await tx.insert(seekerProfiles).values({
                    userId: newUser.id,
                    fullName,
                    position,
                    gender: gender as any,
                    dateOfBirth: new Date(Date.now() - (22 + Math.floor(Math.random() * 15)) * 365 * 24 * 60 * 60 * 1000), // Age 22-37
                    currentLocation: `${location}, Mumbai`,
                    preferredWorkLocation: [location, "Andheri", "Bandra", "BKC", "Powai", "Thane"],
                    nationality: "Indian",
                    willingToRelocate: Math.random() > 0.5,
                    workStatus: workStatus as any,
                    lookingFor: lookingFor as any,
                    currentEmploymentStatus: empStatus as any,
                    noticePeriod: notice as any,
                    preferredWorkType: ["FULL_TIME", "CONTRACT"],
                    preferredWorkMode: ["HYBRID", "ONSITE"],
                    totalExperienceYears: workStatus === "EXPERIENCED" ? Math.floor(Math.random() * 10) + 1 : 0,
                    totalExperienceMonths: Math.floor(Math.random() * 12),
                    currentIndustry: industry,
                    currentDepartment: dept,
                    currentRoleCategory: position,
                    currentJobRole: position,
                    currentSalary: workStatus === "EXPERIENCED" ? currentSalary : 0,
                    bio: `Passionate ${position} based in ${location} with interest in ${industry}.`,
                    careerGoals: `To grow as a ${position} in ${industry}.`,
                    resumeUrl: resumeBase64,
                    coverLetter: `Interested in ${industry} roles.`,
                    portfolioUrl: `https://myportfoliome.vercel.app/`,
                    githubUrl: `https://github.com/SteeveSticks`,
                    linkedinUrl: `https://www.linkedin.com/in/stephen-adebanjo-82a6ba359/`,
                    otherLinks: [],
                    expectedSalaryMin,
                    expectedSalaryMax,
                    preferredIndustry: [industry],
                    preferredCompanyType: ["MNC", "Startup"],
                    shiftPreference: "Day",
                    experienceLevel: workStatus === "EXPERIENCED" ? Math.floor(Math.random() * 10) + 1 : 0,
                    isPublic: true,
                });
            });
            console.log(`✅ Added COMPLETE Profile [${i+1}/100]: ${fullName} (${location})`);
        }
        console.log("🎉 Seeding complete!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    } finally {
        process.exit(0);
    }
}

seed();
