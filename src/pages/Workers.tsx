import { useState, useEffect } from "react";
import { workers as mockWorkers, workerLearning, activityLog, type Worker } from "@/data/mockData";
import { agents as agentsApi, scorecards } from "@/lib/api";
import { ChannelIcon, StatusDot } from "@/components/Icons";
import { Star } from "lucide-react";
import AnimatedNumber from "@/components/AnimatedNumber";
import MiniSparkline from "@/components/MiniSparkline";
import { toast } from "sonner";

// Sparkline data per worker
const sparklineData: Record<string, number[]> = {
  w1: [1.2, 1.5, 1.8, 2.1, 2.3, 2.6],
  w2: [0.8, 1.0, 0.9, 1.2, 1.1, 1.4],
  w3: [1.5, 1.3, 1.7, 1.9, 2.0, 2.2],
  w4: [2.0, 2.5, 2.8, 3.1, 2.9, 3.4],
  w5: [0, 0, 0, 0, 0, 0],
};

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
    "x-tweet-thread-poster": "X Poster",
    "x-engagement-agent": "X Engagement",
    "reddit-comment-answer": "Reddit Commenter",
    "reddit-flagship-poster": "Reddit Flagship",
    "content-recycler": "Content Recycler",
  };
  return map[agentName] || agentName;
}

function getWorkerChannel(agentName: string): "X" | "Reddit" {
  if (agentName.startsWith("reddit")) return "Reddit";
  return "X";
}

function agentToWorker(agent: any): Worker {
  return {
    id: agent.slug || agent.id || agent.agent_name,
    emoji: getWorkerEmoji(agent.slug || agent.agent_name),
    name: getWorkerName(agent.slug || agent.agent_name),
    description: agent.description || "",
    channel: getWorkerChannel(agent.slug || agent.agent_name),
    enabled: agent.enabled !== false,
    status: agent.enabled !== false ? "active" : "paused",
    postsThisWeek: agent.posts_this_week || 0,
    avgRating: agent.avg_rating || 0,
    latestLearning: agent.latest_learning || "",
    nextPost: agent.next_post || undefined,
  };
}

const Workers = () => {
  const [allWorkers, setAllWorkers] = useState<Worker[]>(mockWorkers);
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"learning" | "activity" | "settings">("learning");
  const [volume, setVolume] = useState(5);
  const [eduMix, setEduMix] = useState(40);
  const [storyMix, setStoryMix] = useState(35);
  const [opinionMix, setOpinionMix] = useState(25);
  const [autonomy, setAutonomy] = useState("L2");
  const [suggestions, setSuggestions] = useState(workerLearning.suggestions);

  // Fetch real agents on mount, fall back to mock data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await agentsApi.mine();
        if (!cancelled && data.agents && data.agents.length > 0) {
          setAllWorkers(data.agents.map(agentToWorker));
        }
      } catch {
        // API not available — keep mock data
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const worker = allWorkers.find((w) => w.id === selectedWorker);

  const handlePause = async (workerId: string) => {
    setAllWorkers((prev) => prev.map((w) => w.id === workerId ? { ...w, status: "paused" as const, enabled: false } : w));
    toast("⏸ Worker paused", { duration: 2000 });
    try {
      await agentsApi.disable(workerId);
    } catch {
      // API not available — local state already updated
    }
  };

  const handleResume = async (workerId: string) => {
    setAllWorkers((prev) => prev.map((w) => w.id === workerId ? { ...w, status: "active" as const, enabled: true } : w));
    toast("▶️ Worker resumed", { duration: 2000 });
    try {
      await agentsApi.enable(workerId);
    } catch {
      // API not available — local state already updated
    }
  };

  const tabs = [
    { key: "learning" as const, label: "Learning" },
    { key: "activity" as const, label: "Activity" },
    { key: "settings" as const, label: "Settings" },
  ];

  const statusBadge = (s: string) => {
    const colors: Record<string, string> = {
      active: "bg-success/15 text-success",
      paused: "bg-muted text-muted-foreground",
      posted: "bg-success/15 text-success",
      pending: "bg-warning/15 text-warning",
      approved: "bg-info/15 text-info",
      rejected: "bg-destructive/15 text-destructive",
    };
    return colors[s] || "bg-muted text-muted-foreground";
  };

  const statusBorderColor = (s: string) => {
    const colors: Record<string, string> = {
      posted: "border-l-2 border-l-success",
      pending: "border-l-2 border-l-warning",
      approved: "border-l-2 border-l-info",
      rejected: "border-l-2 border-l-destructive",
    };
    return colors[s] || "";
  };

  if (selectedWorker && worker) {
    return (
      <div className="h-full flex flex-col animate-fade-in">
        <div className="px-6 py-3 border-b border-border flex items-center gap-4 shrink-0 bg-card/30">
          <button onClick={() => setSelectedWorker(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
          <div className="w-px h-4 bg-border" />
          <span className="text-lg">{worker.emoji}</span>
          <span className="font-semibold text-sm">{worker.name}</span>
          <StatusDot status={worker.status} />
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(worker.status)}`}>{worker.status}</span>
          {worker.nextPost && <span className="text-xs text-muted-foreground ml-auto">Next: {worker.nextPost}</span>}
          <div className="opacity-40">
            <ChannelIcon channel={worker.channel} className="w-4 h-4" />
          </div>
        </div>

        <div className="px-6 pt-4 border-b border-border shrink-0">
          <div className="flex gap-6">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`pb-3 text-sm font-medium border-b-2 transition-all ${
                  activeTab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "learning" && (
            <div className="max-w-2xl space-y-8">
              <Section title="Doing More Of" items={workerLearning.doingMore} color="text-success" icon="↗" />
              <Section title="Stopped Doing" items={workerLearning.stoppedDoing} color="text-destructive" icon="↘" />
              <Section title="Your Feedback" items={workerLearning.feedback} color="text-info" icon="◆" />

              <div>
                <h3 className="font-semibold text-sm mb-3">Suggestions</h3>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <label key={s.id} className="flex items-start gap-3 glass-card rounded-lg p-3.5 cursor-pointer glow-border">
                      <input
                        type="checkbox"
                        checked={s.applied}
                        onChange={() => setSuggestions((prev) => prev.map((item) => item.id === s.id ? { ...item, applied: !item.applied } : item))}
                        className="mt-0.5 accent-primary"
                      />
                      <span className={`text-sm leading-relaxed ${s.applied ? "text-muted-foreground line-through" : ""}`}>{s.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-3">Improvement Timeline</h3>
                <div className="glass-card rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    {[
                      { week: "W1", val: "1.2%", delta: null },
                      { week: "W2", val: "1.8%", delta: "+50%" },
                      { week: "W3", val: "2.3%", delta: "+28%" },
                      { week: "W4", val: "2.1%", delta: "-9%" },
                    ].map((w, i) => (
                      <div key={w.week} className="flex items-center gap-3">
                        {i > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-6 h-px bg-primary/30" />
                            <span className="text-primary text-[10px] font-bold">→</span>
                            <div className="w-6 h-px bg-primary/30" />
                          </div>
                        )}
                        <div className="text-center">
                          <span className="text-[10px] text-muted-foreground block">{w.week}</span>
                          <AnimatedNumber
                            value={w.val}
                            duration={800 + i * 300}
                            className={`text-sm font-bold ${i === 2 ? "text-primary" : "text-foreground"}`}
                          />
                          {w.delta && (
                            <AnimatedNumber
                              value={w.delta}
                              duration={1000 + i * 300}
                              className={`text-[10px] font-semibold block ${w.delta.startsWith("+") ? "text-success" : "text-destructive"}`}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="max-w-2xl space-y-2">
              {activityLog.map((a, i) => (
                <div
                  key={a.id}
                  className={`glass-card rounded-lg p-3.5 flex items-start gap-3 animate-fade-in ${statusBorderColor(a.status)}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(a.status)}`}>{a.status}</span>
                      <span className="text-xs text-muted-foreground font-mono">{a.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{a.content}</p>
                    {a.metrics && (
                      <p className="text-[11px] text-muted-foreground/70 mt-1.5 font-mono">
                        👁 {a.metrics.views.toLocaleString()} · 🔖 {a.metrics.saves} · 💬 {a.metrics.comments}
                      </p>
                    )}
                  </div>
                  {a.rating > 0 && (
                    <span className="text-xs text-primary font-semibold shrink-0 flex items-center gap-0.5">
                      <Star className="w-3 h-3" fill="currentColor" /> {a.rating}/10
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-md space-y-6">
              <div>
                <label className="flex items-center justify-between text-sm font-medium mb-2">
                  <span>Volume</span>
                  <span className="text-primary font-semibold">{volume} posts/day</span>
                </label>
                <input type="range" min={1} max={10} value={volume} onChange={(e) => setVolume(+e.target.value)} className="w-full accent-primary" />
              </div>

              <div className="space-y-3">
                <span className="text-sm font-semibold">Content Mix</span>
                <SliderRow label="Educational" value={eduMix} onChange={setEduMix} />
                <SliderRow label="Story" value={storyMix} onChange={setStoryMix} />
                <SliderRow label="Opinion" value={opinionMix} onChange={setOpinionMix} />
              </div>

              <div>
                <span className="text-sm font-semibold block mb-3">Autonomy Level</span>
                <div className="space-y-2">
                  {[
                    { v: "L1", l: "Draft Only", desc: "All content needs your approval" },
                    { v: "L2", l: "Semi-Auto", desc: "High-confidence posts auto-publish" },
                    { v: "L3", l: "Full Auto", desc: "Complete autonomy" },
                  ].map((o) => (
                    <label key={o.v} className={`flex items-center gap-3 glass-card rounded-lg p-3 cursor-pointer glow-border ${autonomy === o.v ? "border-primary/30" : ""}`}>
                      <input type="radio" name="autonomy" value={o.v} checked={autonomy === o.v} onChange={() => setAutonomy(o.v)} className="accent-primary" />
                      <div>
                        <span className="text-sm font-medium">{o.v} — {o.l}</span>
                        <p className="text-xs text-muted-foreground">{o.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button className="bg-primary text-primary-foreground text-sm font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 transition-all">
                Save Settings
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Workers</h2>
        <button disabled className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg cursor-not-allowed font-medium">
          Office View <span className="text-[10px] ml-1 text-muted-foreground/50">Coming Soon</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allWorkers.map((w, i) => (
          <div key={w.id} className="glass-card rounded-xl p-5 glow-border animate-fade-in relative" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{w.emoji}</span>
                <span className="font-semibold">{w.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status={w.status} />
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(w.status)}`}>{w.status}</span>
              </div>
            </div>

            {w.nextPost && <p className="text-xs text-muted-foreground mb-2">Next: {w.nextPost}</p>}

            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span className="font-mono">{w.postsThisWeek} {w.channel === "X" ? "posts" : "comments"}</span>
              {w.avgRating > 0 && (
                <span className="text-primary font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3" fill="currentColor" /> {w.avgRating}
                  <MiniSparkline data={sparklineData[w.id] || []} className="ml-1" />
                </span>
              )}
            </div>
            {w.latestLearning && (
              <p className="text-xs text-muted-foreground/80 italic leading-relaxed mb-4 border-l-2 border-primary/20 pl-2.5">"{w.latestLearning}"</p>
            )}
            <div className="flex items-center justify-between">
              <button
                onClick={() => { setSelectedWorker(w.id); setActiveTab("learning"); }}
                className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Open →
              </button>
              {w.status === "active" ? (
                <button
                  onClick={() => handlePause(w.id)}
                  className="text-[10px] text-muted-foreground hover:text-foreground border border-border rounded px-2 py-0.5 transition-colors"
                >
                  ⏸ Pause
                </button>
              ) : (
                <button
                  onClick={() => handleResume(w.id)}
                  className="text-[10px] text-primary hover:text-primary/80 border border-primary/30 rounded px-2 py-0.5 transition-colors"
                >
                  ▶️ Resume
                </button>
              )}
            </div>

            <div className="absolute bottom-4 right-4 opacity-25">
              <ChannelIcon channel={w.channel} className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Section = ({ title, items, color, icon }: { title: string; items: string[]; color: string; icon: string }) => (
  <div>
    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
      <span className={`${color} text-xs`}>{icon}</span>
      {title}
    </h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground group leading-relaxed">
          <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${color.replace("text-", "bg-")}`} />
          <span className="flex-1">{item}</span>
          <button className="text-xs text-muted-foreground/0 group-hover:text-muted-foreground transition-all hover:text-foreground">✏️</button>
        </li>
      ))}
    </ul>
  </div>
);

const SliderRow = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div>
    <div className="flex items-center justify-between text-sm mb-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}%</span>
    </div>
    <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-primary" />
  </div>
);

export default Workers;
