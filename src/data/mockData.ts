// ===== TYPES =====

export interface Worker {
  id: string;
  emoji: string;
  name: string;
  description: string;
  channel: "X" | "Reddit";
  enabled: boolean;
  status: "active" | "paused";
  postsThisWeek: number;
  avgRating: number;
  latestLearning: string;
  nextPost?: string;
}

export interface WorkflowQuestion {
  id: string;
  workerEmoji: string;
  workerName: string;
  question: string;
  options: { label: string; action: string }[];
}

export interface ReviewCard {
  id: string;
  workerId: string;
  workerEmoji: string;
  workerName: string;
  channel: "X" | "Reddit";
  skill: string;
  content: string;
  status: "pending" | "approved" | "posted" | "rejected";
  rating: number;
  metrics?: { views: number; saves: number; comments: number };
}

export interface Finding {
  id: string;
  emoji: string;
  label: string;
  value: string;
  confidence: "confident" | "needs-review" | "missing";
  required?: boolean;
  confirmed?: boolean;
}

export interface StrategistMessage {
  id: string;
  role: "strategist" | "user";
  content: string;
  quickReplies?: string[];
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

// ===== WORKERS =====

export const workers: Worker[] = [
  { id: "w1", emoji: "✍️", name: "X Poster", description: "Crafts original tweets that drive engagement", channel: "X", enabled: true, status: "active", postsThisWeek: 15, avgRating: 7.8, latestLearning: "Numbers get 3x more saves", nextPost: "14:00 CET" },
  { id: "w2", emoji: "💬", name: "X Engagement", description: "Replies to relevant conversations in your niche", channel: "X", enabled: true, status: "active", postsThisWeek: 24, avgRating: 6.9, latestLearning: "Personal anecdotes increase reply rate by 40%", nextPost: "15:30 CET" },
  { id: "w3", emoji: "🗣️", name: "Reddit Commenter", description: "Adds helpful comments in target subreddits", channel: "Reddit", enabled: true, status: "active", postsThisWeek: 12, avgRating: 7.2, latestLearning: "Short comments (2-3 sentences) get more upvotes", nextPost: "16:00 CET" },
  { id: "w4", emoji: "📝", name: "Reddit Flagship", description: "Writes long-form Reddit posts that establish authority", channel: "Reddit", enabled: true, status: "active", postsThisWeek: 3, avgRating: 8.1, latestLearning: "Case study format outperforms listicles 2:1", nextPost: "Tomorrow" },
  { id: "w5", emoji: "♻️", name: "Content Recycler", description: "Repurposes top content across channels", channel: "X", enabled: false, status: "paused", postsThisWeek: 0, avgRating: 0, latestLearning: "" },
];

// ===== WORKFLOW QUESTIONS =====

export const workflowQuestions: WorkflowQuestion[] = [
  {
    id: "q1",
    workerEmoji: "✍️",
    workerName: "X Poster",
    question: "You've never posted about meal prep. Should I add it to the rotation?",
    options: [{ label: "Yes, add it", action: "add" }, { label: "No, skip it", action: "skip" }],
  },
  {
    id: "q2",
    workerEmoji: "🗣️",
    workerName: "Reddit Commenter",
    question: "I found a thread about your competitor. Should I respond?",
    options: [{ label: "Yes, reply", action: "reply" }, { label: "No, ignore", action: "ignore" }],
  },
  {
    id: "q3",
    workerEmoji: "📊",
    workerName: "Judge",
    question: "Your evening posts consistently outperform morning ones. Switch schedule to evenings?",
    options: [{ label: "Yes, switch", action: "switch" }, { label: "Dismiss", action: "dismiss" }],
  },
];

// ===== REVIEW CARDS (7 pending) =====

export const reviewCards: ReviewCard[] = [
  { id: "r1", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", channel: "X", skill: "value-tweet", content: "80% of people who start a workout program quit in the first 30 days. The other 20% all have one thing in common: a system.", status: "pending", rating: 0 },
  { id: "r2", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", channel: "X", skill: "contrarian-hook", content: "Unpopular opinion: Selling puts on quality stocks you want to own is less risky than buying them outright. Here's the math...", status: "pending", rating: 0 },
  { id: "r3", workerId: "w3", workerEmoji: "🗣️", workerName: "Reddit Commenter", channel: "Reddit", skill: "helpful-reply", content: "Great question! Covered calls on dividend stocks can boost your yield by 2-4% annually.", status: "pending", rating: 0 },
  { id: "r4", workerId: "w2", workerEmoji: "💬", workerName: "X Engagement", channel: "X", skill: "quote-tweet", content: "This is exactly why implied volatility matters more than stock direction.", status: "pending", rating: 0 },
  { id: "r5", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", channel: "X", skill: "story-tweet", content: "Lost everything in my first year. Rebuilt with a system. Here's what I learned...", status: "pending", rating: 0 },
  { id: "r6", workerId: "w4", workerEmoji: "📝", workerName: "Reddit Flagship", channel: "Reddit", skill: "journal-post", content: "Week 12 journal: $1,847 premium, 3 assignments, 2 rolls...", status: "pending", rating: 0 },
  { id: "r7", workerId: "w3", workerEmoji: "🗣️", workerName: "Reddit Commenter", channel: "Reddit", skill: "helpful-reply", content: "Position sizing is everything. Never risk more than 5%...", status: "pending", rating: 0 },
];

// ===== KANBAN CARDS (for Dashboard) =====

export const kanbanCards: ReviewCard[] = [
  // Pending
  ...reviewCards,
  // Approved
  { id: "k8", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", channel: "X", skill: "thread-opener", content: "I spent 6 months studying what makes B2B content go viral. Here are 7 patterns I found (thread) 🧵", status: "approved", rating: 8 },
  { id: "k9", workerId: "w2", workerEmoji: "💬", workerName: "X Engagement", channel: "X", skill: "thoughtful-reply", content: "This is so true. The companies winning at content marketing aren't the ones with the biggest budgets — they're the ones with the most authentic voice.", status: "approved", rating: 7 },
  // Posted
  { id: "k10", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", channel: "X", skill: "story-tweet", content: "Lost $4,200 on my first trade. Today I make $3K/month...", status: "posted", rating: 8, metrics: { views: 4200, saves: 89, comments: 23 } },
  { id: "k11", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", channel: "X", skill: "value-tweet", content: "Numbers that changed my trading: 45 DTE, 0.30 delta, 2% max risk per position...", status: "posted", rating: 9, metrics: { views: 6800, saves: 142, comments: 31 } },
  { id: "k12", workerId: "w3", workerEmoji: "🗣️", workerName: "Reddit Commenter", channel: "Reddit", skill: "helpful-reply", content: "The key with CSPs is position sizing. Never allocate more than 5% of your portfolio to a single position...", status: "posted", rating: 7, metrics: { views: 1100, saves: 34, comments: 8 } },
  // Rejected
  { id: "k13", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", channel: "X", skill: "promo-tweet", content: "Ready to start? Sign up today!", status: "rejected", rating: 3 },
];

// ===== IMPROVEMENT DATA =====

export const workerLearning = {
  doingMore: [
    "Posts with specific numbers get 2x more saves",
    "Contrarian hooks outperform question hooks 3:1",
    "Morning posts (8-10am EST) highest engagement",
  ],
  stoppedDoing: [
    "Generic motivational tweets (low engagement)",
    "Threads longer than 7 tweets (drop-off at 5)",
    "Questions without a strong opinion attached",
  ],
  feedback: [
    '"Too salesy" — you said this 3 times',
    '"Great hook" — you said this on best-rated posts',
    "Posts rated 8+ all had numbers in the hook",
  ],
  suggestions: [
    { id: "s1", text: "Add more personal stories (2x engagement)", applied: false },
    { id: "s2", text: "Reduce promotional CTAs", applied: false },
    { id: "s3", text: "Try posting at 22:00 CET", applied: false },
  ],
};

export const improvementsSummary = [
  { workerEmoji: "✍️", workerName: "X Poster", learned: "Specific numbers get 3x more saves", stopped: "Generic motivational tweets" },
  { workerEmoji: "🗣️", workerName: "Reddit Commenter", learned: "Short comments (2-3 sentences) get more upvotes than long explanations", stopped: null },
];

export const overallImprovement = "Engagement up 18% vs last week ✅";

// ===== STRATEGY (Tier 3) =====

export const weeklyPillar = {
  title: "Why 80% of fitness programs fail in 30 days",
  angles: [
    { worker: "X Poster", plan: "3 threads on quitting patterns" },
    { worker: "X Engagement", plan: "Reply to fitness beginner posts" },
    { worker: "Reddit Commenter", plan: 'Answer "why do I keep quitting?" posts' },
    { worker: "Reddit Flagship", plan: '"1,000 clients taught me this" post' },
  ],
};

// ===== POST & GO SUMMARY =====

export const postSummary = {
  xPosts: { total: 5, auto: 3, needScreenshots: 2 },
  redditDrafts: 8,
  engagementReplies: 3,
};

// ===== STRATEGIST CHAT =====

export const strategistMessages: StrategistMessage[] = [
  {
    id: "m1",
    role: "strategist",
    content: "Good morning! Here's what I noticed since yesterday:\n\n• Your evening posts outperformed morning by 40% this week\n• Competitor @FitGuru posted about meal prep — trending\n• Reddit engagement is up 23%\n\nWant me to shift your schedule to focus on evenings?",
    quickReplies: ["Yes, shift it", "Tell me more"],
  },
  {
    id: "m2",
    role: "user",
    content: "Also make the voice more casual, less corporate",
  },
  {
    id: "m3",
    role: "strategist",
    content: "Done — I updated your voice guide. Posts will sound more conversational starting with today's batch. Want to see a preview?",
    quickReplies: ["Show preview", "Looks good"],
  },
];

// ===== ACTIVITY LOG =====

export const activityLog = [
  { id: "a1", content: "Lost $4,200 on first trade. Today I make $3K/month...", status: "posted" as const, rating: 8, metrics: { views: 4200, saves: 89, comments: 23 }, date: "2h ago" },
  { id: "a2", content: "Numbers that changed my trading: 45 DTE...", status: "posted" as const, rating: 9, metrics: { views: 6800, saves: 142, comments: 31 }, date: "5h ago" },
  { id: "a3", content: "Unpopular opinion: Selling puts on quality stocks...", status: "pending" as const, rating: 0, metrics: undefined, date: "1d ago" },
  { id: "a4", content: "Ready to start? Sign up today!", status: "rejected" as const, rating: 3, metrics: undefined, date: "1d ago" },
  { id: "a5", content: "The key with CSPs is position sizing...", status: "posted" as const, rating: 7, metrics: { views: 1100, saves: 34, comments: 8 }, date: "2d ago" },
];

// ===== ONBOARDING FINDINGS =====

export const findings: Finding[] = [
  { id: "f1", emoji: "🏢", label: "Business Name", value: "FitnessPro", confidence: "confident", required: true },
  { id: "f2", emoji: "📝", label: "Description", value: "Online fitness coaching for busy professionals", confidence: "confident", required: true },
  { id: "f3", emoji: "🎯", label: "Target Audience", value: "Busy professionals 30-50 who want to get fit without spending hours in the gym", confidence: "needs-review", required: true },
  { id: "f4", emoji: "💡", label: "Topics", value: "Home workouts, nutrition, recovery, mindset, meal prep, strength training, flexibility, sleep optimization, stress management, habit building, body composition, cardio, supplements, injury prevention, time management", confidence: "confident" },
  { id: "f5", emoji: "🗣️", label: "Voice & Tone", value: "Motivational but grounded, real results over hype", confidence: "needs-review" },
  { id: "f6", emoji: "💰", label: "Offers", value: "7-day free trial, 12-week transformation program", confidence: "needs-review" },
  { id: "f7", emoji: "🏁", label: "Competitors", value: "Peloton, Noom, MyFitnessPal", confidence: "confident" },
  { id: "f8", emoji: "😤", label: "Pain Points", value: "No time, inconsistent routines, overwhelmed by info", confidence: "needs-review" },
  { id: "f9", emoji: "⚡", label: "Features", value: "Personalized plans, progress tracking, community", confidence: "confident" },
  { id: "f10", emoji: "🚫", label: "Forbidden Topics", value: "", confidence: "missing", required: true },
  { id: "f11", emoji: "⚖️", label: "Regulated Industry", value: "", confidence: "missing" },
];

// ===== BILLING =====

export const invoices: Invoice[] = [
  { id: "inv1", date: "Mar 1, 2026", amount: "$249.00", status: "Paid" },
  { id: "inv2", date: "Feb 1, 2026", amount: "$249.00", status: "Paid" },
  { id: "inv3", date: "Jan 1, 2026", amount: "$249.00", status: "Paid" },
];
