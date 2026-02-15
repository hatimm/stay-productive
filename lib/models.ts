// Enhanced Personal Productivity App Models

// Task Categories
export type TaskCategory = 'DevOps' | 'Project' | 'Freelancing' | 'OnlinePresence' | 'AINews' | 'Lead' | 'Portfolio' | 'Reflection';
export type Priority = 'high' | 'medium' | 'low';

// Post Idea Categories
export type PostCategory = 'DevOps' | 'AI' | 'Freelancing' | 'SaaS' | 'Automation' | 'General';
export type PostStatus = 'idea' | 'draft' | 'published';

// Lead Status
export type LeadStatus = 'new' | 'contacted' | 'proposal_sent' | 'follow_up' | 'closed' | 'won';

// Project Types
export type ProjectType = 'SaaS' | 'Automation' | 'DevOps Lab' | 'Extension' | 'VibeCode' | 'Portfolio' | 'Other';
export type ProjectStatus = 'Idea' | 'In Progress' | 'Deployment Ready' | 'Published' | 'Archived';

// Note Types
export type NoteType = 'AppIdea' | 'SocialMedia' | 'DevOps' | 'Career' | 'Improvement' | 'AiAutomation' | 'General';

// Account Types
export type AccountType = 'Social' | 'Professional' | 'JobBoard';

export type SocialPlatform = 'X' | 'Skool' | 'LinkedIn' | 'Reddit' | 'Medium' | 'Blog' | 'Other';
export type ProfessionalPlatform =
    | 'Upwork' | 'Freelancer' | 'Fiverr' | 'Guru' | 'PeoplePerHour'
    | 'Malt' | 'Codeur.com' | 'ComeUp' | 'Mostaql' | 'Khamsat' | 'Ureed'
    | 'Other';
export type JobBoardPlatform =
    | 'RemoteOK' | 'We Work Remotely' | 'FlexJobs' | 'Jobspresso' | 'Remotive'
    | 'Wellfound' | 'Indeed' | 'Glassdoor' | 'Jobbers.ma' | 'Dreamjob.ma'
    | 'Mawahib.ma' | 'Emploi-public.ma' | 'WhatJobs' | 'Jooble' | 'LinkedIn Jobs'
    | 'Welcome to the Jungle' | 'Bayt' | 'GulfTalent' | 'Naukrigulf'
    | 'HelloWork' | 'Cadremploi' | 'ChooseYourBoss'
    | 'Other';

export type JobBoardCategory = 'Global' | 'Remote' | 'Morocco' | 'French' | 'MENA';
export type ProfessionalCategory = 'Global' | 'French' | 'Arabic';

export const NOTE_TYPE_ICONS: Record<NoteType, string> = {
    AppIdea: '💡',
    SocialMedia: '📱',
    DevOps: '⚙️',
    Career: '📈',
    Improvement: '🛠️',
    AiAutomation: '🤖',
    General: '📝'
};

// Main Interfaces
export interface Task {
    id: string;
    title: string;
    description?: string;
    category: TaskCategory;
    completed: boolean;
    date: string; // YYYY-MM-DD
    isSubTask?: boolean;
    priority: Priority;
    noteCount?: number; // Computed
    linkedPostIdeas?: string[];
    linkedProjects?: string[];
}

export interface Note {
    id: string;
    taskId?: string; // Optional if not linked to a specific task
    type: NoteType;
    content: string;
    timestamp?: string; // Video timestamp or event time
    videoName?: string; // For DevOps notes
    createdAt: string;
}

export interface PostIdea {
    id: string;
    title: string;
    category: PostCategory;
    content?: string;
    scheduledDate?: string;
    status: PostStatus;
    linkedTaskId?: string;
    createdAt: string;
}

export interface Lead {
    id: string;
    name: string;
    source: string;
    niche?: string;
    status: LeadStatus;
    proposalSent: boolean;
    followUpDate?: string;
    notes?: string;
    createdAt: string;
}

export interface Project {
    id: string;
    name: string;
    type: ProjectType;
    status: ProjectStatus;
    github_url?: string;
    deployment_url?: string;
    description?: string;
    monetization_plan?: string;
    commit_streak: number;
    last_commit_date?: string; // YYYY-MM-DD
    checklist?: Array<{ id: string; label: string; completed: boolean }>;
    createdAt: string;
    updatedAt: string;
}

// AI Toolbox Models
export type ToolCategory = 'Agent' | 'Coding' | 'Automation' | 'Design' | 'Writing' | 'DevOps' | 'Other';
export type ToolPricing = 'Free' | 'Freemium' | 'Paid';
export type ToolStatus = 'Discovered' | 'Testing' | 'Reviewed' | 'Published';

export interface AITool {
    id: string;
    name: string;
    official_url: string;
    category: ToolCategory;
    pricing: ToolPricing;
    rating: number; // 1-5
    status: ToolStatus;
    tested: boolean;
    review_written: boolean;
    blog_published: boolean;
    social_post_published: boolean;
    notes?: string;
    createdAt: string;
}

// AI Intelligence Models
export interface IntelligenceSource {
    id: string;
    name: string;
    url: string;
    description: string;
    checkedThisWeek: boolean;
    lastResetDate: string; // To track weekly reset
}

export interface CreatorRadar {
    id: string;
    name: string;
    platform: 'X' | 'YouTube' | 'LinkedIn' | 'Blog';
    topic: string;
    status: 'Active' | 'Paused';
    notes?: string;
    lastReviewedDate?: string;
}

export type DiscoveryCategory = 'Tool' | 'Research' | 'Trend';
export type DiscoveryAction = 'Test Tool' | 'Write Blog' | 'Make Post' | 'Monitor' | 'Ignore';

export interface DiscoveryLog {
    id: string;
    title: string;
    link: string;
    summary: string;
    category: DiscoveryCategory;
    actionRequired: DiscoveryAction;
    createdAt: string;
}

export interface WeeklyTrend {
    id?: string;
    weekNumber: number;
    year: number;
    synthesis: string;
    topTools?: string[];
    actionItems?: string[];
    updatedAt?: string;
}

export interface Account {
    id: string;
    name: string;
    type: AccountType;
    platform?: SocialPlatform | ProfessionalPlatform | JobBoardPlatform;
    jobBoardCategory?: JobBoardCategory;
    professionalCategory?: ProfessionalCategory;
    username: string;
    url: string;
    email?: string;
    loginPassword?: string;
    credentialHint?: string;
    notes?: string;
    postCount?: number;
    proposalCount?: number;
    applicationCount?: number;
    createdAt: string;
}

// Document Vault Models
export type DocumentType = 'CV' | 'CoverLetter' | 'Diploma' | 'Certificate';
export type DocumentLanguage = 'English' | 'French (FR)' | 'French (CA)' | 'French' | 'General' | 'N/A';

export interface AppDocument {
    id: string;
    name: string;
    type: DocumentType;
    language: DocumentLanguage;
    fileContent: string; // Base64 or placeholder
    fileName: string;
    fileSize?: number;
    updatedAt: string;
}

export interface Video {
    id: string;
    title: string;
    url: string;
    duration: number; // total minutes
    category: string;
    order: number;
}

export interface VideoProgress {
    videoId: string;
    minutesWatched: number;
    completed: boolean;
    lastWatched: string;
}

export const DEVOPS_LEARNING_PATH: Video[] = [
    { id: 'linux_fcc_labs', title: 'Linux Crash Course for Beginners with Labs (freecodecamp.org)', url: 'https://www.youtube.com/watch?v=6WatcfENsOU', duration: 141, category: 'Linux', order: 1 },
    { id: 'networking_comptia', title: 'CompTIA Network+ N10-009 Full Certification Course (PowerCert Animated Videos)', url: 'https://www.youtube.com/watch?v=CY4hn70K3r8', duration: 257, category: 'Networking', order: 2 },
    { id: 'git_fcc_2026', title: 'Git & GitHub Crash Course for Beginners [2026] (freecodecamp.org)', url: 'https://www.youtube.com/watch?v=mAFoROnOfHs', duration: 81, category: 'Git', order: 3 },
    { id: 'bash_fcc_tut', title: 'Bash Scripting Tutorial for Beginners (freecodecamp.org)', url: 'https://www.youtube.com/watch?v=tK9Oc6AEnR4', duration: 48, category: 'Bash', order: 4 },
    { id: 'docker_fcc_full', title: 'Docker Tutorial for Beginners - Full DevOps Course (freecodecamp.org)', url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo', duration: 130, category: 'Docker', order: 5 },
    { id: 'cicd_nana_basic', title: 'GitHub Actions Tutorial - Concepts & Pipeline (TechWorld with Nana)', url: 'https://www.youtube.com/watch?v=R8_veQiYBjI', duration: 33, category: 'CI/CD', order: 6 },
    { id: 'aws_fcc_clf02', title: 'AWS Certified Cloud Practitioner (CLF-C02) - Pass Exam (freecodecamp.org)', url: 'https://www.youtube.com/watch?v=NhDYbskXRgc', duration: 857, category: 'AWS', order: 7 },
    { id: 'terraform_fcc_dev', title: 'Learn Terraform (and AWS) - Full Beginners Course (freecodecamp.org)', url: 'https://www.youtube.com/watch?v=iRaai1IBlB0', duration: 99, category: 'Terraform', order: 8 },
    { id: 'k8s_fcc_cka', title: 'Kubernetes Course – CKA Exam Prep (freecodecamp.org)', url: 'https://www.youtube.com/watch?v=Fr9GqFwl6NM', duration: 124, category: 'Kubernetes', order: 9 },
    { id: 'monitoring_vikas', title: 'Master Grafana & Prometheus Fast! Crash Course (Vikas Jha)', url: 'https://www.youtube.com/watch?v=hePmCMmekmo', duration: 100, category: 'Monitoring', order: 10 },
];

// Weekly Template with detailed tasks
export const WEEKLY_TEMPLATE: Record<string, Array<{ title: string; description: string; category: TaskCategory; priority: Priority }>> = {
    Monday: [
        {
            title: 'DevOps video 25-40 min + practice + notes',
            description: 'Watch a focused DevOps tutorial, replicate the steps in your lab, and take notes on key commands or pitfalls.',
            category: 'DevOps',
            priority: 'high'
        },
        {
            title: 'AI news scan 15-20 min → add to directory → draft post ideas',
            description: 'Quickly check feeds for new AI tools or agentic workflow updates. Add interesting ones to your directory and think of content ideas.',
            category: 'AINews',
            priority: 'high'
        },
        {
            title: 'Plan main project/automation focus for the week',
            description: 'Define the specific n8n automation or SaaS feature you will complete by Sunday. Set clear milestones.',
            category: 'Project',
            priority: 'medium'
        },
        {
            title: 'Review post ideas → schedule posts for week',
            description: 'Look at your idea backlog. Schedule at least 3 posts across X, LinkedIn, or Medium for the upcoming days.',
            category: 'OnlinePresence',
            priority: 'medium'
        },
        {
            title: 'X/Reddit engagement (2-3 replies)',
            description: 'Reply thoughtfully to current discussions in the DevOps, AI, or SaaS communities to build presence.',
            category: 'OnlinePresence',
            priority: 'low'
        }
    ],
    Tuesday: [
        {
            title: 'Project work (n8n / SaaS) 1-2h',
            description: 'Deep work session on your primary project. Focus on logic building or UI implementation.',
            category: 'Project',
            priority: 'high'
        },
        {
            title: 'Push updates to GitHub',
            description: 'Commit your changes with clear messages. Maintain your streak and version history.',
            category: 'Project',
            priority: 'high'
        },
        {
            title: 'Draft X/Medium post from project progress',
            description: 'Share a screenshot or a lesson learned from today\'s build. Real-time building attracts more interest.',
            category: 'OnlinePresence',
            priority: 'medium'
        },
        {
            title: 'AI tool test → notes/mini review',
            description: 'Pick one tool from your scans. Test it for 10 minutes and write a quick pros/cons note.',
            category: 'AINews',
            priority: 'low'
        },
        {
            title: 'X/Reddit engagement (2-3 replies)',
            description: 'Provide value in comment sections. Help people solve problems related to automation or DevOps.',
            category: 'OnlinePresence',
            priority: 'low'
        }
    ],
    Wednesday: [
        {
            title: 'DevOps video 25-40 min + practice + notes',
            description: 'Continue your learning path. Focus on practical implementation of infrastructure as code or CI/CD.',
            category: 'DevOps',
            priority: 'high'
        },
        {
            title: 'Run lead collection automation + manual leads',
            description: 'Trigger your lead scrapers and spend 15 minutes manually finding high-quality freelance leads.',
            category: 'Lead',
            priority: 'high'
        },
        {
            title: 'Send 3-5 proposals',
            description: 'Write personalized proposals for the leads found. Focus on showcasing your automation expertise.',
            category: 'Freelancing',
            priority: 'high'
        },
        {
            title: 'Engage online: reply 2-3 X/Reddit posts',
            description: 'Maintain consistency in engagement. Look for people asking for automation or freelance help.',
            category: 'OnlinePresence',
            priority: 'medium'
        }
    ],
    Thursday: [
        {
            title: 'Continue project (n8n / SaaS)',
            description: 'Keep the momentum. Fix bugs or start the next sub-feature planned on Monday.',
            category: 'Project',
            priority: 'high'
        },
        {
            title: 'GitHub push',
            description: 'Daily commit. Ensure your repo reflects today\'s progress.',
            category: 'Project',
            priority: 'high'
        },
        {
            title: 'Draft project-based post',
            description: 'Create a thread or post about a specific technical challenge you solved in your project today.',
            category: 'OnlinePresence',
            priority: 'medium'
        },
        {
            title: 'Optional AI tool practice',
            description: 'If you have extra energy, dive deeper into a new AI agent framework or automation node.',
            category: 'AINews',
            priority: 'low'
        },
        {
            title: 'X/Reddit engagement (2-3 replies)',
            description: 'Strengthen relationships by replying to key influencers or active community members.',
            category: 'OnlinePresence',
            priority: 'low'
        }
    ],
    Friday: [
        {
            title: 'DevOps video + practice + notes',
            description: 'Wrap up the week\'s learning module. Ensure you can explain the core concept without looking at notes.',
            category: 'DevOps',
            priority: 'high'
        },
        {
            title: 'Weekly reflection draft (post/blog)',
            description: 'Use the auto-generated summary to write a "Week in Review" post. Highlight wins and lessons.',
            category: 'Reflection',
            priority: 'high'
        },
        {
            title: 'Portfolio update',
            description: 'Add a new project screenshot, update a description, or refine a skill tag in your portfolio.',
            category: 'Portfolio',
            priority: 'medium'
        },
        {
            title: 'Freelance follow-ups',
            description: 'Ping leads from Monday/Wednesday if they haven\'t replied. Be professional and brief.',
            category: 'Freelancing',
            priority: 'medium'
        },
        {
            title: 'X/Reddit engagement (2-3 replies)',
            description: 'Final engagement pulse for the work week.',
            category: 'OnlinePresence',
            priority: 'low'
        }
    ],
    Saturday: [
        {
            title: 'Send 3-5 proposals',
            description: 'Batch process new opportunities for the coming week while competition is lower.',
            category: 'Freelancing',
            priority: 'high'
        },
        {
            title: 'Review/tag leads',
            description: 'Organize your CRM. Tag leads by potential value and niche for easier follow-ups.',
            category: 'Lead',
            priority: 'medium'
        },
        {
            title: 'Optional small project tweaks',
            description: 'Do the non-essential but nice-to-have polishing on your projects.',
            category: 'Project',
            priority: 'low'
        },
        {
            title: 'Quick post/learning snippet',
            description: 'Share a Saturday thought or a quick tip you picked up during the week.',
            category: 'OnlinePresence',
            priority: 'low'
        },
        {
            title: 'Check freelance messages',
            description: 'Quick scan of Upwork/LinkedIn for any urgent weekend inquiries.',
            category: 'Freelancing',
            priority: 'medium'
        }
    ],
    Sunday: [
        {
            title: 'Plan next week\'s focus',
            description: 'Come up with the main project idea for the week and prepare the necessary resources or tools.',
            category: 'Project',
            priority: 'medium'
        },
        {
            title: 'AI news scan → add post ideas',
            description: 'Catch up on the latest AI trends and newsletters. Capture at least 2-3 content ideas for the week.',
            category: 'AINews',
            priority: 'medium'
        },
        {
            title: 'Portfolio check',
            description: 'Quickly review your portfolio link, check for dead links, and ensure your latest work is highlighted.',
            category: 'Portfolio',
            priority: 'low'
        },
        {
            title: 'Optional light learning/side project',
            description: 'Dive into a new tool or minor project feature only if you feel inspired. No pressure.',
            category: 'DevOps',
            priority: 'low'
        },
        {
            title: 'Rest & recharge',
            description: 'Completely disconnect from work. Focus on recovery to maintain long-term momentum.',
            category: 'OnlinePresence',
            priority: 'low'
        }
    ]
};

// Category styling
export const CATEGORY_STYLES: Record<TaskCategory, string> = {
    DevOps: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    Project: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    Freelancing: 'bg-green-500/20 text-green-400 border-green-500/30',
    OnlinePresence: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    AINews: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    Lead: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Portfolio: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    Reflection: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
};

export const CATEGORY_ICONS: Record<TaskCategory, string> = {
    DevOps: '⚙️',
    Project: '🚀',
    Freelancing: '💼',
    OnlinePresence: '📱',
    AINews: '🤖',
    Lead: '👤',
    Portfolio: '📁',
    Reflection: '📝'
};

// Utility functions
export function generateId(prefix: string = 'item'): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
}

export function getCurrentWeekday(): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date().getDay()];
}

export function formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

export function getWeekNumber(date: Date = new Date()): number {
    const start = new Date(date.getFullYear(), 0, 1);
    const diff = date.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek);
}
