import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findings as initialFindings, workers as allWorkers, type Finding } from "@/data/mockData";
import { Check, Pencil } from "lucide-react";

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
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());
  const [workerToggles, setWorkerToggles] = useState<Record<string, boolean>>({
    w1: true, w2: true, w3: true, w4: false, w5: false,
  });
  const [channelX, setChannelX] = useState(false);
  const [channelReddit, setChannelReddit] = useState(false);

  const enabledCount = Object.values(workerToggles).filter(Boolean).length;
  const requiredConfirmed = findingsData.filter(f => f.required).every(f => confirmedIds.has(f.id));

  const handleResearch = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(1); }, 2000);
  };

  const confidenceBadge = (c: Finding["confidence"]) => {
    if (c === "confident") return { label: "🟢 Confident", className: "bg-success/15 text-success" };
    if (c === "needs-review") return { label: "🟡 Needs review", className: "bg-warning/15 text-warning" };
    return { label: "🔴 Missing", className: "bg-destructive/15 text-destructive" };
  };

  const updateFinding = (id: string, value: string) => {
    setFindings((f) => f.map((item) => item.id === id ? { ...item, value } : item));
    setEditingId(null);
  };

  const confirmFinding = (id: string) => {
    setConfirmedIds(prev => new Set(prev).add(id));
  };

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-10 h-[22px] rounded-full transition-all relative ${on ? "bg-primary" : "bg-muted"}`}
    >
      <span className={`absolute top-[3px] w-4 h-4 rounded-full transition-transform ${on ? "bg-primary-foreground left-[22px]" : "bg-muted-foreground left-[3px]"}`} />
    </button>
  );

  const inputClass = "w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 placeholder:text-muted-foreground transition-all";

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 relative">
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-10 relative z-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-all ${
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
            <h2 className="text-xl font-bold mb-1">Let's learn about your business</h2>
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
                <label className="block text-sm font-medium mb-1.5">What do you sell? <span className="text-muted-foreground">(optional)</span></label>
                <textarea value={whatYouSell} onChange={(e) => setWhatYouSell(e.target.value)} placeholder="Describe your product or service..." rows={3} className={`${inputClass} resize-none`} />
              </div>
              <button onClick={handleResearch} disabled={loading} className="w-full bg-primary text-primary-foreground font-semibold text-sm rounded-lg py-2.5 hover:opacity-90 transition-all disabled:opacity-50">
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
            <h2 className="text-xl font-bold mb-1">Here's what we learned</h2>
            <p className="text-sm text-muted-foreground mb-6">Confirm or edit what we found about your business</p>

            <div className="space-y-3 mb-6">
              {findingsData.map((f, i) => {
                const badge = confidenceBadge(f.confidence);
                const isConfirmed = confirmedIds.has(f.id);
                return (
                  <div
                    key={f.id}
                    className={`glass-card rounded-xl p-4 animate-fade-in transition-all ${isConfirmed ? "border-l-2 border-success" : "glow-border"}`}
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{f.emoji}</span>
                        <span className="text-sm font-semibold">{f.label}</span>
                        {f.required && <span className="text-[10px] text-destructive">*</span>}
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>

                    {editingId === f.id ? (
                      <div>
                        <textarea
                          autoFocus
                          defaultValue={f.value}
                          onBlur={(e) => updateFinding(f.id, e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && updateFinding(f.id, (e.target as HTMLTextAreaElement).value)}
                          rows={2}
                          className={`${inputClass} resize-none`}
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.value || <span className="italic">Not found</span>}</p>
                    )}

                    {editingId !== f.id && (
                      <div className="flex gap-3 mt-3">
                        {!isConfirmed && (
                          <button onClick={() => confirmFinding(f.id)} className="text-xs text-success hover:text-success/80 font-medium transition-colors flex items-center gap-1">
                            <Check className="w-3 h-3" /> That's right
                          </button>
                        )}
                        <button onClick={() => setEditingId(f.id)} className="text-xs text-info hover:text-info/80 font-medium transition-colors flex items-center gap-1">
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                        {isConfirmed && (
                          <span className="text-xs text-success font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Confirmed</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!requiredConfirmed}
              className="w-full bg-primary text-primary-foreground font-semibold text-sm rounded-lg py-2.5 hover:opacity-90 transition-all disabled:opacity-50"
            >
              Continue
            </button>
            {!requiredConfirmed && (
              <p className="text-[10px] text-muted-foreground text-center mt-2">Confirm all required fields (*) to continue</p>
            )}
          </div>
        )}

        {/* Step 3: Connect & Pick Workers */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-1">Connect your channels and pick your workers</h2>
            <p className="text-sm text-muted-foreground mb-6">Choose where your AI team will operate</p>

            <div className="glass-card rounded-xl p-4 mb-6 space-y-3">
              {[
                { label: "X (Twitter)", icon: "𝕏", connected: channelX, toggle: () => setChannelX(!channelX) },
                { label: "Reddit", icon: "🤖", connected: channelReddit, toggle: () => setChannelReddit(!channelReddit) },
                { label: "Email", icon: "📧", connected: false, toggle: () => {}, disabled: true },
              ].map((ch) => (
                <div key={ch.label} className={`flex items-center justify-between ${ch.disabled ? "opacity-40" : ""}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{ch.icon}</span>
                    <span className="text-sm font-medium">{ch.label}</span>
                    {ch.connected && <span className="text-[10px] text-success font-medium">Connected</span>}
                    {ch.disabled && <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Coming Soon</span>}
                  </div>
                  {!ch.disabled && <Toggle on={ch.connected} onToggle={ch.toggle} />}
                </div>
              ))}
            </div>

            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold">Choose your workers</span>
                <span className="text-xs text-muted-foreground">{enabledCount} of 3 enabled (Starter)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allWorkers.map((w) => {
                  const needsChannel = (w.channel === "X" && !channelX) || (w.channel === "Reddit" && !channelReddit);
                  return (
                    <div
                      key={w.id}
                      className={`glass-card rounded-xl p-4 transition-all glow-border ${
                        workerToggles[w.id] ? "border-primary/30" : ""
                      } ${needsChannel ? "opacity-40" : ""}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{w.emoji}</span>
                          <span className="text-sm font-semibold">{w.name}</span>
                        </div>
                        {!needsChannel ? (
                          <Toggle
                            on={workerToggles[w.id]}
                            onToggle={() => {
                              if (workerToggles[w.id] || enabledCount < 3) {
                                setWorkerToggles((t) => ({ ...t, [w.id]: !t[w.id] }));
                              }
                            }}
                          />
                        ) : (
                          <span className="text-[10px] text-warning font-medium">Connect {w.channel} first</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{w.description}</p>
                      <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        w.channel === "X" ? "bg-info/15 text-info" : "bg-warning/15 text-warning"
                      }`}>
                        {w.channel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button onClick={() => navigate("/app")} className="w-full bg-primary text-primary-foreground font-semibold text-sm rounded-lg py-2.5 hover:opacity-90 transition-all">
              Start Working →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
