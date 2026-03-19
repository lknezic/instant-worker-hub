import { useState, useEffect } from "react";
import { kanbanCards as mockCards, type ReviewCard } from "@/data/mockData";
import { events as eventsApi } from "@/lib/api";
import { ChannelIcon } from "@/components/Icons";
import { Star } from "lucide-react";
import { toast } from "sonner";

const columns = [
  { key: "pending" as const, label: "PENDING", dotColor: "bg-warning" },
  { key: "approved" as const, label: "APPROVED", dotColor: "bg-info" },
  { key: "posted" as const, label: "POSTED", dotColor: "bg-success" },
  { key: "rejected" as const, label: "REJECTED", dotColor: "bg-destructive" },
];

function getWorkerEmoji(agentName: string): string {
  const map: Record<string, string> = {
    "x-tweet-thread-poster": "✍️",
    "x-engagement-agent": "💬",
    "reddit-comment-answer": "🗣️",
    "reddit-flagship-poster": "📝",
    "content-recycler": "♻️",
  };
  return map[agentName] || "🤖";
}

function getWorkerName(agentName: string): string {
  const map: Record<string, string> = {
    "x-tweet-thread-poster": "Alex — X Content Writer",
    "x-engagement-agent": "Marcus — Engagement Specialist",
    "reddit-comment-answer": "Daniel — Reddit Commenter",
    "reddit-flagship-poster": "James — Content Strategist",
    "content-recycler": "Victor — Content Recycler",
  };
  return map[agentName] || agentName;
}

function eventToCard(ev: any): ReviewCard {
  return {
    id: String(ev.id),
    workerId: ev.agent_name,
    workerEmoji: getWorkerEmoji(ev.agent_name),
    workerName: getWorkerName(ev.agent_name),
    channel: ev.channel === "x" ? "X" : "Reddit",
    skill: ev.skill_name || "unknown",
    content: ev.final_text || ev.draft_text || "",
    status: ev.review_status as any,
    rating: ev.review_rating || 0,
    metrics: ev.impressions ? { views: ev.impressions, saves: ev.bookmarks || 0, comments: ev.replies || 0 } : undefined,
  };
}

const Dashboard = () => {
  const [cards, setCards] = useState<ReviewCard[]>(mockCards);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskWorker, setNewTaskWorker] = useState("w1");

  // Fetch real events on mount, fall back to mock data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await eventsApi.list({ limit: 100 });
        if (!cancelled && data.events && data.events.length > 0) {
          setCards(data.events.map(eventToCard));
        }
      } catch {
        // API not available — keep mock data
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const updateCard = async (id: string, updates: Partial<ReviewCard>) => {
    // Optimistic local update
    setCards((c) => c.map((card) => card.id === id ? { ...card, ...updates } : card));
    if (updates.status === "approved") toast("✅ Post approved", { duration: 2000 });
    if (updates.status === "rejected") toast("❌ Post rejected", { duration: 2000 });
    if (updates.rating) toast(`⭐ Rated ${updates.rating}/10`, { duration: 1500 });

    // Sync to API
    try {
      if (updates.status) {
        await eventsApi.update(id, { review_status: updates.status });
      }
      if (updates.rating) {
        await eventsApi.rate(id, updates.rating);
      }
      if (updates.content) {
        await eventsApi.update(id, { review_edited_text: updates.content });
      }
    } catch {
      // API not available — local state already updated
    }
  };

  const addTask = () => {
    if (!newTaskContent.trim()) return;
    const workerMap: Record<string, { emoji: string; name: string; channel: "X" | "Reddit" }> = {
      w1: { emoji: "✍️", name: "Alex — X Content Writer", channel: "X" },
      w2: { emoji: "💬", name: "Marcus — Engagement Specialist", channel: "X" },
      w3: { emoji: "🗣️", name: "Daniel — Reddit Commenter", channel: "Reddit" },
      w4: { emoji: "📝", name: "James — Content Strategist", channel: "Reddit" },
      w5: { emoji: "♻️", name: "Victor — Content Recycler", channel: "X" },
    };
    const w = workerMap[newTaskWorker];
    const newCard: ReviewCard = {
      id: `k${Date.now()}`,
      workerId: newTaskWorker,
      workerEmoji: w.emoji,
      workerName: w.name,
      channel: w.channel,
      skill: "custom",
      content: newTaskContent,
      status: "pending",
      rating: 0,
    };
    setCards((c) => [...c, newCard]);
    setNewTaskContent("");
    setShowAddModal(false);
    toast("✅ Task created", { duration: 2000 });
  };

  const StarRating = ({ rating, cardId }: { rating: number; cardId: string }) => (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }, (_, i) => (
        <button
          key={i}
          onClick={() => updateCard(cardId, { rating: i + 1 })}
          className={`w-5 h-5 rounded text-[10px] font-semibold flex items-center justify-center transition-all border ${
            i + 1 === rating
              ? "bg-primary text-primary-foreground border-primary"
              : i < rating
              ? "bg-primary/15 text-primary border-primary/30"
              : "bg-muted/30 text-muted-foreground border-border hover:border-primary/30"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );

  const pendingCount = cards.filter(c => c.status === "pending").length;

  return (
    <div className="h-full flex flex-col">
      {/* Stats bar */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-0 text-sm shrink-0 bg-card/30">
        {[
          { label: "Posts this week", value: "15/35", color: "text-foreground" },
          { label: "Pending", value: String(pendingCount), color: "text-warning" },
          { label: "Engagement", value: "2.3%", color: "text-success" },
          { label: "Grade", value: "B+", color: "text-primary" },
        ].map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {i > 0 && <div className="w-px h-6 bg-border mx-5" />}
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">{stat.label}</span>
              <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Strategy banner */}
      <div className="mx-6 mt-4 px-4 py-2.5 glass-card rounded-lg flex items-center justify-between shrink-0">
        <span className="text-sm text-muted-foreground">
          Upgrade to <span className="text-foreground font-medium">Strategy Suite</span> for weekly content pillars
        </span>
        <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
          Coming Soon
        </span>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="grid grid-cols-4 gap-3 h-full min-w-[800px]">
          {columns.map((col) => {
            const colCards = cards.filter((c) => c.status === col.key);
            return (
              <div key={col.key} className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${col.dotColor} relative`}>
                      {col.key === "pending" && pendingCount > 0 && <div className={`w-1.5 h-1.5 rounded-full ${col.dotColor} animate-ping absolute inset-0`} />}
                    </div>
                    <span className="text-[11px] font-semibold tracking-widest text-muted-foreground">{col.label}</span>
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                      col.key === "pending" && pendingCount > 0
                        ? "bg-warning/15 text-warning animate-pulse"
                        : "text-muted-foreground/40"
                    }`}>
                      {colCards.length}
                    </span>
                  </div>
                  {col.key === "pending" && (
                    <button onClick={() => setShowAddModal(true)} className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
                      + Add
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {colCards.map((card) => (
                    <div key={card.id} className="glass-card rounded-lg p-3 glow-border relative">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-sm">{card.workerEmoji}</span>
                        <span className="text-xs font-semibold">{card.workerName}</span>
                      </div>
                      <span className="inline-block text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium mb-2">
                        {card.skill}
                      </span>
                      {/\[\d+\/\d+\]/.test(card.content) ? (
                        <>
                          <p className="text-xs text-muted-foreground line-clamp-3 mb-1.5 leading-relaxed">
                            {card.content.split(/\[\d+\/\d+\]\s*/)[1]?.trim().slice(0, 120) || card.content.slice(0, 120)}...
                          </p>
                          <span className="text-[9px] text-primary/60 font-medium">
                            🧵 Thread • {card.content.split(/\[\d+\/\d+\]/).filter(Boolean).length} tweets
                          </span>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground line-clamp-3 mb-2.5 leading-relaxed">{card.content}</p>
                      )}

                      {card.status === "posted" && card.metrics && (
                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground/70 mb-2 font-mono">
                          <span>👁 {card.metrics.views.toLocaleString()}</span>
                          <span>🔖 {card.metrics.saves}</span>
                          <span>💬 {card.metrics.comments}</span>
                        </div>
                      )}

                      <StarRating rating={card.rating} cardId={card.id} />

                      {card.status === "pending" && (
                        <div className="flex gap-1.5 mt-2.5">
                          <button onClick={() => updateCard(card.id, { status: "approved" })} className="flex-1 text-[11px] font-medium py-1 rounded-md bg-success/15 text-success hover:bg-success/25 transition-colors">
                            Approve
                          </button>
                          <button className="flex-1 text-[11px] font-medium py-1 rounded-md bg-info/15 text-info hover:bg-info/25 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => updateCard(card.id, { status: "rejected" })} className="flex-1 text-[11px] font-medium py-1 rounded-md bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">
                            Reject
                          </button>
                        </div>
                      )}

                      <div className="absolute top-2.5 right-2.5 opacity-20">
                        <ChannelIcon channel={card.channel} className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="glass-card-strong rounded-xl p-6 w-full max-w-md gradient-border animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-1">Create Custom Task</h3>
            <p className="text-xs text-muted-foreground mb-4">What should we create?</p>
            <textarea
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="Write the content..."
              rows={4}
              className="w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 placeholder:text-muted-foreground resize-none mb-3 transition-all"
            />
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Which worker?</span>
              <select
                value={newTaskWorker}
                onChange={(e) => setNewTaskWorker(e.target.value)}
                className="flex-1 bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="w1">✍️ Alex — X Content Writer</option>
                <option value="w2">💬 Marcus — Engagement Specialist</option>
                <option value="w3">🗣️ Daniel — Reddit Commenter</option>
                <option value="w4">📝 James — Content Strategist</option>
                <option value="w5">♻️ Victor — Content Recycler</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 text-sm py-2.5 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all">Cancel</button>
              <button onClick={addTask} className="flex-1 text-sm py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all font-semibold">Create Task</button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-3 text-center">🔒 Custom tasks on Growth+</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
