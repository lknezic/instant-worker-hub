import { useState } from "react";
import { invoices } from "@/data/mockData";
import { Check } from "lucide-react";

const tabsList = ["Business Profile", "Voice & Compliance", "Channels", "Content", "Billing"];

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-5 pb-0 border-b border-border shrink-0">
        <h2 className="font-display text-lg font-bold mb-4">Settings</h2>
        <div className="flex gap-6 overflow-x-auto">
          {tabsList.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                activeTab === i ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-xl animate-fade-in">
          {activeTab === 0 && <BusinessProfile />}
          {activeTab === 1 && <VoiceCompliance />}
          {activeTab === 2 && <Channels />}
          {activeTab === 3 && <ContentTab />}
          {activeTab === 4 && <Billing />}
        </div>
      </div>
    </div>
  );
};

const inputClass = "w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all";

const Input = ({ label, defaultValue, multiline }: { label: string; defaultValue: string; multiline?: boolean }) => (
  <div>
    <label className="block text-sm font-medium mb-1.5">{label}</label>
    {multiline ? (
      <textarea defaultValue={defaultValue} rows={3} className={`${inputClass} resize-none`} />
    ) : (
      <input defaultValue={defaultValue} className={inputClass} />
    )}
  </div>
);

const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    className={`w-10 h-[22px] rounded-full transition-all relative ${on ? "bg-primary btn-glow" : "bg-muted"}`}
  >
    <span className={`absolute top-[3px] w-4 h-4 rounded-full transition-transform ${on ? "bg-primary-foreground left-[22px]" : "bg-muted-foreground left-[3px]"}`} />
  </button>
);

const TagInput = ({ tags: initialTags, placeholder }: { tags: string[]; placeholder?: string }) => {
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState("");

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-wrap gap-1.5 bg-background/30 border border-border rounded-lg px-3 py-2.5">
      {tags.map((t) => (
        <span key={t} className="text-xs bg-card border border-border px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
          {t}
          <button onClick={() => removeTag(t)} className="text-muted-foreground hover:text-foreground transition-colors">×</button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
        placeholder={tags.length === 0 ? placeholder : "Add..."}
        className="flex-1 min-w-[80px] bg-transparent text-xs outline-none placeholder:text-muted-foreground py-1"
      />
    </div>
  );
};

const SaveBtn = () => (
  <button className="bg-primary text-primary-foreground text-sm font-display font-semibold rounded-lg px-5 py-2.5 btn-glow hover:opacity-90 transition-all">
    Save
  </button>
);

const BusinessProfile = () => (
  <div className="space-y-4">
    <Input label="Business Name" defaultValue="Acme SaaS Co" />
    <Input label="Website" defaultValue="https://acmesaas.com" />
    <Input label="Description" defaultValue="AI-powered marketing automation for B2B SaaS companies" multiline />
    <Input label="Target Audience" defaultValue="B2B SaaS founders and marketing leaders" />
    <Input label="90-Day Outcome" defaultValue="Establish thought leadership and generate 50 qualified leads per month" multiline />
    <Input label="Current Offers" defaultValue="14-day free trial, annual discount" />
    <SaveBtn />
  </div>
);

const VoiceCompliance = () => {
  const [regulated, setRegulated] = useState(false);
  return (
    <div className="space-y-4">
      <Input label="Voice & Tone" defaultValue="Professional but approachable, data-driven, slightly contrarian" multiline />
      <div>
        <label className="block text-sm font-medium mb-1.5">Forbidden Topics</label>
        <TagInput tags={["Politics", "Religion", "Competitor bashing"]} placeholder="Add forbidden topic..." />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Required Disclaimers</label>
        <TagInput tags={["Not financial advice", "Results may vary"]} placeholder="Add disclaimer..." />
      </div>
      <div className="flex items-center justify-between glass-card rounded-lg p-4">
        <div>
          <span className="text-sm font-medium">Regulated Industry</span>
          <p className="text-xs text-muted-foreground mt-0.5">Enable extra compliance checks</p>
        </div>
        <Toggle on={regulated} onToggle={() => setRegulated(!regulated)} />
      </div>
      <SaveBtn />
    </div>
  );
};

const Channels = () => {
  const [xConnected, setXConnected] = useState(true);
  const [redditConnected, setRedditConnected] = useState(true);
  return (
    <div className="space-y-3">
      <div className="glass-card rounded-xl p-4 glow-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">𝕏</span>
            <div>
              <span className="text-sm font-medium">X (Twitter)</span>
              {xConnected && <span className="text-xs text-muted-foreground ml-2">@acmesaas</span>}
            </div>
          </div>
          {xConnected ? (
            <button onClick={() => setXConnected(false)} className="text-xs text-destructive hover:text-destructive/80 border border-destructive/30 rounded-lg px-3 py-1.5 font-medium transition-colors">
              Disconnect
            </button>
          ) : (
            <button onClick={() => setXConnected(true)} className="text-xs bg-primary text-primary-foreground rounded-lg px-3 py-1.5 font-semibold hover:opacity-90 transition-all">
              Connect
            </button>
          )}
        </div>
        {xConnected && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success neon-dot-green" />
            <span className="text-[10px] text-success font-medium">Connected</span>
          </div>
        )}
      </div>

      <div className="glass-card rounded-xl p-4 glow-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">🤖</span>
            <div>
              <span className="text-sm font-medium">Reddit</span>
              {redditConnected && <span className="text-xs text-muted-foreground ml-2">u/acmesaas</span>}
            </div>
          </div>
          {redditConnected ? (
            <button onClick={() => setRedditConnected(false)} className="text-xs text-destructive hover:text-destructive/80 border border-destructive/30 rounded-lg px-3 py-1.5 font-medium transition-colors">
              Disconnect
            </button>
          ) : (
            <button onClick={() => setRedditConnected(true)} className="text-xs bg-primary text-primary-foreground rounded-lg px-3 py-1.5 font-semibold hover:opacity-90 transition-all">
              Connect
            </button>
          )}
        </div>
        {redditConnected && (
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-success neon-dot-green" />
            <span className="text-[10px] text-success font-medium">Connected</span>
          </div>
        )}
      </div>

      <div className="glass-card rounded-xl p-4 opacity-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">📧</span>
            <span className="text-sm font-medium">Email</span>
          </div>
          <span className="text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

const ContentTab = () => {
  const [mixes, setMixes] = useState({
    educational: 30, story: 25, opinion: 15, market: 10, engagement: 15, promo: 5,
  });

  const total = Object.values(mixes).reduce((a, b) => a + b, 0);

  const updateMix = (key: keyof typeof mixes, value: number) => {
    setMixes((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">Topics</label>
        <TagInput
          tags={["Growth marketing", "Content strategy", "B2B sales", "Product-led growth", "SaaS metrics", "Copywriting", "Email marketing", "SEO", "Social media", "Analytics"]}
          placeholder="Add topic..."
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-display font-semibold">Content Mix</span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            total === 100 ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
          }`}>
            Total: {total}%
          </span>
        </div>
        {([
          { key: "educational" as const, label: "Educational" },
          { key: "story" as const, label: "Story" },
          { key: "opinion" as const, label: "Opinion" },
          { key: "market" as const, label: "Market Commentary" },
          { key: "engagement" as const, label: "Engagement" },
          { key: "promo" as const, label: "Promo" },
        ]).map((s) => (
          <div key={s.key}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-display font-medium">{mixes[s.key]}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={mixes[s.key]}
              onChange={(e) => updateMix(s.key, +e.target.value)}
              className="w-full accent-primary"
            />
          </div>
        ))}
      </div>
      <div>
        <span className="text-sm font-display font-semibold block mb-3">Skills</span>
        <div className="grid grid-cols-2 gap-2">
          {["value-tweet", "contrarian-hook", "thread-opener", "thoughtful-reply", "helpful-answer", "resource-drop", "case-study", "story-tweet"].map((s) => (
            <label key={s} className="flex items-center gap-2.5 text-sm text-muted-foreground cursor-pointer glass-card rounded-lg px-3 py-2 glow-border">
              <input type="checkbox" defaultChecked className="accent-primary" />
              <span className="font-medium">{s}</span>
            </label>
          ))}
        </div>
      </div>
      <SaveBtn />
    </div>
  );
};

const Billing = () => (
  <div className="space-y-6">
    <div className="glass-card-strong rounded-xl p-5 gradient-border">
      <div className="flex items-center justify-between mb-1">
        <div>
          <span className="font-display font-bold text-lg">Growth Plan</span>
          <span className="text-sm text-muted-foreground ml-2">$249/mo</span>
        </div>
        <button className="text-xs bg-primary text-primary-foreground px-4 py-2 rounded-lg btn-glow hover:opacity-90 transition-all font-display font-semibold">
          Change Plan
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Renews April 1, 2026</p>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Posts this month</span>
            <span className="text-foreground font-medium">247 / 450</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: "55%", boxShadow: "var(--glow-primary-subtle)" }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="glass-card rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Workers</span>
            <p className="text-sm font-semibold mt-1">4 / 10 <span className="text-xs text-muted-foreground font-normal">enabled</span></p>
          </div>
          <div className="glass-card rounded-lg p-3">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Channels</span>
            <p className="text-sm font-semibold mt-1">2 / 2 <span className="text-xs text-muted-foreground font-normal">connected</span></p>
          </div>
        </div>
      </div>
    </div>

    <div className="flex">
      <a href="#" className="text-xs text-primary hover:text-primary/80 font-semibold transition-colors">
        Manage in Stripe →
      </a>
    </div>

    <div>
      <h3 className="font-display font-semibold text-sm mb-3">Invoices</h3>
      <div className="space-y-2">
        {invoices.map((inv) => (
          <div key={inv.id} className="glass-card rounded-lg px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{inv.date}</span>
            <span className="font-display font-medium">{inv.amount}</span>
            <span className="text-[10px] font-semibold text-success bg-success/15 px-2 py-0.5 rounded-full">{inv.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Settings;
