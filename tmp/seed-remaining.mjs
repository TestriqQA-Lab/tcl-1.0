import pg from "pg";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config({ path: ".env.local" });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// ═══════════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════════

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const uuid = () => crypto.randomUUID();
const now = () => new Date().toISOString();
const dateStr = (d) => d.toISOString().split("T")[0]; // YYYY-MM-DD
const pastDate = (yearsAgo, monthsAgo = 0) => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - yearsAgo);
    d.setMonth(d.getMonth() - monthsAgo);
    return dateStr(d);
};
const futureDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString();
};

// ═══════════════════════════════════════════════════════════════
//  DATA POOLS
// ═══════════════════════════════════════════════════════════════

const SKILLS_BY_POSITION = {
    "Frontend Developer": ["React", "JavaScript", "TypeScript", "HTML/CSS", "Tailwind CSS", "Redux", "Next.js", "Vue.js"],
    "Backend Developer": ["Node.js", "Python", "Java", "PostgreSQL", "MongoDB", "REST APIs", "Docker", "Express.js"],
    "Fullstack Engineer": ["React", "Node.js", "TypeScript", "MongoDB", "PostgreSQL", "AWS", "Docker", "GraphQL"],
    "UI/UX Designer": ["Figma", "Sketch", "Adobe XD", "User Research", "Prototyping", "Wireframing", "InVision", "Miro"],
    "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "Jenkins", "Ansible"],
    "QA Engineer": ["Selenium", "JIRA", "Manual Testing", "Postman", "SQL", "TestNG", "Cypress", "API Testing"],
    "Product Manager": ["Agile", "JIRA", "Roadmapping", "User Stories", "SQL", "Analytics", "Scrum", "Stakeholder Management"],
    "Business Analyst": ["Excel", "SQL", "Tableau", "Data Modeling", "Power BI", "Requirements Gathering", "JIRA", "Visio"],
    "Data Analyst": ["Python", "SQL", "Tableau", "Excel", "R", "Statistics", "Power BI", "Pandas"],
    "Marketing Specialist": ["SEO", "Google Analytics", "Content Marketing", "Social Media", "Email Marketing", "HubSpot", "Copywriting", "PPC"],
    "Sales Executive": ["CRM", "Salesforce", "Negotiation", "Lead Generation", "Cold Calling", "B2B Sales", "Presentation", "Pipeline Management"],
    "HR Generalist": ["Recruitment", "HRIS", "Payroll", "Compliance", "Employee Relations", "Training", "ATS", "Onboarding"],
    "Customer Support Lead": ["Zendesk", "CRM", "Communication", "Problem Solving", "Freshdesk", "Ticketing", "SLA Management", "Team Leadership"]
};

const CERTS_BY_POSITION = {
    "Frontend Developer": [
        { name: "Meta Front-End Developer", issuer: "Meta / Coursera" },
        { name: "React Developer Certification", issuer: "HackerRank" },
        { name: "JavaScript Algorithms and Data Structures", issuer: "freeCodeCamp" }
    ],
    "Backend Developer": [
        { name: "AWS Certified Developer - Associate", issuer: "Amazon Web Services" },
        { name: "MongoDB Certified Developer", issuer: "MongoDB Inc." },
        { name: "Java SE Programmer", issuer: "Oracle" }
    ],
    "Fullstack Engineer": [
        { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services" },
        { name: "Google Cloud Associate Engineer", issuer: "Google Cloud" },
        { name: "Full Stack Web Development", issuer: "Coursera / University of Hong Kong" }
    ],
    "UI/UX Designer": [
        { name: "Google UX Design Professional Certificate", issuer: "Google / Coursera" },
        { name: "Certified Usability Analyst", issuer: "Human Factors International" },
        { name: "Adobe Certified Expert - XD", issuer: "Adobe" }
    ],
    "DevOps Engineer": [
        { name: "AWS DevOps Engineer Professional", issuer: "Amazon Web Services" },
        { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF" },
        { name: "Docker Certified Associate", issuer: "Docker Inc." }
    ],
    "QA Engineer": [
        { name: "ISTQB Foundation Level", issuer: "ISTQB" },
        { name: "Certified Selenium Professional", issuer: "Agile Testing Alliance" },
        { name: "API Testing Certification", issuer: "Postman" }
    ],
    "Product Manager": [
        { name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance" },
        { name: "Product Management Certificate", issuer: "Product School" },
        { name: "PMP - Project Management Professional", issuer: "PMI" }
    ],
    "Business Analyst": [
        { name: "CBAP - Certified Business Analysis Professional", issuer: "IIBA" },
        { name: "Google Data Analytics Certificate", issuer: "Google / Coursera" },
        { name: "Tableau Desktop Certified Associate", issuer: "Tableau / Salesforce" }
    ],
    "Data Analyst": [
        { name: "Google Data Analytics Certificate", issuer: "Google / Coursera" },
        { name: "IBM Data Science Professional", issuer: "IBM / Coursera" },
        { name: "Microsoft Certified: Data Analyst Associate", issuer: "Microsoft" }
    ],
    "Marketing Specialist": [
        { name: "Google Ads Certification", issuer: "Google" },
        { name: "HubSpot Inbound Marketing", issuer: "HubSpot Academy" },
        { name: "Facebook Blueprint Certification", issuer: "Meta" }
    ],
    "Sales Executive": [
        { name: "Salesforce Certified Administrator", issuer: "Salesforce" },
        { name: "HubSpot Sales Certification", issuer: "HubSpot Academy" },
        { name: "Certified Professional Sales Person", issuer: "NASP" }
    ],
    "HR Generalist": [
        { name: "SHRM-CP", issuer: "SHRM" },
        { name: "PHR - Professional in Human Resources", issuer: "HRCI" },
        { name: "Talent Acquisition Specialty", issuer: "SHRM" }
    ],
    "Customer Support Lead": [
        { name: "HDI Support Center Analyst", issuer: "HDI" },
        { name: "Zendesk Support Administrator", issuer: "Zendesk" },
        { name: "ITIL Foundation", issuer: "Axelos" }
    ]
};

const PROJECTS_BY_POSITION = {
    "Frontend Developer": [
        { title: "E-Commerce Product Dashboard", desc: "Built a responsive dashboard with real-time product analytics using React and Chart.js.", techs: ["React", "Chart.js", "Tailwind CSS"] },
        { title: "Personal Portfolio Website", desc: "Designed and developed a modern portfolio site with smooth animations and dark mode.", techs: ["Next.js", "Framer Motion", "CSS Modules"] },
        { title: "Weather Forecast App", desc: "A responsive weather app consuming OpenWeatherMap API with geolocation support.", techs: ["React", "TypeScript", "Axios"] }
    ],
    "Backend Developer": [
        { title: "REST API for Inventory Management", desc: "Built a scalable REST API with role-based access control and rate limiting.", techs: ["Node.js", "Express", "PostgreSQL", "JWT"] },
        { title: "Event-Driven Notification Service", desc: "Microservice handling email and SMS notifications via message queues.", techs: ["Node.js", "RabbitMQ", "Redis"] },
        { title: "File Upload Microservice", desc: "Cloud-native file storage service with S3 integration and virus scanning.", techs: ["Python", "FastAPI", "AWS S3"] }
    ],
    "Fullstack Engineer": [
        { title: "Task Management Platform", desc: "Full-stack Kanban board with real-time collaboration and user authentication.", techs: ["React", "Node.js", "Socket.io", "MongoDB"] },
        { title: "Social Media Analytics Tool", desc: "Dashboard aggregating social media metrics across multiple platforms.", techs: ["Next.js", "PostgreSQL", "Chart.js", "OAuth"] },
        { title: "Real-Time Chat Application", desc: "WebSocket-based messaging platform with file sharing and typing indicators.", techs: ["React", "Express", "Socket.io", "Redis"] }
    ],
    "UI/UX Designer": [
        { title: "Mobile Banking App Redesign", desc: "Complete UX overhaul of a mobile banking app improving task completion rate by 40%.", techs: ["Figma", "Prototyping", "User Testing"] },
        { title: "Design System for SaaS Platform", desc: "Created a comprehensive design system with 50+ reusable components.", techs: ["Figma", "Storybook", "Design Tokens"] },
        { title: "Health & Wellness App", desc: "Designed an intuitive health tracking app focused on accessibility and inclusiveness.", techs: ["Adobe XD", "User Research", "Wireframing"] }
    ],
    "DevOps Engineer": [
        { title: "CI/CD Pipeline for Microservices", desc: "Automated build, test and deploy pipeline for a 12-service architecture.", techs: ["Jenkins", "Docker", "Kubernetes", "AWS"] },
        { title: "Infrastructure as Code Setup", desc: "Terraform-managed AWS infrastructure with multi-region failover.", techs: ["Terraform", "AWS", "CloudWatch"] },
        { title: "Monitoring & Alerting Stack", desc: "Centralized logging and monitoring with custom dashboards and alerts.", techs: ["Prometheus", "Grafana", "ELK Stack"] }
    ],
    "QA Engineer": [
        { title: "Automated Regression Test Suite", desc: "End-to-end test framework covering 200+ test cases with parallel execution.", techs: ["Selenium", "TestNG", "Java", "Jenkins"] },
        { title: "API Test Automation Framework", desc: "REST API testing framework with data-driven tests and CI integration.", techs: ["Postman", "Newman", "JavaScript"] },
        { title: "Performance Testing Dashboard", desc: "Load testing setup with real-time performance metrics visualization.", techs: ["JMeter", "Grafana", "InfluxDB"] }
    ],
    "Product Manager": [
        { title: "Product Feature Prioritization Framework", desc: "Built a scoring model to prioritize features based on impact, effort, and strategy alignment.", techs: ["Notion", "JIRA", "SQL"] },
        { title: "Customer Journey Mapping Tool", desc: "Interactive tool for visualizing and optimizing customer experience touchpoints.", techs: ["Miro", "Google Analytics", "Mixpanel"] }
    ],
    "Business Analyst": [
        { title: "Sales Performance Dashboard", desc: "Interactive Tableau dashboard tracking KPIs across 5 regional sales teams.", techs: ["Tableau", "SQL", "Excel"] },
        { title: "Process Optimization Study", desc: "Analyzed and redesigned order fulfillment workflow reducing cycle time by 30%.", techs: ["Visio", "SQL", "PowerPoint"] }
    ],
    "Data Analyst": [
        { title: "Customer Churn Prediction Model", desc: "Machine learning model predicting customer churn with 85% accuracy.", techs: ["Python", "Scikit-learn", "Pandas", "Jupyter"] },
        { title: "Revenue Analytics Dashboard", desc: "Real-time revenue tracking dashboard with drill-down by product and region.", techs: ["Tableau", "SQL", "Python"] }
    ],
    "Marketing Specialist": [
        { title: "SEO Optimization Campaign", desc: "Led SEO overhaul resulting in 150% organic traffic increase in 6 months.", techs: ["Google Analytics", "SEMrush", "WordPress"] },
        { title: "Email Marketing Automation", desc: "Designed automated email workflows increasing conversion rate by 25%.", techs: ["Mailchimp", "HubSpot", "A/B Testing"] }
    ],
    "Sales Executive": [
        { title: "CRM Implementation Project", desc: "Led Salesforce CRM rollout for a team of 30 sales reps across 3 regions.", techs: ["Salesforce", "Excel", "Training"] },
        { title: "Lead Scoring Model", desc: "Developed a lead scoring system improving qualified lead conversion by 35%.", techs: ["Salesforce", "Excel", "SQL"] }
    ],
    "HR Generalist": [
        { title: "Employee Onboarding Portal", desc: "Designed a digital onboarding workflow reducing time-to-productivity by 40%.", techs: ["HRIS", "Google Forms", "Notion"] },
        { title: "Diversity & Inclusion Initiative", desc: "Launched a company-wide D&I program with measurable hiring targets.", techs: ["Survey Tools", "Excel", "Presentation"] }
    ],
    "Customer Support Lead": [
        { title: "Knowledge Base Development", desc: "Created a self-service knowledge base reducing ticket volume by 30%.", techs: ["Zendesk", "Confluence", "Analytics"] },
        { title: "Support Team SLA Dashboard", desc: "Built real-time SLA tracking dashboard improving response times by 25%.", techs: ["Freshdesk", "Google Sheets", "Data Studio"] }
    ]
};

const JOB_TITLES_BY_INDUSTRY = {
    "Manufacturing": [
        "Production Manager", "Quality Control Inspector", "Plant Engineer", "Supply Chain Analyst",
        "Manufacturing Technician", "Operations Supervisor", "Industrial Designer", "Maintenance Engineer"
    ],
    "Consulting": [
        "Business Consultant", "Strategy Analyst", "Management Consultant", "Project Manager",
        "Senior Associate", "Engagement Manager", "Data Consultant", "Change Management Specialist"
    ],
    "E-commerce": [
        "Software Engineer", "Frontend Developer", "Product Manager", "Data Analyst",
        "UX Designer", "Backend Developer", "DevOps Engineer", "Growth Marketing Manager"
    ],
    "Healthcare": [
        "Healthcare Administrator", "Lab Technician", "Clinical Data Analyst", "Medical Coder",
        "Pharmacy Manager", "Health IT Specialist", "Research Associate", "Quality Assurance Analyst"
    ],
    "Media": [
        "Content Writer", "Video Editor", "Social Media Manager", "Graphic Designer",
        "Digital Marketing Executive", "Copy Editor", "Production Coordinator", "Brand Strategist"
    ],
    "Retail": [
        "Store Manager", "Visual Merchandiser", "Sales Associate", "Inventory Analyst",
        "Category Manager", "Customer Experience Lead", "E-commerce Manager", "Retail Operations Lead"
    ],
    "Finance": [
        "Financial Analyst", "Accounts Manager", "Investment Associate", "Risk Analyst",
        "Tax Consultant", "Portfolio Manager", "Compliance Officer", "Credit Analyst"
    ],
    "IT": [
        "Software Engineer", "Full Stack Developer", "DevOps Engineer", "Data Scientist",
        "Cloud Architect", "QA Lead", "System Administrator", "Technical Support Engineer"
    ],
    "Education": [
        "Academic Coordinator", "Curriculum Developer", "EdTech Product Manager", "Training Specialist",
        "Content Developer", "Student Counsellor", "LMS Administrator", "Education Consultant"
    ],
    "Logistics": [
        "Logistics Coordinator", "Fleet Manager", "Warehouse Supervisor", "Supply Chain Manager",
        "Dispatch Manager", "Route Optimization Analyst", "Operations Executive", "Procurement Officer"
    ],
    "Apparel": [
        "Fashion Designer", "Merchandiser", "Production Coordinator", "Quality Checker",
        "Store Manager", "Visual Merchandiser", "Sourcing Executive", "Pattern Maker"
    ]
};

const JOB_DESCRIPTIONS_GENERIC = [
    "We are looking for a motivated professional to join our growing team. You will work on challenging problems and contribute to our company's success.",
    "Join our dynamic team and help us deliver exceptional results. This role offers growth opportunities and a collaborative work environment.",
    "An exciting opportunity to be part of an innovative organization. You will play a key role in driving our business forward.",
    "We seek a talented individual who is passionate about making an impact. Work with cutting-edge tools and a supportive team."
];

const MUMBAI_BOARDS = ["CBSE", "ICSE", "Maharashtra State Board"];
const MEDIUMS = ["English", "Marathi", "Hindi"];
const DEGREES_BY_DEPT = {
    "Engineering": ["B.Tech", "B.E.", "M.Tech"],
    "Finance": ["B.Com", "M.Com", "BBA", "MBA"],
    "Marketing": ["BBA", "MBA", "B.Com"],
    "Sales": ["BBA", "B.Com", "MBA"],
    "Human Resources": ["BBA", "MBA", "BA"],
    "Operations": ["B.Tech", "BBA", "MBA"],
    "Design": ["B.Des", "BFA", "M.Des"],
    "Product": ["B.Tech", "BBA", "MBA"],
    "Quality Assurance": ["B.Tech", "B.E.", "BCA"],
};
const STREAMS_BY_DEPT = {
    "Engineering": ["Computer Science", "Information Technology", "Electronics", "Mechanical"],
    "Finance": ["Commerce", "Accounting & Finance", "Banking"],
    "Marketing": ["Marketing Management", "Business Administration"],
    "Sales": ["Business Administration", "Commerce"],
    "Human Resources": ["Human Resource Management", "Psychology", "Business Administration"],
    "Operations": ["Operations Management", "Industrial Engineering", "Business Administration"],
    "Design": ["Visual Communication", "Graphic Design", "Industrial Design"],
    "Product": ["Computer Science", "Business Administration", "Information Technology"],
    "Quality Assurance": ["Computer Science", "Information Technology", "Software Engineering"],
};

const MUMBAI_COLLEGES = [
    "IIT Bombay", "VJTI Mumbai", "DJ Sanghvi College of Engineering", "K.J. Somaiya College of Engineering",
    "Thadomal Shahani Engineering College", "SPIT Mumbai", "FR. C. Rodrigues Institute of Technology",
    "Mumbai University", "St. Xavier's College Mumbai", "Jai Hind College", "HR College of Commerce",
    "Narsee Monjee College", "Mithibai College", "Wilson College", "Ruia College",
    "NMIMS Mumbai", "SP Jain School", "Welingkar Institute", "BITS Pilani (Mumbai Campus)",
    "Amity University Mumbai", "Symbiosis (Pune)", "Christ University"
];

const MUMBAI_SCHOOLS = [
    "Delhi Public School, Mumbai", "Ryan International School", "Podar International School",
    "Bombay Scottish School", "Cathedral School Mumbai", "Jamnabai Narsee School",
    "Dhirubhai Ambani International School", "Oberoi International School",
    "Arya Vidya Mandir", "Hiranandani Foundation School", "Balmohan Vidyamandir",
    "St. Mary's School", "Don Bosco High School", "Holy Cross School"
];

const COMPANIES_BY_INDUSTRY = {
    "IT": ["TCS", "Infosys", "Wipro", "HCL Technologies", "Tech Mahindra", "L&T Infotech", "Persistent Systems", "Mphasis"],
    "Finance": ["HDFC Bank", "ICICI Bank", "Kotak Mahindra", "Bajaj Finance", "Axis Bank", "SBI", "Motilal Oswal", "Zerodha"],
    "Manufacturing": ["Tata Steel", "Godrej & Boyce", "Larsen & Toubro", "Mahindra & Mahindra", "Siemens India", "ABB India"],
    "Healthcare": ["Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "Cipla", "Dr. Reddy's", "Sun Pharma", "Biocon"],
    "Education": ["BYJU'S", "Unacademy", "Vedantu", "Simplilearn", "UpGrad", "Great Learning", "Toppr"],
    "E-commerce": ["Flipkart", "Amazon India", "Myntra", "Nykaa", "BigBasket", "Swiggy", "Zomato", "Meesho"],
    "Retail": ["Reliance Retail", "DMart", "Shoppers Stop", "Lifestyle", "Trent (Westside)", "Raymond", "Titan Company"],
    "Apparel": ["Arvind Ltd", "Raymond", "Madura Fashion", "Aditya Birla Fashion", "FabIndia", "W (TCNS)", "Allen Solly"],
    "Logistics": ["Delhivery", "Blue Dart", "DTDC", "Rivigo", "Mahindra Logistics", "Gati", "Ecom Express"],
    "Media": ["Times Group", "NDTV", "Zee Media", "Network 18", "Indian Express", "HT Media", "Viacom18"],
    "Consulting": ["Deloitte India", "EY India", "KPMG India", "PwC India", "McKinsey India", "BCG India", "Accenture"]
};

const ACHIEVEMENT_TYPES = ["AWARD", "EXAM", "ACADEMIC", "CLUB"];

const ACHIEVEMENTS_POOL = {
    "AWARD": [
        { title: "Best Employee of the Quarter", org: "Previous Employer" },
        { title: "Hackathon Winner - 1st Place", org: "TechFest Mumbai" },
        { title: "Innovation Award", org: "National Innovation Summit" },
        { title: "Star Performer Award", org: "Previous Employer" },
        { title: "Outstanding Contribution Award", org: "Industry Conference" }
    ],
    "EXAM": [
        { title: "GATE - CS/IT", org: "IIT" },
        { title: "CAT", org: "IIM" },
        { title: "UGC NET", org: "NTA" },
        { title: "GRE", org: "ETS" },
        { title: "AMCAT", org: "Aspiring Minds" }
    ],
    "ACADEMIC": [
        { title: "Dean's List", org: "University" },
        { title: "University Gold Medalist", org: "Mumbai University" },
        { title: "Merit Scholarship Recipient", org: "College" },
        { title: "Academic Excellence Award", org: "Institute" },
        { title: "Best Project Award", org: "Department" }
    ],
    "CLUB": [
        { title: "President - Tech Club", org: "College" },
        { title: "Core Committee Member - E-Cell", org: "College" },
        { title: "Open Source Contributor", org: "GitHub Community" },
        { title: "Volunteer Lead - NSS", org: "College" },
        { title: "Member - IEEE Student Branch", org: "IEEE" }
    ]
};

const LANGUAGES_POOL = [
    { name: "English", read: "ADVANCED", write: "ADVANCED", speak: "ADVANCED" },
    { name: "Hindi", read: "ADVANCED", write: "INTERMEDIATE", speak: "ADVANCED" },
    { name: "Marathi", read: "INTERMEDIATE", write: "BEGINNER", speak: "ADVANCED" },
    { name: "Gujarati", read: "INTERMEDIATE", write: "BEGINNER", speak: "INTERMEDIATE" },
    { name: "Tamil", read: "INTERMEDIATE", write: "BEGINNER", speak: "INTERMEDIATE" },
    { name: "Telugu", read: "BEGINNER", write: "BEGINNER", speak: "INTERMEDIATE" },
    { name: "Kannada", read: "INTERMEDIATE", write: "BEGINNER", speak: "INTERMEDIATE" },
    { name: "Bengali", read: "BEGINNER", write: "BEGINNER", speak: "INTERMEDIATE" },
];

// ═══════════════════════════════════════════════════════════════
//  MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════

async function seed() {
    const client = await pool.connect();

    try {
        console.log("═══════════════════════════════════════════");
        console.log("  SEEDING ALL REMAINING TABLES");
        console.log("═══════════════════════════════════════════\n");

        // ─── 1. FETCH EXISTING DATA ──────────────────────────────

        console.log("📦 Fetching existing users & profiles...");

        const seekersRes = await client.query(`
            SELECT u.id as user_id, u.username, sp.full_name, sp.position, sp.work_status,
                   sp.current_industry, sp.current_department, sp.total_experience_years,
                   sp.total_experience_months, sp.experience_level, sp.current_location,
                   sp.employment_status, sp.expected_salary_min, sp.expected_salary_max
            FROM users u
            JOIN seeker_profiles sp ON sp.user_id = u.id
            WHERE u.user_role = 'SEEKER'
            ORDER BY u.username
        `);
        const seekers = seekersRes.rows;
        console.log(`  Found ${seekers.length} seekers`);

        const employersRes = await client.query(`
            SELECT u.id as user_id, u.username, ep.company_name, ep.company_industry,
                   ep.company_location, ep.account_type, ep.designation, ep.full_name, ep.company_size
            FROM users u
            JOIN employer_profiles ep ON ep.user_id = u.id
            WHERE u.user_role = 'EMPLOYER'
            ORDER BY u.username
        `);
        const employers = employersRes.rows;
        console.log(`  Found ${employers.length} employers\n`);

        // ─── 2. SEED JOBS ────────────────────────────────────────

        console.log("💼 Seeding JOBS...");
        let jobCount = 0;
        const allJobIds = [];

        for (const emp of employers) {
            // Each employer gets 2-3 jobs
            const numJobs = emp.account_type === "COMPANY" ? randInt(2, 3) : 1;
            const industry = emp.company_industry || "IT";
            const titles = JOB_TITLES_BY_INDUSTRY[industry] || JOB_TITLES_BY_INDUSTRY["IT"];

            for (let j = 0; j < numJobs; j++) {
                const jobTitle = titles[j % titles.length];
                const jobId = uuid();
                allJobIds.push({ id: jobId, employerId: emp.user_id, title: jobTitle, industry });

                const jobType = pick(["ONSITE", "HYBRID", "REMOTE"]);
                const salaryMin = randInt(300000, 1500000);
                const salaryMax = salaryMin + randInt(200000, 800000);
                const monthlyMin = Math.round(salaryMin / 12);
                const monthlyMax = Math.round(salaryMax / 12);
                const expRequired = randInt(0, 8);
                const status = Math.random() < 0.85 ? "OPEN" : pick(["CLOSED", "PAUSED"]);
                const approval = Math.random() < 0.9 ? "APPROVED" : pick(["PENDING", "REJECTED"]);
                const deadline = futureDate(randInt(15, 60));

                // Pick relevant skills for the job
                const relevantPosition = Object.keys(SKILLS_BY_POSITION).find(p =>
                    jobTitle.toLowerCase().includes(p.toLowerCase().split(" ")[0])
                ) || pick(Object.keys(SKILLS_BY_POSITION));
                const reqSkills = (SKILLS_BY_POSITION[relevantPosition] || SKILLS_BY_POSITION["Fullstack Engineer"]).slice(0, randInt(3, 5));

                await client.query(`
                    INSERT INTO jobs (id, employer_id, title, description, type, location,
                        salary_min, salary_max, monthly_salary_min, monthly_salary_max,
                        status, approval_status, experience_level, application_deadline,
                        required_skills, required_languages, overview, responsibilities,
                        requirements, how_to_apply, work_experience_min, work_experience_max,
                        perks_and_benefits, recruiter_name, recruiter_contact,
                        about_company, created_at, updated_at)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28)
                `, [
                    jobId, emp.user_id, jobTitle,
                    pick(JOB_DESCRIPTIONS_GENERIC),
                    jobType, emp.company_location || "Mumbai",
                    salaryMin, salaryMax, monthlyMin, monthlyMax,
                    status, approval, expRequired, deadline,
                    reqSkills,
                    ["English", "Hindi"],
                    [`${emp.company_name} is looking for a talented ${jobTitle} to join our team.`, `This is an exciting opportunity in the ${industry} industry.`],
                    [`Lead and manage ${jobTitle.toLowerCase()} responsibilities`, `Collaborate with cross-functional teams`, `Drive quality and performance improvements`],
                    [`${expRequired}+ years of relevant experience`, `Strong communication skills`, `Bachelor's degree in relevant field`],
                    `Please apply through our career portal with your updated resume.`,
                    expRequired, expRequired + 3,
                    pick([["Health Insurance", "Flexible Hours"], ["WFH Options", "Gym Membership"], ["Stock Options", "Annual Bonus"], ["PF", "Medical Leave"]]),
                    emp.full_name, `+91 ${randInt(9000000000, 9999999999)}`,
                    `${emp.company_name} is a leading player in the ${industry} sector.`,
                    now(), now()
                ]);
                jobCount++;
            }
        }
        console.log(`  ✅ Created ${jobCount} jobs\n`);

        // ─── 3. SEED EDUCATION ───────────────────────────────────

        console.log("🎓 Seeding EDUCATION...");
        let eduCount = 0;

        for (const seeker of seekers) {
            const dept = seeker.current_department || "Engineering";
            const isExperienced = seeker.work_status === "EXPERIENCED";
            const baseYear = isExperienced
                ? 2026 - (seeker.total_experience_years || 0) - 4  // 4 years for degree
                : 2022;

            // Class X
            await client.query(`
                INSERT INTO education (id, user_id, type, board, medium, percentage, institute, start_date, end_date, is_pursuing, created_at, updated_at)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
            `, [uuid(), seeker.user_id, "Class X", pick(MUMBAI_BOARDS), pick(MEDIUMS),
                `${randInt(60, 95)}%`, pick(MUMBAI_SCHOOLS),
                `${baseYear - 6}-06-01`, `${baseYear - 4}-04-01`, false, now(), now()]);
            eduCount++;

            // Class XII
            await client.query(`
                INSERT INTO education (id, user_id, type, board, medium, percentage, institute, stream, start_date, end_date, is_pursuing, created_at, updated_at)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
            `, [uuid(), seeker.user_id, "Class XII", pick(MUMBAI_BOARDS), pick(MEDIUMS),
                `${randInt(55, 92)}%`, pick(MUMBAI_SCHOOLS),
                pick(["Science", "Commerce", "Arts"]),
                `${baseYear - 4}-06-01`, `${baseYear - 2}-04-01`, false, now(), now()]);
            eduCount++;

            // Degree
            const degrees = DEGREES_BY_DEPT[dept] || DEGREES_BY_DEPT["Engineering"];
            const streams = STREAMS_BY_DEPT[dept] || STREAMS_BY_DEPT["Engineering"];
            const degreeEndYear = baseYear;
            const isPursuing = !isExperienced && Math.random() < 0.3;

            await client.query(`
                INSERT INTO education (id, user_id, type, board, percentage, institute, degree, stream, start_date, end_date, is_pursuing, created_at, updated_at)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
            `, [uuid(), seeker.user_id, "Degree", null,
                isPursuing ? null : `${randInt(55, 90)}%`,
                pick(MUMBAI_COLLEGES), pick(degrees), pick(streams),
                `${degreeEndYear - 4}-07-01`,
                isPursuing ? null : `${degreeEndYear}-06-01`,
                isPursuing, now(), now()]);
            eduCount++;
        }
        console.log(`  ✅ Created ${eduCount} education records\n`);

        // ─── 4. SEED EXPERIENCE ──────────────────────────────────

        console.log("💼 Seeding EXPERIENCE...");
        let expCount = 0;

        for (const seeker of seekers) {
            if (seeker.work_status !== "EXPERIENCED") continue;

            const totalYears = seeker.total_experience_years || 1;
            const industry = seeker.current_industry || "IT";
            const companies = COMPANIES_BY_INDUSTRY[industry] || COMPANIES_BY_INDUSTRY["IT"];
            const position = seeker.position || "Software Engineer";
            const numEntries = Math.min(randInt(2, 3), totalYears);
            const isCurrentlyEmployed = seeker.employment_status === "EMPLOYED";

            let remainingYears = totalYears;

            for (let e = 0; e < numEntries; e++) {
                const isLast = e === numEntries - 1;
                const duration = isLast ? remainingYears : Math.max(1, Math.floor(remainingYears / 2));
                remainingYears -= duration;

                const endYear = 2026 - (isLast ? 0 : remainingYears);
                const startYear = endYear - duration;
                const isCurrent = isLast && isCurrentlyEmployed;
                const empType = e === 0 && totalYears > 3 ? pick(["INTERNSHIP", "FULL_TIME"]) : "FULL_TIME";

                const designation = e === 0 ? `Junior ${position}` : (isLast ? position : `Associate ${position}`);

                await client.query(`
                    INSERT INTO experience (id, user_id, company_name, designation, employment_type,
                        start_date, end_date, is_current, description, key_skills, created_at, updated_at)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
                `, [uuid(), seeker.user_id, pick(companies), designation, empType,
                    `${startYear}-${String(randInt(1, 12)).padStart(2, '0')}-01`,
                    isCurrent ? null : `${endYear}-${String(randInt(1, 12)).padStart(2, '0')}-01`,
                    isCurrent,
                    `Worked as ${designation} contributing to ${industry.toLowerCase()} projects and team deliverables.`,
                    (SKILLS_BY_POSITION[position] || SKILLS_BY_POSITION["Fullstack Engineer"]).slice(0, 3).join(", "),
                    now(), now()]);
                expCount++;
            }
        }
        console.log(`  ✅ Created ${expCount} experience records\n`);

        // ─── 5. SEED SKILLS ─────────────────────────────────────

        console.log("🛠️  Seeding SKILLS...");
        let skillCount = 0;

        for (const seeker of seekers) {
            const position = seeker.position || "Fullstack Engineer";
            const skills = SKILLS_BY_POSITION[position] || SKILLS_BY_POSITION["Fullstack Engineer"];
            const numSkills = randInt(4, 6);
            const isExp = seeker.work_status === "EXPERIENCED";

            for (let s = 0; s < Math.min(numSkills, skills.length); s++) {
                const prof = isExp
                    ? (s < 2 ? "ADVANCED" : pick(["INTERMEDIATE", "ADVANCED"]))
                    : (s < 1 ? "INTERMEDIATE" : pick(["BEGINNER", "INTERMEDIATE"]));

                await client.query(`
                    INSERT INTO skills (id, user_id, skill_name, proficiency, created_at, updated_at)
                    VALUES ($1,$2,$3,$4,$5,$6)
                `, [uuid(), seeker.user_id, skills[s], prof, now(), now()]);
                skillCount++;
            }
        }
        console.log(`  ✅ Created ${skillCount} skills\n`);

        // ─── 6. SEED CERTIFICATIONS ──────────────────────────────

        console.log("📜 Seeding CERTIFICATIONS...");
        let certCount = 0;

        for (const seeker of seekers) {
            const position = seeker.position || "Fullstack Engineer";
            const certs = CERTS_BY_POSITION[position] || CERTS_BY_POSITION["Fullstack Engineer"];
            const numCerts = randInt(1, 2);

            for (let c = 0; c < Math.min(numCerts, certs.length); c++) {
                const cert = certs[c];
                const issueYear = randInt(2022, 2025);
                const issueMonth = randInt(1, 12);

                await client.query(`
                    INSERT INTO certifications (id, user_id, certification_name, issuer, issue_date, expiry_date, description, created_at, updated_at)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
                `, [uuid(), seeker.user_id, cert.name, cert.issuer,
                    `${issueYear}-${String(issueMonth).padStart(2, '0')}-15`,
                    Math.random() < 0.4 ? `${issueYear + 3}-${String(issueMonth).padStart(2, '0')}-15` : null,
                    `Professional certification in ${cert.name}.`,
                    now(), now()]);
                certCount++;
            }
        }
        console.log(`  ✅ Created ${certCount} certifications\n`);

        // ─── 7. SEED LANGUAGES ───────────────────────────────────

        console.log("🌐 Seeding LANGUAGES...");
        let langCount = 0;

        for (const seeker of seekers) {
            // Everyone gets English + Hindi
            for (let l = 0; l < 2; l++) {
                const lang = LANGUAGES_POOL[l];
                await client.query(`
                    INSERT INTO languages (id, user_id, language_name, read, write, speak, created_at, updated_at)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                `, [uuid(), seeker.user_id, lang.name, lang.read, lang.write, lang.speak, now(), now()]);
                langCount++;
            }
            // ~60% get a third language
            if (Math.random() < 0.6) {
                const lang = LANGUAGES_POOL[randInt(2, LANGUAGES_POOL.length - 1)];
                await client.query(`
                    INSERT INTO languages (id, user_id, language_name, read, write, speak, created_at, updated_at)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                `, [uuid(), seeker.user_id, lang.name, lang.read, lang.write, lang.speak, now(), now()]);
                langCount++;
            }
        }
        console.log(`  ✅ Created ${langCount} language records\n`);

        // ─── 8. SEED PROJECTS ────────────────────────────────────

        console.log("📂 Seeding PROJECTS...");
        let projCount = 0;

        for (const seeker of seekers) {
            const position = seeker.position || "Fullstack Engineer";
            const projects = PROJECTS_BY_POSITION[position] || PROJECTS_BY_POSITION["Fullstack Engineer"];
            const numProjs = randInt(1, 2);

            for (let p = 0; p < Math.min(numProjs, projects.length); p++) {
                const proj = projects[p];
                const startYear = randInt(2022, 2025);

                await client.query(`
                    INSERT INTO projects (id, user_id, title, description, technologies, url, start_date, end_date, created_at, updated_at)
                    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
                `, [uuid(), seeker.user_id, proj.title, proj.desc,
                    proj.techs,
                    Math.random() < 0.5 ? `https://github.com/${seeker.username}/${proj.title.toLowerCase().replace(/\s+/g, '-')}` : null,
                    `${startYear}-${String(randInt(1, 6)).padStart(2, '0')}-01`,
                    `${startYear}-${String(randInt(7, 12)).padStart(2, '0')}-01`,
                    now(), now()]);
                projCount++;
            }
        }
        console.log(`  ✅ Created ${projCount} projects\n`);

        // ─── 9. SEED ACHIEVEMENTS ────────────────────────────────

        console.log("🏆 Seeding ACHIEVEMENTS...");
        let achieveCount = 0;

        for (const seeker of seekers) {
            const type = pick(ACHIEVEMENT_TYPES);
            const pool = ACHIEVEMENTS_POOL[type];
            const ach = pick(pool);

            await client.query(`
                INSERT INTO achievements (id, user_id, type, title, organization, description, start_date, created_at, updated_at)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
            `, [uuid(), seeker.user_id, type, ach.title, ach.org,
                `${ach.title} - Recognized for outstanding contribution.`,
                `${randInt(2020, 2025)}-${String(randInt(1, 12)).padStart(2, '0')}-01`,
                now(), now()]);
            achieveCount++;
        }
        console.log(`  ✅ Created ${achieveCount} achievements\n`);

        // ─── 10. SEED APPLICATIONS ───────────────────────────────

        console.log("📝 Seeding APPLICATIONS...");
        let appCount = 0;

        // Get only APPROVED + OPEN jobs for realistic applications
        const openJobsRes = await client.query(`
            SELECT id, employer_id, title FROM jobs WHERE approval_status = 'APPROVED' AND status = 'OPEN' LIMIT 200
        `);
        const openJobs = openJobsRes.rows;

        if (openJobs.length === 0) {
            console.log("  ⚠️  No open jobs found, skipping applications");
        } else {
            const statuses = ["PENDING", "PENDING", "PENDING", "PENDING",  // 40%
                "IN_REVIEW", "IN_REVIEW",                                    // 15%
                "SHORTLISTED", "SHORTLISTED",                                // 15%
                "INTERVIEW",                                                 // 10%
                "ACCEPTED",                                                  // 10%
                "REJECTED"];                                                  // 10%

            for (const seeker of seekers) {
                // Each seeker applies to 2 random jobs
                const numApps = randInt(1, 3);
                const selectedJobs = [];

                for (let a = 0; a < numApps; a++) {
                    let job;
                    let attempts = 0;
                    do {
                        job = openJobs[randInt(0, openJobs.length - 1)];
                        attempts++;
                    } while (selectedJobs.includes(job.id) && attempts < 10);

                    if (selectedJobs.includes(job.id)) continue;
                    selectedJobs.push(job.id);

                    // Don't let seekers apply to their own jobs (shouldn't happen but safety check)
                    if (job.employer_id === seeker.user_id) continue;

                    await client.query(`
                        INSERT INTO applications (id, applicant_id, job_id, application_status,
                            resume_url, cover_letter_url, created_at, updated_at)
                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                    `, [uuid(), seeker.user_id, job.id, pick(statuses),
                        `https://storage.example.com/resumes/${seeker.username}-resume.pdf`,
                        `https://storage.example.com/covers/${seeker.username}-cover.pdf`,
                        now(), now()]);
                    appCount++;
                }
            }
        }
        console.log(`  ✅ Created ${appCount} applications\n`);

        // ─── FINAL SUMMARY ───────────────────────────────────────

        console.log("═══════════════════════════════════════════");
        console.log("  ✅ SEEDING COMPLETE!");
        console.log("═══════════════════════════════════════════");
        console.log(`  Jobs:           ${jobCount}`);
        console.log(`  Education:      ${eduCount}`);
        console.log(`  Experience:     ${expCount}`);
        console.log(`  Skills:         ${skillCount}`);
        console.log(`  Certifications: ${certCount}`);
        console.log(`  Languages:      ${langCount}`);
        console.log(`  Projects:       ${projCount}`);
        console.log(`  Achievements:   ${achieveCount}`);
        console.log(`  Applications:   ${appCount}`);
        console.log(`  ─────────────────────────────────────────`);
        console.log(`  TOTAL:          ${jobCount + eduCount + expCount + skillCount + certCount + langCount + projCount + achieveCount + appCount}`);

    } catch (err) {
        console.error("❌ SEED ERROR:", err.message);
        console.error(err.stack);
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

seed().then(() => process.exit(0)).catch(() => process.exit(1));
