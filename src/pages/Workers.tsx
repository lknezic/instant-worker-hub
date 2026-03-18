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
      active: "bg-success/20 text-success",
      paused: "bg-muted text-muted-foreground",
      posted: "bg-success/20 text-success",
      pending: "bg-warning/20 text-warning",
      approved: "bg-info/20 text-info",
      rejected: "bg-destructive/20 text-destructive",
    };
    return colors[s] || "bg-muted text-muted-foreground";
  };

  if (selectedWorker && worker) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-6 py-3 border-b border-border flex items-center gap-4 shrink-0">
          <button onClick={() => setSelectedWorker(null)} className="text-sm text-muted-foreground hover:text-foreground">← Back</button>
          <span className="text-lg">{worker.emoji}</span>
          <span className="font-semibold text-sm">{worker.name}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(worker.status)}`}>{worker.status}</span>
        </div>

        <div className="px-6 pt-4 border-b border-border shrink-0">
          <div className="flex gap-4">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
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
            <div className="max-w-2xl space-y-6">
              <Section title="Doing More Of" items={workerLearning.doingMore} />
              <Section title="Stopped Doing" items={workerLearning.stoppedDoing} />
              <Section title="Your Feedback" items={workerLearning.feedback} />

              <div>
                <h3 className="text-sm font-semibold mb-3">Suggestions</h3>
                <div className="space-y-2">
                  {suggestions.map((s) => (
                    <label key={s.id} className="flex items-start gap-2.5 bg-card border border-border rounded-md p-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={s.applied}
                        onChange={() => setSuggestions((prev) => prev.map((item) => item.id === s.id ? { ...item, applied: !item.applied } : item))}
                        className="mt-0.5 accent-primary"
                      />
                      <span className={`text-sm ${s.applied ? "text-muted-foreground line-through" : ""}`}>{s.text}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3">Improvement Timeline</h3>
                <div className="bg-card border border-border rounded-md p-4 text-sm text-muted-foreground">
                  Week 1: 1.2% → Week 2: 1.8% <span className="text-success">(+50%)</span> → Week 3: 2.3% <span className="text-success">(+28%)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activity" && (
            <div className="max-w-2xl space-y-2">
              {activityLog.map((a) => (
                <div key={a.id} className="bg-card border border-border rounded-md p-3 flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(a.status)}`}>{a.status}</span>
                      <span className="text-xs text-muted-foreground">{a.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                    {a.metrics && (
                      <p className="text-xs text-muted-foreground mt-1">
                        👁 {a.metrics.views.toLocaleString()} · 🔖 {a.metrics.saves} · 💬 {a.metrics.comments}
                      </p>
                    )}
                  </div>
                  {a.rating > 0 && (
                    <span className="text-xs text-primary shrink-0">★ {a.rating}/10</span>
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
                  <span className="text-muted-foreground">{volume} posts/day</span>
                </label>
                <input type="range" min={1} max={10} value={volume} onChange={(e) => setVolume(+e.target.value)} className="w-full accent-primary" />
              </div>

              <div className="space-y-3">
                <span className="text-sm font-medium">Content Mix</span>
                <SliderRow label="Educational" value={eduMix} onChange={setEduMix} />
                <SliderRow label="Story" value={storyMix} onChange={setStoryMix} />
                <SliderRow label="Opinion" value={opinionMix} onChange={setOpinionMix} />
              </div>

              <div>
                <span className="text-sm font-medium block mb-2">Autonomy Level</span>
                <div className="space-y-2">
                  {[{ v: "L1", l: "Draft Only" }, { v: "L2", l: "Semi-Auto" }, { v: "L3", l: "Full Auto" }].map((o) => (
                    <label key={o.v} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="radio" name="autonomy" value={o.v} checked={autonomy === o.v} onChange={() => setAutonomy(o.v)} className="accent-primary" />
                      {o.v} — {o.l}
                    </label>
                  ))}
                </div>
              </div>

              <button className="bg-primary text-primary-foreground text-sm font-medium rounded-md px-4 py-2 hover:opacity-90 transition-opacity">
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
        <h2 className="text-lg font-semibold">Workers</h2>
        <button disabled className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-md cursor-not-allowed">
          🏢 Office View <span className="text-xs ml-1 opacity-60">Coming Soon</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {allWorkers.map((w) => (
          <div key={w.id} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{w.emoji}</span>
                <span className="text-sm font-semibold">{w.name}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusBadge(w.status)}`}>{w.status}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">This week: {w.postsThisWeek} posts · Avg rating: {w.avgRating}/10</p>
            <p className="text-xs text-muted-foreground italic mb-3">"{w.latestLearning}"</p>
            <button onClick={() => { setSelectedWorker(w.id); setActiveTab("learning"); }} className="text-xs text-primary hover:underline">Open →</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Section = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h3 className="text-sm font-semibold mb-3">{title}</h3>
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground group">
          <span className="text-primary mt-0.5 text-xs">•</span>
          <span className="flex-1">{item}</span>
          <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground">✎</button>
        </li>
      ))}
    </ul>
  </div>
);

const SliderRow = ({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) => (
  <div>
    <div className="flex items-center justify-between text-sm mb-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-muted-foreground">{value}%</span>
    </div>
    <input type="range" min={0} max={100} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-primary" />
  </div>
);

export default Workers;
