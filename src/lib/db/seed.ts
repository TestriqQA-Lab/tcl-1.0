import { config } from "dotenv";
config({ path: ".env.local" }); // Load from .env.local
import { db } from "./db";
import { users, employerProfiles, seekerProfiles, jobs, applications, education, experience, skills, certifications, languages, projects, achievements, User } from "./schema";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Starting DB Seeding...");

    // 1. Clear existing data (in dependency order)
    console.log("Clearing existing data...");
    await db.delete(applications);
    await db.delete(jobs);
    await db.delete(education);
    await db.delete(experience);
    await db.delete(skills);
    await db.delete(certifications);
    await db.delete(languages);
    await db.delete(projects);
    await db.delete(achievements);
    await db.delete(employerProfiles);
    await db.delete(seekerProfiles);
    await db.delete(users);

    // 2. Hash default password
    const passwordHash = await bcrypt.hash("Password123!", 10);

    // 3. Create Users
    console.log("Creating users...");
    const createdUsers = await db.insert(users).values([
        {
            username: "admin_user",
            email: "admin@testriq.com",
            password: passwordHash,
            userRole: "ADMIN",
            isVerified: true,
            accountStatus: "ACTIVE",
            fullName: "System Admin" // Just for logging, not in schema
        } as any, // Full name isn't in users, it's in profiles
        {
            username: "techcorp_emp",
            email: "hr@techcorp.com",
            password: passwordHash,
            userRole: "EMPLOYER",
            isVerified: true,
            accountStatus: "ACTIVE",
        },
        {
            username: "innovate_emp",
            email: "careers@innovatetech.io",
            password: passwordHash,
            userRole: "EMPLOYER",
            isVerified: true,
            accountStatus: "ACTIVE",
        },
        {
            username: "john_seeker",
            email: "john.doe@example.com",
            password: passwordHash,
            userRole: "SEEKER",
            isVerified: true,
            accountStatus: "ACTIVE",
        },
        {
            username: "jane_seeker",
            email: "jane.smith@example.com",
            password: passwordHash,
            userRole: "SEEKER",
            isVerified: true,
            accountStatus: "ACTIVE",
        }
    ]).returning();

    const techCorpUser = createdUsers.find(u => u.email === "hr@techcorp.com")!;
    const innovateUser = createdUsers.find(u => u.email === "careers@innovatetech.io")!;
    const johnUser = createdUsers.find(u => u.email === "john.doe@example.com")!;
    const janeUser = createdUsers.find(u => u.email === "jane.smith@example.com")!;

    // 4. Create Employer Profiles
    console.log("Creating employer profiles...");
    await db.insert(employerProfiles).values([
        {
            userId: techCorpUser.id,
            accountType: "COMPANY" as const,
            hiringFor: "COMPANY" as const,
            fullName: "TechCorp HR",
            designation: "HR Manager",
            companyName: "TechCorp Global",
            companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdZa_HZnMhN8Y16gaQS0wmgJAX2QQPz7g8xYDA-CFKERzCSQyWqTXeboGl6ZLyt3dzfKl3hEyjjKWzF50mUvAFLYNxcbhyonFHndN8VAgQtbENjbC_IXiKlUhGlLOkrGuJnLEx8LK38Pd14SF-jHoD_kLRKZVb6-LgeEBiJd1_3hZulgs-bPp2NREZoWNTjbHbB3J40eI2_VRb-uafIV2i2Vffh_LAgxI4fGGEdl42UBJX2Ia5eNRIlStZF320YYiXBW04S0r3D3rh",
            companyDescription: "Leading provider of enterprise software solutions for Fortune 500 companies.",
            companyWebsite: "https://techcorp.global",
            companySize: "501-1000" as const,
            companyIndustry: "Enterprise Software",
            companyLocation: "San Francisco, CA",
        },
        {
            userId: innovateUser.id,
            accountType: "COMPANY" as const,
            hiringFor: "COMPANY" as const,
            fullName: "InnovateTech Careers",
            designation: "Talent Acquisition Lead",
            companyName: "InnovateTech",
            companyLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhlor9VzdD8vX3YDQePkFjBsfp4c2Xws4UBQVap-Ye0bTqi0RgdNJeZGxy4RMAXyfQsk8l9NfkyJHUs6N7qS_l961MbASsqfl8s9OMF2IIAAeVMV25nY7rCZKgu7kbAql5cQi5P0vQGtbJ1V-SWwCyPVNi_dkIy4Z68XwDVCq7Njj-aN_swc60UKuaH-bB8Wuo68mtLymPgQcFEOLXvAjHfQEPk4h83TsWszrWpmPEdjUaoetJj514pnDg4e6S-WN1Fp5hTEZj91jU",
            companyDescription: "A fast-growing startup revolutionizing the fintech space with AI-driven insights.",
            companyWebsite: "https://innovatetech.io",
            companySize: "11-50" as const,
            companyIndustry: "Fintech",
            companyLocation: "Bengaluru, India",
        }
    ]);

    // 5. Create Seeker Profiles
    console.log("Creating seeker profiles...");
    await db.insert(seekerProfiles).values([
        {
            userId: johnUser.id,
            fullName: "John Doe",
            currentLocation: "New York, USA",
            bio: "Passionate full-stack developer with 5 years of experience in React and Node.js.",
            experienceLevel: 5,
        },
        {
            userId: janeUser.id,
            fullName: "Jane Smith",
            currentLocation: "London, UK",
            bio: "Creative UX Designer focusing on building accessible and intuitive digital products.",
            experienceLevel: 3,
        }
    ]);

    // 6. Create Jobs (20 items)
    console.log("Creating jobs...");
    const jobData = [
        // TechCorp Jobs (10)
        {
            employerId: techCorpUser.id,
            title: "Senior Full Stack Engineer",
            description: "Join our core platform team to build scalable enterprise solutions.",
            type: "REMOTE" as const,
            location: "Remote (Global)",
            salaryMin: 130000,
            salaryMax: 180000,
            status: "OPEN" as const,
            experienceLevel: 5,
            applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            requiredSkills: ["React", "Node.js", "PostgreSQL", "AWS"],
            overview: [
                "TechCorp is looking for a Senior Full Stack Engineer to lead technical initiatives for our core enterprise platform.",
                "You will work closely with product managers and other engineers to deliver high-quality software."
            ],
            responsibilities: [
                "Design and develop scalable backend APIs using Node.js and Express.",
                "Build responsive and intuitive frontend interfaces using React.",
                "Mentoring junior engineers and conducting code reviews."
            ],
            requirements: [
                "5+ years of full-stack engineering experience.",
                "Deep understanding of modern web architecture and cloud services.",
                "Excellent communication and problem-solving skills."
            ],
            howToApply: "Please apply via our career portal with your updated resume and GitHub profile."
        },
        {
            employerId: techCorpUser.id,
            title: "Frontend Developer (React)",
            description: "Build beautiful and responsive UIs for our enterprise clients.",
            type: "HYBRID" as const,
            location: "San Francisco, CA",
            salaryMin: 90000,
            salaryMax: 120000,
            status: "OPEN" as const,
            experienceLevel: 2,
            applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            requiredSkills: ["React", "TypeScript", "Tailwind CSS"],
            overview: ["We need a passionate frontend dev to craft compelling user experiences."],
            responsibilities: ["Develop UI components", "Collaborate with design team"],
            requirements: ["2+ years of React experience"],
            howToApply: "Submit your portfolio and resume."
        },
        // InnovateTech Jobs (10)
        {
            employerId: innovateUser.id,
            title: "Product Designer",
            description: "Lead the design of our next-generation fintech app.",
            type: "ONSITE" as const,
            location: "Bengaluru, India",
            salaryMin: 3000000, // INR
            salaryMax: 4500000,
            status: "OPEN" as const,
            experienceLevel: 4,
            applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            requiredSkills: ["Figma", "UI/UX", "Prototyping"],
            overview: ["Design intuitive financial experiences for millions of users."],
            responsibilities: ["End-to-end product design", "User research"],
            requirements: ["Strong portfolio", "4+ years in product design"],
            howToApply: "Send your portfolio link and resume."
        },
        {
            employerId: innovateUser.id,
            title: "Backend Engineer (Go)",
            description: "Scale our high-throughput transaction engine.",
            type: "REMOTE" as const,
            location: "Remote (India)",
            salaryMin: 2500000,
            salaryMax: 4000000,
            status: "OPEN" as const,
            experienceLevel: 3,
            applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            requiredSkills: ["Golang", "Microservices", "Kafka"],
            overview: ["Help us build the most reliable fintech backend."],
            responsibilities: ["Develop microservices in Go", "Optimize database queries"],
            requirements: ["3+ years backend experience (preferably Go)"],
            howToApply: "Apply with your resume."
        }
    ];

    // Generate remaining 16 mock jobs by duplicating and slightly modifying the base ones
    for (let i = 0; i < 8; i++) {
        jobData.push({
            ...jobData[0],
            title: `Software Engineer L${i + 2}`,
            salaryMin: 100000 + (i * 10000),
            salaryMax: 130000 + (i * 10000),
            employerId: techCorpUser.id
        });
        jobData.push({
            ...jobData[2],
            title: `UX Designer - Growth Team (${i + 1})`,
            salaryMin: 2000000 + (i * 200000),
            salaryMax: 3000000 + (i * 200000),
            employerId: innovateUser.id
        });
    }

    await db.insert(jobs).values(jobData);

    console.log(`✅ Seeding Complete!`);
    console.log(`Created 5 Users, 2 Employers, 2 Seekers, and ${jobData.length} Jobs.`);
    process.exit(0);
}

main().catch((err) => {
    console.error("Seeding failed:");
    console.error(err);
    process.exit(1);
});
