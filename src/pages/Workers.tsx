import { useState } from "react";
import { workers as allWorkers, workerLearning, activityLog } from "@/data/mockData";

const Workers = () => {
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"learning" | "activity" | "settings">("learning");
  const [volume, setVolume] = useState(5);
  const [eduMix, setEduMix] = useState(40);
  const [storyMix, setStoryMix] = useState(35);
  const [opinionMix, setOpinionMix] = useState(25);
  const [autonomy, setAutonomy] = useState("L2");
  const [suggestions, setSuggestions] = useState(workerLearning.suggestions);

  const worker = allWorkers.find((w) => w.id === selectedWorker);

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

  if (selectedWorker && worker) {
    return (
      <div className="h-full flex flex-col animate-fade-in">
        <div className="px-6 py-3 border-b border-border flex items-center gap-4 shrink-0 bg-card/30">
          <button onClick={() => setSelectedWorker(null)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">← Back</button>
          <div className="w-px h-4 bg-border" />
          <span className="text-lg">{worker.emoji}</span>
          <span className="font-display font-semibold text-sm">{worker.name}</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(worker.status)}`}>{worker.status}</span>
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
              <Section title="Doing More Of" items={workerLearning.doingMore} color="text-success" />
              <Section title="Stopped Doing" items={workerLearning.stoppedDoing} color="text-destructive" />
              <Section title="Your Feedback" items={workerLearning.feedback} color="text-info" />

              <div>
                <h3 className="font-display font-semibold text-sm mb-3">Suggestions</h3>
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
                <h3 className="font-display font-semibold text-sm mb-3">Improvement Timeline</h3>
                <div className="glass-card rounded-lg p-4 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Week 1: 1.2%</span>
                    <span className="text-muted-foreground/40">→</span>
                    <span className="text-muted-foreground">Week 2: 1.8%</span>
                    <span className="text-success text-xs font-medium">(+50%)</span>
                    <span className="text-muted-foreground/40">→</span>
                    <span className="text-foreground font-medium">Week 3: 2.3%</span>
                    <span className="text-success text-xs font-medium">(+28%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="max-w-2xl space-y-2">
              {activityLog.map((a, i) => (
                <div key={a.id} className="glass-card rounded-lg p-3.5 flex items-start gap-3 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(a.status)}`}>{a.status}</span>
                      <span className="text-xs text-muted-foreground">{a.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{a.content}</p>
                    {a.metrics && (
                      <p className="text-[11px] text-muted-foreground/70 mt-1.5">
                        👁 {a.metrics.views.toLocaleString()} · 🔖 {a.metrics.saves} · 💬 {a.metrics.comments}
                      </p>
                    )}
                  </div>
                  {a.rating > 0 && (
                    <span className="text-xs text-primary font-display font-semibold shrink-0">★ {a.rating}/10</span>
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
                  <span className="text-primary font-display font-semibold">{volume} posts/day</span>
                </label>
                <input type="range" min={1} max={10} value={volume} onChange={(e) => setVolume(+e.target.value)} className="w-full accent-primary" />
              </div>

              <div className="space-y-3">
                <span className="text-sm font-display font-semibold">Content Mix</span>
                <SliderRow label="Educational" value={eduMix} onChange={setEduMix} />
                <SliderRow label="Story" value={storyMix} onChange={setStoryMix} />
                <SliderRow label="Opinion" value={opinionMix} onChange={setOpinionMix} />
              </div>

              <div>
                <span className="text-sm font-display font-semibold block mb-3">Autonomy Level</span>
                <div className="space-y-2">
                  {[{ v: "L1", l: "Draft Only", desc: "All content needs your approval" }, { v: "L2", l: "Semi-Auto", desc: "High-confidence posts auto-publish" }, { v: "L3", l: "Full Auto", desc: "Complete autonomy" }].map((o) => (
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

              <button className="bg-primary text-primary-foreground text-sm font-display font-semibold rounded-lg px-5 py-2.5 btn-glow hover:opacity-90 transition-all">
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
        <h2 className="font-display text-lg font-bold">Workers</h2>
        <button disabled className="text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg cursor-not-allowed font-medium">
          Office View <span className="text-[10px] ml-1 text-muted-foreground/50">Coming Soon</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allWorkers.map((w, i) => (
          <div key={w.id} className="glass-card rounded-xl p-5 glow-border animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{w.emoji}</span>
                <span className="font-display font-semibold">{w.name}</span>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge(w.status)}`}>{w.status}</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <span>{w.postsThisWeek} posts this week</span>
              <span className="text-primary font-medium">★ {w.avgRating}/10</span>
            </div>
            <p className="text-xs text-muted-foreground/80 italic leading-relaxed mb-4">"{w.latestLearning}"</p>
            <button
              onClick={() => { setSelectedWorker(w.id); setActiveTab("learning"); }}
              className="text-xs text-primary hover:text-primary/80 font-display font-semibold transition-colors"
            >
              Open →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Section = ({ title, items, color }: { title: string; items: string[]; color: string }) => (
  <div>
    <h3 className="font-display font-semibold text-sm mb-3">{title}</h3>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground group leading-relaxed">
          <span className={`mt-1.5 w-1 h-1 rounded-full shrink-0 ${color.replace("text-", "bg-")}`} />
          <span className="flex-1">{item}</span>
          <button className="text-xs text-muted-foreground/0 group-hover:text-muted-foreground transition-all hover:text-foreground">✎</button>
        </li>
      ))}
    </ul>
  </div>
);

const SliderRow = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div>
    <div className="flex items-center justify-between text-sm mb-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-display font-medium">{value}%</span>
    </div>
    <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-primary" />
  </div>
);

export default Workers;
