// Suggestion data for smart inputs
export interface Suggestion {
    value: string;
    label: string;
    category?: string;
}

// Popular skills with related suggestions
export const SKILLS_SUGGESTIONS: Record<string, string[]> = {
    // Frontend
    react: ['JavaScript', 'TypeScript', 'Next.js', 'Redux', 'Tailwind CSS', 'HTML', 'CSS'],
    angular: ['TypeScript', 'RxJS', 'NgRx', 'HTML', 'CSS', 'JavaScript'],
    vue: ['JavaScript', 'TypeScript', 'Vuex', 'Nuxt.js', 'HTML', 'CSS'],

    // Backend
    'node.js': ['Express.js', 'MongoDB', 'PostgreSQL', 'REST API', 'GraphQL'],
    python: ['Django', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'Machine Learning'],
    java: ['Spring Boot', 'Hibernate', 'Maven', 'MySQL', 'REST API'],

    // Data Science
    'machine learning': ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy'],
    'data science': ['Python', 'SQL', 'Pandas', 'NumPy', 'Matplotlib', 'Statistics'],

    // DevOps
    docker: ['Kubernetes', 'CI/CD', 'Jenkins', 'AWS', 'Linux'],
    kubernetes: ['Docker', 'Helm', 'AWS', 'Azure', 'CI/CD'],
    aws: ['EC2', 'S3', 'Lambda', 'Docker', 'Terraform'],
};

// Popular courses by degree type
export const COURSE_SUGGESTIONS: Record<string, string[]> = {
    bachelors: [
        'Computer Science',
        'Information Technology',
        'Electronics Engineering',
        'Mechanical Engineering',
        'Business Administration',
        'Commerce',
        'Arts',
    ],
    masters: [
        'Computer Applications (MCA)',
        'Business Administration (MBA)',
        'Technology (M.Tech)',
        'Science (M.Sc)',
    ],
};

// Popular specializations by course
export const SPECIALIZATION_SUGGESTIONS: Record<string, string[]> = {
    'computer science': [
        'Artificial Intelligence & Machine Learning',
        'Data Science',
        'Cybersecurity',
        'Cloud Computing',
        'Web Development',
        'Mobile App Development',
    ],
    'information technology': [
        'Software Engineering',
        'Network Security',
        'Database Management',
        'Cloud Computing',
    ],
};

// Popular job titles by skill domain
export const JOB_TITLE_SUGGESTIONS: Record<string, string[]> = {
    frontend: [
        'Frontend Developer',
        'React Developer',
        'UI Developer',
        'Web Developer',
    ],
    backend: [
        'Backend Developer',
        'Node.js Developer',
        'Python Developer',
        'Java Developer',
    ],
    fullstack: [
        'Full Stack Developer',
        'MERN Stack Developer',
        'Software Engineer',
    ],
    data: [
        'Data Scientist',
        'Data Analyst',
        'ML Engineer',
        'AI Engineer',
    ],
};

// Popular companies by industry
export const COMPANY_SUGGESTIONS: Record<string, string[]> = {
    'it & software': [
        'TCS',
        'Infosys',
        'Wipro',
        'Google',
        'Microsoft',
        'Amazon',
        'Meta',
        'Adobe',
    ],
    startup: [
        'Swiggy',
        'Zomato',
        'Paytm',
        'Razorpay',
        'CRED',
        'Meesho',
    ],
};

// Industry suggestions
export const INDUSTRIES = [
    'IT & Software',
    'Finance & Banking',
    'E-commerce',
    'Healthcare',
    'Education',
    'Consulting',
    'Marketing & Advertising',
    'Manufacturing',
    'Retail',
    'Real Estate',
];

// City suggestions for India
export const CITIES = [
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Pune',
    'Kolkata',
    'Ahmedabad',
    'Noida',
    'Gurgaon',
    'Navi Mumbai',
    'Thane',
];

// Nearby cities mapping
export const NEARBY_CITIES: Record<string, string[]> = {
    mumbai: ['Navi Mumbai', 'Thane', 'Pune'],
    delhi: ['Noida', 'Gurgaon', 'Faridabad'],
    bangalore: ['Mysore', 'Mangalore'],
    pune: ['Mumbai', 'Navi Mumbai'],
};

// Common responsibilities by job role
export const RESPONSIBILITY_TEMPLATES: Record<string, string[]> = {
    developer: [
        'Developed and maintained web applications using modern frameworks',
        'Collaborated with cross-functional teams to define and implement features',
        'Wrote clean, maintainable, and well-documented code',
        'Participated in code reviews and improved code quality',
    ],
    intern: [
        'Assisted in developing features for the product',
        'Learned and applied new technologies',
        'Contributed to team meetings and brainstorming sessions',
    ],
};

// Helper function to get skill suggestions
export function getSkillSuggestions(skill: string): string[] {
    const skillLower = skill.toLowerCase();
    return SKILLS_SUGGESTIONS[skillLower] || [];
}

// Helper function to get nearby cities
export function getNearbyCities(city: string): string[] {
    const cityLower = city.toLowerCase();
    return NEARBY_CITIES[cityLower] || [];
}

// Helper function to suggest job title based on skills
export function suggestJobTitles(skills: string[]): string[] {
    const skillsLower = skills.map(s => s.toLowerCase());

    if (skillsLower.some(s => ['react', 'angular', 'vue'].includes(s))) {
        return JOB_TITLE_SUGGESTIONS.frontend;
    }
    if (skillsLower.some(s => ['node.js', 'python', 'java'].includes(s))) {
        return JOB_TITLE_SUGGESTIONS.backend;
    }
    if (skillsLower.some(s => s.includes('machine learning') || s.includes('data'))) {
        return JOB_TITLE_SUGGESTIONS.data;
    }

    return JOB_TITLE_SUGGESTIONS.fullstack;
}
