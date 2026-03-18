import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findings as initialFindings, workers as allWorkers, type Finding } from "@/data/mockData";

const steps = ["Research", "Review Findings", "Connect & Pick Workers"];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [website, setWebsite] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [whatYouSell, setWhatYouSell] = useState("");
  const [findingsData, setFindings] = useState<Finding[]>(initialFindings);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [workerToggles, setWorkerToggles] = useState<Record<string, boolean>>({
    w1: true, w2: true, w3: true, w4: false, w5: false,
  });
  const [channelX, setChannelX] = useState(false);
  const [channelReddit, setChannelReddit] = useState(false);

  const enabledCount = Object.values(workerToggles).filter(Boolean).length;

  const handleResearch = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(1); }, 2000);
  };

  const confidenceColor = (c: Finding["confidence"]) =>
    c === "sure" ? "bg-success/15 text-success" : c === "guess" ? "bg-warning/15 text-warning" : "bg-destructive/15 text-destructive";

  const updateFinding = (id: string, value: string) => {
    setFindings((f) => f.map((item) => item.id === id ? { ...item, value } : item));
    setEditingId(null);
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-10 h-[22px] rounded-full transition-all relative ${on ? "bg-primary btn-glow" : "bg-muted"}`}
    >
      <span className={`absolute top-[3px] w-4 h-4 rounded-full transition-transform ${on ? "bg-primary-foreground left-[22px]" : "bg-muted-foreground left-[3px]"}`} />
    </button>
  );

  const inputClass = "w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 placeholder:text-muted-foreground transition-all";

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 bg-grid bg-radial-top relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10 relative z-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-semibold transition-all ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            } ${i === step ? "pulse-ring" : ""}`}>
              {i + 1}
            </div>
            <span className={`text-sm hidden sm:inline font-medium ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className={`w-10 h-px ${i < step ? "bg-primary/50" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl relative z-10 animate-fade-in">
        {/* Step 1: Research */}
        {step === 0 && (
          <div className="glass-card-strong rounded-xl p-6 gradient-border">
            <h2 className="font-display text-xl font-bold mb-1">Let's learn about your business</h2>
            <p className="text-sm text-muted-foreground mb-6">We'll research your business to set up your AI workers</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Website URL</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourcompany.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">X Handle <span className="text-muted-foreground">(optional)</span></label>
                <input value={xHandle} onChange={(e) => setXHandle(e.target.value)} placeholder="@yourhandle" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">What do you sell?</label>
                <textarea value={whatYouSell} onChange={(e) => setWhatYouSell(e.target.value)} placeholder="Describe your product or service..." rows={3} className={`${inputClass} resize-none`} />
              </div>
              <button onClick={handleResearch} disabled={loading} className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm rounded-lg py-2.5 btn-glow hover:opacity-90 transition-all disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    Researching
                    <span className="inline-flex gap-0.5">
                      <span className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse-dot" style={{ animationDelay: "0s" }} />
                      <span className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
                      <span className="w-1 h-1 bg-primary-foreground rounded-full animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
                    </span>
                  </span>
                ) : "Research My Business"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review Findings */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-1">Review our findings</h2>
            <p className="text-sm text-muted-foreground mb-6">Confirm or edit what we found about your business</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {findingsData.map((f, i) => (
                <div
                  key={f.id}
                  className="glass-card rounded-xl p-4 glow-border animate-fade-in"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-widest">{f.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${confidenceColor(f.confidence)}`}>
                      {f.confidence}
                    </span>
                  </div>
                  {editingId === f.id ? (
                    <textarea
                      autoFocus
                      defaultValue={f.value}
                      onBlur={(e) => updateFinding(f.id, e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && updateFinding(f.id, (e.target as HTMLTextAreaElement).value)}
                      rows={2}
                      className={`${inputClass} resize-none`}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed">{f.value}</p>
                  )}
                  <div className="flex gap-3 mt-3">
                    {editingId !== f.id && (
                      <>
                        <button className="text-xs text-success hover:text-success/80 font-medium transition-colors">✓ Correct</button>
                        <button onClick={() => setEditingId(f.id)} className="text-xs text-info hover:text-info/80 font-medium transition-colors">Edit</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm rounded-lg py-2.5 btn-glow hover:opacity-90 transition-all">
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Connect & Pick Workers */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-xl font-bold mb-1">Connect channels & pick workers</h2>
            <p className="text-sm text-muted-foreground mb-6">Choose where your AI team will operate</p>

            <div className="glass-card rounded-xl p-4 mb-6 space-y-3">
              {[
                { label: "X (Twitter)", icon: "𝕏", connected: channelX, toggle: () => setChannelX(!channelX) },
                { label: "Reddit", icon: "🤖", connected: channelReddit, toggle: () => setChannelReddit(!channelReddit) },
              ].map((ch) => (
                <div key={ch.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{ch.icon}</span>
                    <span className="text-sm font-medium">{ch.label}</span>
                    {ch.connected && <span className="text-[10px] text-success font-medium">Connected</span>}
                  </div>
                  <Toggle on={ch.connected} onToggle={ch.toggle} />
                </div>
              ))}
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-display font-semibold">Choose your workers</span>
                <span className="text-xs text-muted-foreground">{enabledCount} of 3 enabled</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allWorkers.map((w) => (
                  <div
                    key={w.id}
                    className={`glass-card rounded-xl p-4 transition-all glow-border ${
                      workerToggles[w.id] ? "border-primary/30" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{w.emoji}</span>
                        <span className="text-sm font-display font-semibold">{w.name}</span>
                      </div>
                      <Toggle
                        on={workerToggles[w.id]}
                        onToggle={() => {
                          if (workerToggles[w.id] || enabledCount < 3) {
                            setWorkerToggles((t) => ({ ...t, [w.id]: !t[w.id] }));
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{w.description}</p>
                    <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      w.channel === "X" ? "bg-info/15 text-info" : "bg-warning/15 text-warning"
                    }`}>
                      {w.channel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => navigate("/app")} className="w-full bg-primary text-primary-foreground font-display font-semibold text-sm rounded-lg py-2.5 btn-glow hover:opacity-90 transition-all">
              Start Working
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
