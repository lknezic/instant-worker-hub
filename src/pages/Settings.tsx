import { useState } from "react";
import { invoices } from "@/data/mockData";

const tabsList = ["Business Profile", "Voice & Compliance", "Channels", "Content", "Billing"];

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="h-full flex flex-col">
      <div className="px-6 pt-5 pb-0 border-b border-border shrink-0">
        <h2 className="text-lg font-semibold mb-4">Settings</h2>
        <div className="flex gap-4 overflow-x-auto">
          {tabsList.map((t, i) => (
            <button
              key={t}
              onClick={() => setActiveTab(i)}
              className={`pb-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === i ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-xl">
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

const Input = ({ label, defaultValue, multiline }: { label: string; defaultValue: string; multiline?: boolean }) => (
  <div>
    <label className="block text-sm font-medium mb-1.5">{label}</label>
    {multiline ? (
      <textarea defaultValue={defaultValue} rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none" />
    ) : (
      <input defaultValue={defaultValue} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary" />
    )}
  </div>
);

const BusinessProfile = () => (
  <div className="space-y-4">
    <Input label="Business Name" defaultValue="Acme SaaS Co" />
    <Input label="Website" defaultValue="https://acmesaas.com" />
    <Input label="Description" defaultValue="AI-powered marketing automation for B2B SaaS companies" multiline />
    <Input label="Target Audience" defaultValue="B2B SaaS founders and marketing leaders" />
    <Input label="90-Day Outcome" defaultValue="Establish thought leadership and generate 50 qualified leads per month" multiline />
    <Input label="Current Offers" defaultValue="14-day free trial, annual discount" />
    <button className="bg-primary text-primary-foreground text-sm font-medium rounded-md px-4 py-2 hover:opacity-90 transition-opacity">Save</button>
  </div>
);

const VoiceCompliance = () => {
  const [regulated, setRegulated] = useState(false);
  return (
    <div className="space-y-4">
      <Input label="Voice & Tone" defaultValue="Professional but approachable, data-driven, slightly contrarian" multiline />
      <div>
        <label className="block text-sm font-medium mb-1.5">Forbidden Topics</label>
        <div className="flex flex-wrap gap-1.5 bg-background border border-border rounded-md px-3 py-2">
          {["Politics", "Religion", "Competitor bashing"].map((t) => (
            <span key={t} className="text-xs bg-card border border-border px-2 py-1 rounded-md flex items-center gap-1">
              {t} <button className="text-muted-foreground hover:text-foreground">×</button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">Required Disclaimers</label>
        <div className="flex flex-wrap gap-1.5 bg-background border border-border rounded-md px-3 py-2">
          {["Not financial advice", "Results may vary"].map((t) => (
            <span key={t} className="text-xs bg-card border border-border px-2 py-1 rounded-md flex items-center gap-1">
              {t} <button className="text-muted-foreground hover:text-foreground">×</button>
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Regulated Industry</span>
        <button
          onClick={() => setRegulated(!regulated)}
          className={`w-9 h-5 rounded-full transition-colors relative ${regulated ? "bg-primary" : "bg-muted"}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${regulated ? "left-[18px]" : "left-0.5"}`} />
        </button>
      </div>
      <button className="bg-primary text-primary-foreground text-sm font-medium rounded-md px-4 py-2 hover:opacity-90 transition-opacity">Save</button>
    </div>
  );
};

const Channels = () => {
  const [xConnected, setXConnected] = useState(true);
  const [redditConnected, setRedditConnected] = useState(true);
  return (
    <div className="space-y-3">
      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">𝕏 X (Twitter)</span>
          {xConnected && <span className="text-xs text-muted-foreground ml-2">@acmesaas</span>}
        </div>
        <button
          onClick={() => setXConnected(!xConnected)}
          className={`w-9 h-5 rounded-full transition-colors relative ${xConnected ? "bg-primary" : "bg-muted"}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${xConnected ? "left-[18px]" : "left-0.5"}`} />
        </button>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
        <span className="text-sm font-medium">🤖 Reddit</span>
        <button
          onClick={() => setRedditConnected(!redditConnected)}
          className={`w-9 h-5 rounded-full transition-colors relative ${redditConnected ? "bg-primary" : "bg-muted"}`}
        >
          <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-foreground transition-transform ${redditConnected ? "left-[18px]" : "left-0.5"}`} />
        </button>
      </div>
      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between opacity-50">
        <span className="text-sm font-medium">📧 Email</span>
        <span className="text-xs text-muted-foreground">Coming Soon</span>
      </div>
    </div>
  );
};

const ContentTab = () => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-1.5">Topics</label>
      <div className="flex flex-wrap gap-1.5 bg-background border border-border rounded-md px-3 py-2">
        {["Growth marketing", "Content strategy", "B2B sales", "Product-led growth", "SaaS metrics"].map((t) => (
          <span key={t} className="text-xs bg-card border border-border px-2 py-1 rounded-md flex items-center gap-1">
            {t} <button className="text-muted-foreground hover:text-foreground">×</button>
          </span>
        ))}
      </div>
    </div>
    <div className="space-y-3">
      <span className="text-sm font-medium">Content Mix</span>
      {[{ l: "Educational", v: 40 }, { l: "Story", v: 35 }, { l: "Opinion", v: 25 }].map((s) => (
        <div key={s.l}>
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{s.l}</span><span>{s.v}%</span>
          </div>
          <input type="range" min={0} max={100} defaultValue={s.v} className="w-full accent-primary" />
        </div>
      ))}
    </div>
    <div>
      <span className="text-sm font-medium block mb-2">Skills</span>
      <div className="grid grid-cols-2 gap-2">
        {["value-tweet", "contrarian-hook", "thread-opener", "thoughtful-reply", "helpful-answer", "resource-drop"].map((s) => (
          <label key={s} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-primary" /> {s}
          </label>
        ))}
      </div>
    </div>
    <button className="bg-primary text-primary-foreground text-sm font-medium rounded-md px-4 py-2 hover:opacity-90 transition-opacity">Save</button>
  </div>
);

const Billing = () => (
  <div className="space-y-6">
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-sm font-semibold">Growth Plan</span>
          <span className="text-xs text-muted-foreground ml-2">$249/mo</span>
        </div>
        <button className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity">Upgrade</button>
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Posts used</span><span>15 / 35</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: "43%" }} />
        </div>
      </div>
    </div>

    <div>
      <h3 className="text-sm font-semibold mb-3">Invoices</h3>
      <div className="space-y-2">
        {invoices.map((inv) => (
          <div key={inv.id} className="bg-card border border-border rounded-md px-4 py-2.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{inv.date}</span>
            <span>{inv.amount}</span>
            <span className="text-xs text-success">{inv.status}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Settings;
