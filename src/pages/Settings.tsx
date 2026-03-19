import { useState, useEffect } from "react";
import { invoices as mockInvoices } from "@/data/mockData";
import { settings as settingsApi } from "@/lib/api";
import { Check } from "lucide-react";
import { toast } from "sonner";

const tabsList = ["Business Profile", "Voice & Compliance", "Channels", "Content", "Billing"];

// Shared settings state loaded from API
interface SettingsData {
  business_name?: string;
  website?: string;
  description?: string;
  target_audience?: string;
  ninety_day_outcome?: string;
  current_offers?: string;
  voice_tone?: string;
  forbidden_topics?: string[];
  required_disclaimers?: string[];
  regulated_industry?: boolean;
  topics?: string[];
  content_mix?: Record<string, number>;
  skills?: string[];
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [settingsData, setSettingsData] = useState<SettingsData>({});
  const [loaded, setLoaded] = useState(false);

  // Fetch settings from API on mount, fall back to defaults
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await settingsApi.get() as any;
        if (!cancelled && data) {
          setSettingsData(data);
        }
      } catch {
        // API not available — keep defaults
      }
      if (!cancelled) setLoaded(true);
    })();
    return () => { cancelled = true; };
  }, []);

  const saveSettings = async (updates: Partial<SettingsData>) => {
    const merged = { ...settingsData, ...updates };
    setSettingsData(merged);
    try {
      await settingsApi.update(updates);
      toast("✅ Settings saved", { duration: 2000 });
    } catch {
      toast("Settings saved locally (backend offline)", { duration: 2000 });
    }
  };

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
          {activeTab === 0 && <BusinessProfile data={settingsData} onSave={saveSettings} />}
          {activeTab === 1 && <VoiceCompliance data={settingsData} onSave={saveSettings} />}
          {activeTab === 2 && <Channels />}
          {activeTab === 3 && <ContentTab data={settingsData} onSave={saveSettings} />}
          {activeTab === 4 && <Billing />}
        </div>
      </div>
    </div>
  );
};

const inputClass = "w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all";

const ControlledInput = ({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) => (
  <div>
    <label className="block text-sm font-medium mb-1.5">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={`${inputClass} resize-none`} />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputClass} />
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

const TagInput = ({ tags: initialTags, placeholder, onChange }: { tags: string[]; placeholder?: string; onChange?: (tags: string[]) => void }) => {
  const [tags, setTags] = useState(initialTags);
  const [input, setInput] = useState("");

  // Sync when initial tags change from API
  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      const next = [...tags, input.trim()];
      setTags(next);
      setInput("");
      onChange?.(next);
    }
  };

  const removeTag = (tag: string) => {
    const next = tags.filter((t) => t !== tag);
    setTags(next);
    onChange?.(next);
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

const BusinessProfile = ({ data, onSave }: { data: SettingsData; onSave: (u: Partial<SettingsData>) => void }) => {
  const [name, setName] = useState(data.business_name || "Acme SaaS Co");
  const [website, setWebsite] = useState(data.website || "https://acmesaas.com");
  const [description, setDescription] = useState(data.description || "AI-powered marketing automation for B2B SaaS companies");
  const [audience, setAudience] = useState(data.target_audience || "B2B SaaS founders and marketing leaders");
  const [outcome, setOutcome] = useState(data.ninety_day_outcome || "Establish thought leadership and generate 50 qualified leads per month");
  const [offers, setOffers] = useState(data.current_offers || "14-day free trial, annual discount");

  // Sync from API when data loads
  useEffect(() => {
    if (data.business_name) setName(data.business_name);
    if (data.website) setWebsite(data.website);
    if (data.description) setDescription(data.description);
    if (data.target_audience) setAudience(data.target_audience);
    if (data.ninety_day_outcome) setOutcome(data.ninety_day_outcome);
    if (data.current_offers) setOffers(data.current_offers);
  }, [data]);

  return (
    <div className="space-y-4">
      <ControlledInput label="Business Name" value={name} onChange={setName} />
      <ControlledInput label="Website" value={website} onChange={setWebsite} />
      <ControlledInput label="Description" value={description} onChange={setDescription} multiline />
      <ControlledInput label="Target Audience" value={audience} onChange={setAudience} />
      <ControlledInput label="90-Day Outcome" value={outcome} onChange={setOutcome} multiline />
      <ControlledInput label="Current Offers" value={offers} onChange={setOffers} />
      <button
        onClick={() => onSave({ business_name: name, website, description, target_audience: audience, ninety_day_outcome: outcome, current_offers: offers })}
        className="bg-primary text-primary-foreground text-sm font-display font-semibold rounded-lg px-5 py-2.5 btn-glow hover:opacity-90 transition-all"
      >
        Save
      </button>
    </div>
  );
};

const VoiceCompliance = ({ data, onSave }: { data: SettingsData; onSave: (u: Partial<SettingsData>) => void }) => {
  const [voice, setVoice] = useState(data.voice_tone || "Professional but approachable, data-driven, slightly contrarian");
  const [forbidden, setForbidden] = useState(data.forbidden_topics || ["Politics", "Religion", "Competitor bashing"]);
  const [disclaimers, setDisclaimers] = useState(data.required_disclaimers || ["Not financial advice", "Results may vary"]);
  const [regulated, setRegulated] = useState(data.regulated_industry || false);

  useEffect(() => {
    if (data.voice_tone) setVoice(data.voice_tone);
    if (data.forbidden_topics) setForbidden(data.forbidden_topics);
    if (data.required_disclaimers) setDisclaimers(data.required_disclaimers);
    if (data.regulated_industry !== undefined) setRegulated(data.regulated_industry);
  }, [data]);

  return (
    <div className="space-y-4">
      <ControlledInput label="Voice & Tone" value={voice} onChange={setVoice} multiline />
      <div>
        <label className="block text-sm font-medium mb-1.5">Forbidden Topics</label>
        <TagInput tags={forbidden} placeholder="Add forbidden topic..." onChange={setForbidden} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Required Disclaimers</label>
        <TagInput tags={disclaimers} placeholder="Add disclaimer..." onChange={setDisclaimers} />
      </div>
      <div className="flex items-center justify-between glass-card rounded-lg p-4">
        <div>
          <span className="text-sm font-medium">Regulated Industry</span>
          <p className="text-xs text-muted-foreground mt-0.5">Enable extra compliance checks</p>
        </div>
        <Toggle on={regulated} onToggle={() => setRegulated(!regulated)} />
      </div>
      <button
        onClick={() => onSave({ voice_tone: voice, forbidden_topics: forbidden, required_disclaimers: disclaimers, regulated_industry: regulated })}
        className="bg-primary text-primary-foreground text-sm font-display font-semibold rounded-lg px-5 py-2.5 btn-glow hover:opacity-90 transition-all"
      >
        Save
      </button>
    </div>
  );
};

const Channels = () => {
  const [xConnected, setXConnected] = useState(true);
  const [redditConnected, setRedditConnected] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
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

      <div className="glass-card rounded-xl p-4 glow-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg">📧</span>
            <div>
              <span className="text-sm font-medium">Email</span>
              <p className="text-xs text-muted-foreground mt-0.5">Newsletter & reactivation emails</p>
            </div>
          </div>
          <Toggle on={emailEnabled} onToggle={() => setEmailEnabled(!emailEnabled)} />
        </div>
        {emailEnabled && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success neon-dot-green" />
              <span className="text-[10px] text-success font-medium">Active</span>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>📧</span>
                <span>Sophie — Newsletter & Nurture</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💌</span>
                <span>Maya — Reactivation Specialist</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentTab = ({ data, onSave }: { data: SettingsData; onSave: (u: Partial<SettingsData>) => void }) => {
  const defaultTopics = ["Growth marketing", "Content strategy", "B2B sales", "Product-led growth", "SaaS metrics", "Copywriting", "Email marketing", "SEO", "Social media", "Analytics"];
  const [topics, setTopics] = useState(data.topics || defaultTopics);
  const [mixes, setMixes] = useState(data.content_mix || {
    educational: 30, story: 25, opinion: 15, market: 10, engagement: 15, promo: 5,
  });

  useEffect(() => {
    if (data.topics) setTopics(data.topics);
    if (data.content_mix) setMixes(data.content_mix);
  }, [data]);

  const total = Object.values(mixes).reduce((a, b) => a + b, 0);

  const updateMix = (key: string, value: number) => {
    setMixes((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1.5">Topics</label>
        <TagInput
          tags={topics}
          placeholder="Add topic..."
          onChange={setTopics}
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
          { key: "educational", label: "Educational" },
          { key: "story", label: "Story" },
          { key: "opinion", label: "Opinion" },
          { key: "market", label: "Market Commentary" },
          { key: "engagement", label: "Engagement" },
          { key: "promo", label: "Promo" },
        ]).map((s) => (
          <div key={s.key}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-display font-medium">{mixes[s.key] || 0}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={mixes[s.key] || 0}
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
      <button
        onClick={() => onSave({ topics, content_mix: mixes })}
        className="bg-primary text-primary-foreground text-sm font-display font-semibold rounded-lg px-5 py-2.5 btn-glow hover:opacity-90 transition-all"
      >
        Save
      </button>
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
        {mockInvoices.map((inv) => (
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
