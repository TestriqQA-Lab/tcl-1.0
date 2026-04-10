import pg from "pg";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
    const c = await pool.connect();
    let out = "";
    const log = (m) => { out += m + "\n"; };

    // 1. Role counts
    const roles = await c.query("SELECT user_role, COUNT(*) as cnt FROM users GROUP BY user_role ORDER BY user_role");
    log("=== USER ROLE BREAKDOWN ===");
    roles.rows.forEach(r => log(`  ${r.user_role}: ${r.cnt}`));

    // 2. All seekers with profile info (compact)
    log("\n=== ALL SEEKER USERS + PROFILE ===");
    const seekers = await c.query(`
        SELECT u.id, u.username, u.email, u.phone_number,
               sp.full_name, sp.gender, sp.current_location, sp.work_status, sp.looking_for,
               sp.employment_status, sp.experience_level, sp.bio, sp.position,
               sp.total_experience_years, sp.total_experience_months,
               sp.current_industry, sp.current_department, sp.current_job_role,
               sp.willing_to_relocate, sp.expected_salary_min, sp.expected_salary_max,
               sp.notice_period
        FROM users u
        LEFT JOIN seeker_profiles sp ON sp.user_id = u.id
        WHERE u.user_role = 'SEEKER'
        ORDER BY u.username
    `);
    seekers.rows.forEach((s, i) => {
        log(`\n  [${i+1}] ${s.username} | ${s.email} | phone: ${s.phone_number}`);
        log(`      Name: ${s.full_name} | Gender: ${s.gender} | Location: ${s.current_location}`);
        log(`      WorkStatus: ${s.work_status} | LookingFor: ${s.looking_for} | EmpStatus: ${s.employment_status}`);
        log(`      ExpLevel: ${s.experience_level} | TotalExp: ${s.total_experience_years}y ${s.total_experience_months}m`);
        log(`      Industry: ${s.current_industry} | Dept: ${s.current_department} | Role: ${s.current_job_role}`);
        log(`      Position: ${s.position} | NoticePeriod: ${s.notice_period}`);
        log(`      Salary: ${s.expected_salary_min}-${s.expected_salary_max} | Relocate: ${s.willing_to_relocate}`);
        log(`      Bio: ${s.bio ? s.bio.substring(0, 120) : 'null'}`);
    });

    // 3. All employers with profile info (compact)
    log("\n\n=== ALL EMPLOYER USERS + PROFILE ===");
    const employers = await c.query(`
        SELECT u.id, u.username, u.email, u.phone_number,
               ep.full_name, ep.company_name, ep.account_type, ep.hiring_for,
               ep.designation, ep.company_industry, ep.company_size,
               ep.company_location, ep.verification_status, ep.pincode, ep.company_website
        FROM users u
        LEFT JOIN employer_profiles ep ON ep.user_id = u.id
        WHERE u.user_role = 'EMPLOYER'
        ORDER BY u.username
    `);
    employers.rows.forEach((e, i) => {
        log(`\n  [${i+1}] ${e.username} | ${e.email} | phone: ${e.phone_number}`);
        log(`      Name: ${e.full_name} | Company: ${e.company_name} | Type: ${e.account_type}`);
        log(`      HiringFor: ${e.hiring_for} | Designation: ${e.designation}`);
        log(`      Industry: ${e.company_industry} | Size: ${e.company_size} | Location: ${e.company_location}`);
        log(`      Verification: ${e.verification_status} | Pincode: ${e.pincode}`);
        log(`      Website: ${e.company_website}`);
    });

    // 4. Admin users
    log("\n\n=== ADMIN USERS ===");
    const admins = await c.query("SELECT id, username, email FROM users WHERE user_role = 'ADMIN'");
    admins.rows.forEach(a => log(`  ${a.username} | ${a.email} | ${a.id}`));

    // 5. Quick check: users without profiles
    log("\n\n=== SEEKERS WITHOUT PROFILES ===");
    const noProfile = await c.query(`
        SELECT u.id, u.username, u.email FROM users u 
        LEFT JOIN seeker_profiles sp ON sp.user_id = u.id 
        WHERE u.user_role = 'SEEKER' AND sp.id IS NULL
    `);
    log(`  Count: ${noProfile.rows.length}`);
    noProfile.rows.forEach(r => log(`  - ${r.username} (${r.email})`));

    log("\n=== EMPLOYERS WITHOUT PROFILES ===");
    const noEmpProfile = await c.query(`
        SELECT u.id, u.username, u.email FROM users u 
        LEFT JOIN employer_profiles ep ON ep.user_id = u.id 
        WHERE u.user_role = 'EMPLOYER' AND ep.id IS NULL
    `);
    log(`  Count: ${noEmpProfile.rows.length}`);
    noEmpProfile.rows.forEach(r => log(`  - ${r.username} (${r.email})`));

    c.release();
    await pool.end();

    fs.writeFileSync("tmp/db-summary.md", out, "utf8");
    console.log("Done! Written to tmp/db-summary.md");
}

run().catch(e => { console.error(e); process.exit(1); });
