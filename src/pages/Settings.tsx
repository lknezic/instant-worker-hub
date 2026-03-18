import { useState } from "react";
import { invoices } from "@/data/mockData";

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

const Tag = ({ text }: { text: string }) => (
  <span className="text-xs bg-card border border-border px-2.5 py-1 rounded-lg flex items-center gap-1.5 font-medium">
    {text} <button className="text-muted-foreground hover:text-foreground transition-colors">×</button>
  </span>
);

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
        <div className="flex flex-wrap gap-1.5 bg-background/30 border border-border rounded-lg px-3 py-2.5">
          {["Politics", "Religion", "Competitor bashing"].map((t) => <Tag key={t} text={t} />)}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Required Disclaimers</label>
        <div className="flex flex-wrap gap-1.5 bg-background/30 border border-border rounded-lg px-3 py-2.5">
          {["Not financial advice", "Results may vary"].map((t) => <Tag key={t} text={t} />)}
        </div>
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
      <div className="glass-card rounded-xl p-4 flex items-center justify-between glow-border">
        <div className="flex items-center gap-3">
          <span className="text-lg">𝕏</span>
          <div>
            <span className="text-sm font-medium">X (Twitter)</span>
            {xConnected && <span className="text-xs text-muted-foreground ml-2">@acmesaas</span>}
          </div>
        </div>
        <Toggle on={xConnected} onToggle={() => setXConnected(!xConnected)} />
      </div>
      <div className="glass-card rounded-xl p-4 flex items-center justify-between glow-border">
        <div className="flex items-center gap-3">
          <span className="text-lg">🤖</span>
          <span className="text-sm font-medium">Reddit</span>
        </div>
        <Toggle on={redditConnected} onToggle={() => setRedditConnected(!redditConnected)} />
      </div>
      <div className="glass-card rounded-xl p-4 flex items-center justify-between opacity-40">
        <div className="flex items-center gap-3">
          <span className="text-lg">📧</span>
          <span className="text-sm font-medium">Email</span>
        </div>
        <span className="text-[10px] font-display font-semibold text-muted-foreground uppercase tracking-wider">Coming Soon</span>
      </div>
    </div>
  );
};

const ContentTab = () => (
  <div className="space-y-5">
    <div>
      <label className="block text-sm font-medium mb-1.5">Topics</label>
      <div className="flex flex-wrap gap-1.5 bg-background/30 border border-border rounded-lg px-3 py-2.5">
        {["Growth marketing", "Content strategy", "B2B sales", "Product-led growth", "SaaS metrics"].map((t) => <Tag key={t} text={t} />)}
      </div>
    </div>
    <div className="space-y-3">
      <span className="text-sm font-display font-semibold">Content Mix</span>
      {[{ l: "Educational", v: 40 }, { l: "Story", v: 35 }, { l: "Opinion", v: 25 }].map((s) => (
        <div key={s.l}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-muted-foreground">{s.l}</span>
            <span className="font-display font-medium">{s.v}%</span>
          </div>
          <input type="range" min={0} max={100} defaultValue={s.v} className="w-full accent-primary" />
        </div>
      ))}
    </div>
    <div>
      <span className="text-sm font-display font-semibold block mb-3">Skills</span>
      <div className="grid grid-cols-2 gap-2">
        {["value-tweet", "contrarian-hook", "thread-opener", "thoughtful-reply", "helpful-answer", "resource-drop"].map((s) => (
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

const Billing = () => (
  <div className="space-y-6">
    <div className="glass-card-strong rounded-xl p-5 gradient-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="font-display font-bold">Growth Plan</span>
          <span className="text-sm text-muted-foreground ml-2">$249/mo</span>
        </div>
        <button className="text-xs bg-primary text-primary-foreground px-4 py-2 rounded-lg btn-glow hover:opacity-90 transition-all font-display font-semibold">
          Upgrade
        </button>
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Posts used</span>
          <span className="text-foreground font-medium">15 / 35</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: "43%", boxShadow: "var(--glow-primary-subtle)" }} />
        </div>
      </div>
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
