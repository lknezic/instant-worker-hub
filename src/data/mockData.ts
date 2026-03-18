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
}

export interface KanbanCard {
  id: string;
  workerId: string;
  workerEmoji: string;
  workerName: string;
  skill: string;
  content: string;
  status: "pending" | "approved" | "posted" | "rejected";
  rating: number;
  metrics?: { views: number; saves: number; comments: number };
}

export interface Finding {
  id: string;
  label: string;
  value: string;
  confidence: "sure" | "guess" | "missing";
}

export const workers: Worker[] = [
  { id: "w1", emoji: "✍️", name: "X Poster", description: "Crafts original tweets that drive engagement", channel: "X", enabled: true, status: "active", postsThisWeek: 15, avgRating: 7.8, latestLearning: "Threads with a hook question get 3x more replies" },
  { id: "w2", emoji: "💬", name: "X Engagement", description: "Replies to relevant conversations in your niche", channel: "X", enabled: true, status: "active", postsThisWeek: 32, avgRating: 6.5, latestLearning: "Adding a personal anecdote increases reply rate by 40%" },
  { id: "w3", emoji: "🗣️", name: "Reddit Commenter", description: "Adds helpful comments in target subreddits", channel: "Reddit", enabled: true, status: "active", postsThisWeek: 18, avgRating: 7.2, latestLearning: "Leading with data points gets more upvotes" },
  { id: "w4", emoji: "📝", name: "Reddit Flagship", description: "Writes long-form Reddit posts that establish authority", channel: "Reddit", enabled: false, status: "paused", postsThisWeek: 3, avgRating: 8.1, latestLearning: "Case study format outperforms listicles 2:1" },
  { id: "w5", emoji: "♻️", name: "Content Recycler", description: "Repurposes top content across channels", channel: "X", enabled: false, status: "paused", postsThisWeek: 5, avgRating: 6.9, latestLearning: "Reframing old content as contrarian takes boosts engagement" },
];

export const kanbanCards: KanbanCard[] = [
  { id: "k1", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", skill: "value-tweet", content: "Most founders spend 80% of their time on the 20% that doesn't matter. Here's how to flip that ratio and actually move the needle on growth...", status: "pending", rating: 0 },
  { id: "k2", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", skill: "contrarian-hook", content: "Unpopular opinion: Your content strategy doesn't need more content. It needs better distribution. Here's why most brands get this backwards...", status: "pending", rating: 0 },
  { id: "k3", workerId: "w2", workerEmoji: "💬", workerName: "X Engagement", skill: "thoughtful-reply", content: "Great point about attribution. We found that most teams over-index on last-touch and miss the compounding effect of awareness content.", status: "pending", rating: 0 },
  { id: "k4", workerId: "w3", workerEmoji: "🗣️", workerName: "Reddit Commenter", skill: "helpful-answer", content: "I've tested both approaches extensively. The key insight is that consistency beats optimization in the first 90 days. Focus on volume first, then refine.", status: "pending", rating: 0 },
  { id: "k5", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", skill: "thread-opener", content: "I spent 6 months studying what makes B2B content go viral. Here are 7 patterns I found (thread) 🧵", status: "approved", rating: 8 },
  { id: "k6", workerId: "w2", workerEmoji: "💬", workerName: "X Engagement", skill: "thoughtful-reply", content: "This is so true. The companies winning at content marketing aren't the ones with the biggest budgets — they're the ones with the most authentic voice.", status: "approved", rating: 7 },
  { id: "k7", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", skill: "value-tweet", content: "The best marketing doesn't feel like marketing. It feels like a friend giving you advice you didn't know you needed.", status: "posted", rating: 9, metrics: { views: 4200, saves: 89, comments: 23 } },
  { id: "k8", workerId: "w3", workerEmoji: "🗣️", workerName: "Reddit Commenter", skill: "helpful-answer", content: "From my experience, the ROI on organic social is 10x paid when you get the flywheel going. The trick is the first 90 days.", status: "posted", rating: 7, metrics: { views: 1800, saves: 42, comments: 15 } },
  { id: "k9", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", skill: "hot-take", content: "SEO is dead for startups. The future is building an audience that comes to you. Here's my controversial framework...", status: "posted", rating: 8, metrics: { views: 6100, saves: 156, comments: 47 } },
  { id: "k10", workerId: "w2", workerEmoji: "💬", workerName: "X Engagement", skill: "thoughtful-reply", content: "I disagree. Cold outreach still works if you lead with value. The problem is most people lead with a pitch.", status: "rejected", rating: 3 },
  { id: "k11", workerId: "w1", workerEmoji: "✍️", workerName: "X Poster", skill: "contrarian-hook", content: "Your marketing team is too big. You need 2 people, not 20. Here's the lean marketing stack that outperforms agencies...", status: "pending", rating: 0 },
  { id: "k12", workerId: "w3", workerEmoji: "🗣️", workerName: "Reddit Commenter", skill: "resource-drop", content: "Here's a free template I put together for tracking content performance across channels. It's helped us identify what actually drives pipeline.", status: "pending", rating: 0 },
  { id: "k13", workerId: "w5", workerEmoji: "♻️", workerName: "Content Recycler", skill: "reframe", content: "Remember that thread about B2B virality? Here's the TL;DR as a single actionable tweet: Focus on 'surprisingly useful' over 'surprisingly clever'.", status: "pending", rating: 0 },
];

export const findings: Finding[] = [
  { id: "f1", label: "Business Name", value: "Acme SaaS Co", confidence: "sure" },
  { id: "f2", label: "Target Audience", value: "B2B SaaS founders and marketing leaders, 25-45, primarily US-based", confidence: "sure" },
  { id: "f3", label: "Key Topics", value: "Growth marketing, content strategy, B2B sales, product-led growth", confidence: "guess" },
  { id: "f4", label: "Voice Style", value: "Professional but approachable, data-driven, slightly contrarian", confidence: "guess" },
  { id: "f5", label: "Competitors", value: "HubSpot, Jasper, Copy.ai, Buffer", confidence: "sure" },
  { id: "f6", label: "Pain Points", value: "Time-consuming content creation, inconsistent posting, measuring ROI", confidence: "guess" },
  { id: "f7", label: "Key Features", value: "AI-powered content generation, multi-channel distribution, analytics dashboard", confidence: "missing" },
  { id: "f8", label: "Current Offers", value: "14-day free trial, annual discount, enterprise custom pricing", confidence: "missing" },
];

export const workerLearning = {
  doingMore: [
    "Using data-backed claims in thread openers",
    "Adding a clear CTA at the end of value tweets",
    "Starting replies with agreement before adding nuance",
    "Using the 'surprisingly useful' framing for educational content",
  ],
  stoppedDoing: [
    "Generic motivational quotes without actionable takeaways",
    "Self-promotional language in the first line",
    "Using more than 2 hashtags per tweet",
  ],
  feedback: [
    "User rated thread openers 8.5 avg vs single tweets 6.2 avg",
    "Contrarian hooks get high engagement but lower save rate",
    "Data-driven posts get more bookmarks than opinion posts",
  ],
  suggestions: [
    { id: "s1", text: "Try 'myth-busting' format — debunk common industry beliefs with data", applied: false },
    { id: "s2", text: "Experiment with question-led tweets to boost reply rate", applied: false },
    { id: "s3", text: "Add a 'resource' tweet at the end of threads linking to your content", applied: true },
    { id: "s4", text: "Test posting between 7-9am EST for B2B audience", applied: false },
  ],
};

export const activityLog = [
  { id: "a1", content: "Most founders spend 80% of their time...", status: "posted" as const, rating: 9, metrics: { views: 4200, saves: 89, comments: 23 }, date: "2h ago" },
  { id: "a2", content: "I spent 6 months studying what makes B2B content go viral...", status: "posted" as const, rating: 8, metrics: { views: 6100, saves: 156, comments: 47 }, date: "5h ago" },
  { id: "a3", content: "Unpopular opinion: Your content strategy doesn't need more content...", status: "pending" as const, rating: 0, metrics: undefined, date: "1d ago" },
  { id: "a4", content: "SEO is dead for startups...", status: "rejected" as const, rating: 3, metrics: undefined, date: "1d ago" },
  { id: "a5", content: "The best marketing doesn't feel like marketing...", status: "posted" as const, rating: 7, metrics: { views: 1800, saves: 42, comments: 15 }, date: "2d ago" },
];

export const invoices = [
  { id: "inv1", date: "Mar 1, 2026", amount: "$249.00", status: "Paid" },
  { id: "inv2", date: "Feb 1, 2026", amount: "$249.00", status: "Paid" },
  { id: "inv3", date: "Jan 1, 2026", amount: "$249.00", status: "Paid" },
];
