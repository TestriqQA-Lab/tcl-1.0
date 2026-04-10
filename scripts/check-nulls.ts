import { config } from 'dotenv';
config({ path: '.env.local' });
import { Pool } from 'pg';

async function checkNulls() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: true
    });

    console.log("🔍 Checking for NULL values in seeker_profiles...");
    
    // We'll check most relevant columns
    const columns = [
        'id', 'user_id', 'full_name', 'position', 'gender', 'date_of_birth',
        'current_location', 'preferred_work_location', 'nationality',
        'willing_to_relocate', 'work_status', 'looking_for', 'employment_status',
        'notice_period', 'preferred_work_type', 'preferred_work_mode',
        'total_experience_years', 'total_experience_months', 'current_industry',
        'current_department', 'current_role_category', 'current_job_role',
        'current_salary', 'bio', 'career_goals', 'resume_url', 'cover_letter',
        'portfolio_url', 'github_url', 'linkedin_url', 'expected_salary_min',
        'expected_salary_max', 'preferred_industry', 'preferred_company_type',
        'shift_preference', 'experience_level'
    ];

    const results: Record<string, number> = {};
    
    for (const col of columns) {
        const res = await pool.query(`SELECT count(*) as null_count FROM seeker_profiles WHERE "${col}" IS NULL`);
        results[col] = parseInt(res.rows[0].null_count);
    }

    console.log("Null Counts per Column:");
    console.table(results);

    const totalNulls = Object.values(results).reduce((a, b) => a + b, 0);
    if (totalNulls === 0) {
        console.log("✅ All columns are non-empty for all 50 records!");
    } else {
        console.log(`⚠️ Found ${totalNulls} total NULL values across columns.`);
    }

    process.exit(0);
}

checkNulls();
