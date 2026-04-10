import pg from "pg";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function verify() {
    const c = await pool.connect();
    let out = "";
    const log = (m) => { out += m + "\n"; };

    log("═══════════════════════════════════════════");
    log("  VERIFICATION — ALL TABLE COUNTS");
    log("═══════════════════════════════════════════\n");

    const tables = [
        "users", "seeker_profiles", "employer_profiles", "jobs",
        "applications", "education", "experience", "skills",
        "certifications", "languages", "projects", "achievements",
        "password_reset_tokens", "otp_tokens"
    ];

    let total = 0;
    for (const t of tables) {
        try {
            const r = await c.query(`SELECT COUNT(*) as cnt FROM "${t}"`);
            const cnt = parseInt(r.rows[0].cnt);
            total += cnt;
            const status = cnt > 0 ? "✅" : "⚪";
            log(`  ${status} ${t.padEnd(25)} ${String(cnt).padStart(5)} records`);
        } catch (e) {
            log(`  ❌ ${t.padEnd(25)} ERROR: ${e.message}`);
        }
    }
    log(`\n  ─────────────────────────────────────────`);
    log(`  GRAND TOTAL:               ${total} records`);

    // Sample data from newly seeded tables
    log("\n\n═══ SAMPLE: 3 JOBS ═══");
    const jobs = await c.query("SELECT title, location, type, salary_min, salary_max, status, approval_status FROM jobs LIMIT 3");
    jobs.rows.forEach((j, i) => log(`  [${i+1}] ${j.title} | ${j.location} | ${j.type} | ₹${j.salary_min}-${j.salary_max} | ${j.status} | ${j.approval_status}`));

    log("\n═══ SAMPLE: 3 EDUCATION ═══");
    const edu = await c.query("SELECT e.type, e.board, e.degree, e.stream, e.percentage, e.institute FROM education e LIMIT 3");
    edu.rows.forEach((e, i) => log(`  [${i+1}] ${e.type} | ${e.board || '-'} | ${e.degree || '-'} | ${e.stream || '-'} | ${e.percentage || '-'} | ${e.institute}`));

    log("\n═══ SAMPLE: 3 EXPERIENCE ═══");
    const exp = await c.query("SELECT company_name, designation, employment_type, is_current FROM experience LIMIT 3");
    exp.rows.forEach((e, i) => log(`  [${i+1}] ${e.company_name} | ${e.designation} | ${e.employment_type} | current: ${e.is_current}`));

    log("\n═══ SAMPLE: 5 SKILLS ═══");
    const sk = await c.query("SELECT s.skill_name, s.proficiency FROM skills s LIMIT 5");
    sk.rows.forEach((s, i) => log(`  [${i+1}] ${s.skill_name} (${s.proficiency})`));

    log("\n═══ SAMPLE: 3 APPLICATIONS ═══");
    const apps = await c.query(`
        SELECT u.username, j.title, a.application_status
        FROM applications a
        JOIN users u ON u.id = a.applicant_id
        JOIN jobs j ON j.id = a.job_id
        LIMIT 3
    `);
    apps.rows.forEach((a, i) => log(`  [${i+1}] ${a.username} → ${a.title} | Status: ${a.application_status}`));

    log("\n═══ SAMPLE: 3 CERTIFICATIONS ═══");
    const certs = await c.query("SELECT certification_name, issuer FROM certifications LIMIT 3");
    certs.rows.forEach((c2, i) => log(`  [${i+1}] ${c2.certification_name} by ${c2.issuer}`));

    log("\n═══ SAMPLE: 3 PROJECTS ═══");
    const prj = await c.query("SELECT title, technologies FROM projects LIMIT 3");
    prj.rows.forEach((p, i) => log(`  [${i+1}] ${p.title} [${p.technologies.join(', ')}]`));

    log("\n═══ SAMPLE: 3 LANGUAGES ═══");
    const lang = await c.query("SELECT language_name, read, write, speak FROM languages LIMIT 3");
    lang.rows.forEach((l, i) => log(`  [${i+1}] ${l.language_name} | R:${l.read} W:${l.write} S:${l.speak}`));

    log("\n═══ SAMPLE: 3 ACHIEVEMENTS ═══");
    const ach = await c.query("SELECT type, title, organization FROM achievements LIMIT 3");
    ach.rows.forEach((a, i) => log(`  [${i+1}] [${a.type}] ${a.title} @ ${a.organization}`));

    c.release();
    await pool.end();

    fs.writeFileSync("tmp/verify-result.md", out, "utf8");
    console.log("Done! Written to tmp/verify-result.md");
}

verify().catch(e => { console.error(e); process.exit(1); });
