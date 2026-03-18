const mockJudgeData = [
  { worker: "X Poster", grade: "A-", trend: "↗", metric: "2.6% engagement" },
  { worker: "X Engagement", grade: "B+", trend: "→", metric: "1.4% reply rate" },
  { worker: "Reddit Commenter", grade: "B", trend: "↗", metric: "2.2% upvote rate" },
  { worker: "Reddit Flagship", grade: "A", trend: "↗", metric: "3.4% engagement" },
];

const mockProofData = [
  { metric: "Total impressions", value: "24,800", change: "+18%" },
  { metric: "Profile visits", value: "342", change: "+23%" },
  { metric: "Followers gained", value: "47", change: "+12%" },
  { metric: "Link clicks", value: "89", change: "+31%" },
];

const mockSafetyData = [
  { rule: "No competitor bashing", status: "✅ Passing", blocked: 0 },
  { rule: "Disclaimer on financial advice", status: "✅ Passing", blocked: 0 },
  { rule: "No prohibited topics", status: "⚠️ 1 flagged", blocked: 1 },
  { rule: "Tone consistency", status: "✅ Passing", blocked: 0 },
];

const Placeholder = ({ title, description, children }: { title: string; description: string; children?: React.ReactNode }) => (
  <div className="h-full flex flex-col bg-grid bg-radial-center">
    <div className="flex-1 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-lg">
        {/* Mock preview — blurred */}
        <div className="relative mb-8">
          <div className="blur-[2px] opacity-40 pointer-events-none select-none">
            {children}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center glass-card-strong rounded-xl px-6 py-4 gradient-border">
              <span className="text-2xl block mb-2">🔮</span>
              <h2 className="font-display text-lg font-bold mb-1">{title}</h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto mb-3">{description}</p>
              <span className="inline-block text-[10px] font-display font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                Available on your next weekly report
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const Judge = () => (
  <Placeholder title="Judge" description="Weekly performance reports and grading for all your AI workers">
    <div className="space-y-2">
      {mockJudgeData.map((d) => (
        <div key={d.worker} className="glass-card rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm font-medium">{d.worker}</span>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{d.metric}</span>
            <span className="text-xs font-bold text-primary">{d.grade}</span>
            <span className="text-success text-xs">{d.trend}</span>
          </div>
        </div>
      ))}
    </div>
  </Placeholder>
);

export const Proof = () => (
  <Placeholder title="Proof Library" description="Evidence and metrics that prove your workers' impact">
    <div className="grid grid-cols-2 gap-2">
      {mockProofData.map((d) => (
        <div key={d.metric} className="glass-card rounded-lg p-3">
          <span className="text-[10px] text-muted-foreground block">{d.metric}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold">{d.value}</span>
            <span className="text-xs text-success font-semibold">{d.change}</span>
          </div>
        </div>
      ))}
    </div>
  </Placeholder>
);

export const Safety = () => (
  <Placeholder title="Safety Guardian" description="Automated compliance checks and content safety monitoring">
    <div className="space-y-2">
      {mockSafetyData.map((d) => (
        <div key={d.rule} className="glass-card rounded-lg p-3 flex items-center justify-between">
          <span className="text-sm">{d.rule}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs">{d.status}</span>
            {d.blocked > 0 && <span className="text-[10px] bg-warning/15 text-warning px-1.5 py-0.5 rounded-full font-semibold">{d.blocked} blocked</span>}
          </div>
        </div>
      ))}
    </div>
  </Placeholder>
);
