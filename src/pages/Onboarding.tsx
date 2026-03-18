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
    c === "sure" ? "bg-success/20 text-success" : c === "guess" ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive";

  const updateFinding = (id: string, value: string) => {
    setFindings((f) => f.map((item) => item.id === id ? { ...item, value } : item));
    setEditingId(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl">
        {/* Step 1: Research */}
        {step === 0 && (
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-1">Let's learn about your business</h2>
            <p className="text-sm text-muted-foreground mb-6">We'll research your business to set up your workers</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Website URL</label>
                <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://yourcompany.com" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">X Handle <span className="text-muted-foreground">(optional)</span></label>
                <input value={xHandle} onChange={(e) => setXHandle(e.target.value)} placeholder="@yourhandle" className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">What do you sell?</label>
                <textarea value={whatYouSell} onChange={(e) => setWhatYouSell(e.target.value)} placeholder="Describe your product or service..." rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground resize-none" />
              </div>
              <button onClick={handleResearch} disabled={loading} className="w-full bg-primary text-primary-foreground font-medium text-sm rounded-md py-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? (
                  <span className="flex items-center justify-center gap-1">
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
            <h2 className="text-xl font-semibold mb-1">Review our findings</h2>
            <p className="text-sm text-muted-foreground mb-6">Confirm or edit what we found about your business</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {findingsData.map((f) => (
                <div key={f.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{f.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${confidenceColor(f.confidence)}`}>
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
                      className="w-full bg-background border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    />
                  ) : (
                    <p className="text-sm">{f.value}</p>
                  )}
                  <div className="flex gap-2 mt-3">
                    {editingId !== f.id && (
                      <>
                        <button className="text-xs text-success hover:underline">That's right ✓</button>
                        <button onClick={() => setEditingId(f.id)} className="text-xs text-info hover:underline">Edit</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setStep(2)} className="w-full bg-primary text-primary-foreground font-medium text-sm rounded-md py-2 hover:opacity-90 transition-opacity">
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Connect & Pick Workers */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-1">Connect channels & pick workers</h2>
            <p className="text-sm text-muted-foreground mb-6">Choose where your workers will post</p>

            <div className="bg-card border border-border rounded-lg p-4 mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">𝕏</span>
                  <span className="text-sm font-medium">X (Twitter)</span>
                </div>
                <div className="flex items-center gap-2">
                  {channelX && <span className="text-xs text-success">Connected</span>}
                  <button onClick={() => setChannelX(!channelX)} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${channelX ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                    {channelX ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🤖</span>
                  <span className="text-sm font-medium">Reddit</span>
                </div>
                <div className="flex items-center gap-2">
                  {channelReddit && <span className="text-xs text-success">Connected</span>}
                  <button onClick={() => setChannelReddit(!channelReddit)} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${channelReddit ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                    {channelReddit ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Choose your workers</span>
                <span className="text-xs text-muted-foreground">{enabledCount} of 3 workers enabled</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allWorkers.map((w) => (
                  <div key={w.id} className={`bg-card border rounded-lg p-4 transition-colors ${workerToggles[w.id] ? "border-primary/50" : "border-border"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{w.emoji}</span>
                        <span className="text-sm font-medium">{w.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (workerToggles[w.id] || enabledCount < 3) {
                            setWorkerToggles((t) => ({ ...t, [w.id]: !t[w.id] }));
                          }
                        }}
                        className={`w-9 h-5 rounded-full transition-colors relative ${workerToggles[w.id] ? "bg-primary" : "bg-muted"}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${workerToggles[w.id] ? "left-[18px]" : "left-0.5"}`} />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{w.description}</p>
                    <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${w.channel === "X" ? "bg-info/20 text-info" : "bg-warning/20 text-warning"}`}>
                      {w.channel}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={() => navigate("/app")} className="w-full bg-primary text-primary-foreground font-medium text-sm rounded-md py-2 hover:opacity-90 transition-opacity">
              Start Working
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
