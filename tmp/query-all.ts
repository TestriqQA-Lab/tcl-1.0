import { config } from "dotenv";
config({ path: ".env.local" });
import { db } from "../src/lib/db/db";
import { users, employerProfiles, seekerProfiles, jobs, applications, education, experience, skills, certifications, languages, projects, achievements, passwordResetTokens } from "../src/lib/db/schema";
import { sql } from "drizzle-orm";

async function queryAll() {
    console.log("=== QUERYING ALL TABLES ===\n");

    // 1. Users
    const allUsers = await db.select().from(users);
    console.log(`--- USERS (${allUsers.length} records) ---`);
    allUsers.forEach(u => {
        console.log(`  ID: ${u.id} | role: ${u.userRole} | email: ${u.email} | username: ${u.username} | verified: ${u.isVerified} | status: ${u.accountStatus} | provider: ${u.provider}`);
    });

    // 2. Seeker Profiles
    const allSeekers = await db.select().from(seekerProfiles);
    console.log(`\n--- SEEKER_PROFILES (${allSeekers.length} records) ---`);
    allSeekers.forEach(s => {
        console.log(`  ID: ${s.id} | userId: ${s.userId} | name: ${s.fullName} | location: ${s.currentLocation} | workStatus: ${s.workStatus} | expLevel: ${s.experienceLevel}`);
    });

    // 3. Employer Profiles
    const allEmployers = await db.select().from(employerProfiles);
    console.log(`\n--- EMPLOYER_PROFILES (${allEmployers.length} records) ---`);
    allEmployers.forEach(e => {
        console.log(`  ID: ${e.id} | userId: ${e.userId} | company: ${e.companyName} | fullName: ${e.fullName} | type: ${e.accountType} | verification: ${e.verificationStatus}`);
    });

    // 4. Jobs
    const allJobs = await db.select().from(jobs);
    console.log(`\n--- JOBS (${allJobs.length} records) ---`);
    allJobs.forEach(j => {
        console.log(`  ID: ${j.id} | title: ${j.title} | employerId: ${j.employerId} | type: ${j.type} | status: ${j.status} | approval: ${j.approvalStatus} | location: ${j.location}`);
    });

    // 5. Applications
    const allApps = await db.select().from(applications);
    console.log(`\n--- APPLICATIONS (${allApps.length} records) ---`);
    allApps.forEach(a => {
        console.log(`  ID: ${a.id} | applicantId: ${a.applicantId} | jobId: ${a.jobId} | status: ${a.applicationStatus}`);
    });

    // 6. Education
    const allEdu = await db.select().from(education);
    console.log(`\n--- EDUCATION (${allEdu.length} records) ---`);
    allEdu.forEach(e => {
        console.log(`  ID: ${e.id} | userId: ${e.userId} | type: ${e.type} | degree: ${e.degree} | institute: ${e.institute}`);
    });

    // 7. Experience
    const allExp = await db.select().from(experience);
    console.log(`\n--- EXPERIENCE (${allExp.length} records) ---`);
    allExp.forEach(e => {
        console.log(`  ID: ${e.id} | userId: ${e.userId} | company: ${e.companyName} | designation: ${e.designation} | type: ${e.employmentType}`);
    });

    // 8. Skills
    const allSkills = await db.select().from(skills);
    console.log(`\n--- SKILLS (${allSkills.length} records) ---`);
    allSkills.forEach(s => {
        console.log(`  ID: ${s.id} | userId: ${s.userId} | skill: ${s.skillName} | proficiency: ${s.proficiency}`);
    });

    // 9. Certifications
    const allCerts = await db.select().from(certifications);
    console.log(`\n--- CERTIFICATIONS (${allCerts.length} records) ---`);
    allCerts.forEach(c => {
        console.log(`  ID: ${c.id} | userId: ${c.userId} | name: ${c.certificationName} | issuer: ${c.issuer}`);
    });

    // 10. Languages
    const allLangs = await db.select().from(languages);
    console.log(`\n--- LANGUAGES (${allLangs.length} records) ---`);
    allLangs.forEach(l => {
        console.log(`  ID: ${l.id} | userId: ${l.userId} | language: ${l.languageName} | read: ${l.read} | write: ${l.write} | speak: ${l.speak}`);
    });

    // 11. Projects
    const allProjects = await db.select().from(projects);
    console.log(`\n--- PROJECTS (${allProjects.length} records) ---`);
    allProjects.forEach(p => {
        console.log(`  ID: ${p.id} | userId: ${p.userId} | title: ${p.title}`);
    });

    // 12. Achievements
    const allAchievements = await db.select().from(achievements);
    console.log(`\n--- ACHIEVEMENTS (${allAchievements.length} records) ---`);
    allAchievements.forEach(a => {
        console.log(`  ID: ${a.id} | userId: ${a.userId} | type: ${a.type} | title: ${a.title}`);
    });

    // 13. Password Reset Tokens
    const allTokens = await db.select().from(passwordResetTokens);
    console.log(`\n--- PASSWORD_RESET_TOKENS (${allTokens.length} records) ---`);

    // Summary
    console.log("\n\n=== SUMMARY ===");
    console.log(`Users: ${allUsers.length}`);
    console.log(`Seeker Profiles: ${allSeekers.length}`);
    console.log(`Employer Profiles: ${allEmployers.length}`);
    console.log(`Jobs: ${allJobs.length}`);
    console.log(`Applications: ${allApps.length}`);
    console.log(`Education: ${allEdu.length}`);
    console.log(`Experience: ${allExp.length}`);
    console.log(`Skills: ${allSkills.length}`);
    console.log(`Certifications: ${allCerts.length}`);
    console.log(`Languages: ${allLangs.length}`);
    console.log(`Projects: ${allProjects.length}`);
    console.log(`Achievements: ${allAchievements.length}`);
    console.log(`Password Reset Tokens: ${allTokens.length}`);

    process.exit(0);
}

queryAll().catch(err => {
    console.error("Query failed:", err);
    process.exit(1);
});
