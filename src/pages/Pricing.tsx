import { useNavigate } from "react-router-dom";
import { Check, Minus } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$99",
    subtitle: "Perfect for getting started",
    popular: false,
    features: ["1 channel", "3 workers", "5 posts/day", "Weekly learning", "Guardian safety"],
    cta: "Get Started",
    comingSoon: false,
  },
  {
    name: "Growth",
    price: "$249",
    subtitle: "For serious content creators",
    popular: true,
    features: ["Everything in Starter +", "2 channels", "10 workers", "15 posts/day", "Content recycling"],
    cta: "Get Started",
    comingSoon: false,
  },
  {
    name: "Scale",
    price: "$499",
    subtitle: "Unlimited everything",
    popular: false,
    features: ["Everything in Growth +", "Unlimited channels/workers/posts", "Custom integrations"],
    cta: "Get Started",
    comingSoon: false,
  },
  {
    name: "Strategy Suite",
    price: "",
    subtitle: "Your AI Marketing Director",
    popular: false,
    features: ["Weekly content pillars", "Cross-channel coherence", "Persistent AI strategist that knows your entire business"],
    cta: "Notify Me",
    comingSoon: true,
  },
];

const comparisonFeatures = [
  { feature: "Channels", starter: "1", growth: "2", scale: "Unlimited", strategy: "Unlimited" },
  { feature: "Workers", starter: "3", growth: "10", scale: "Unlimited", strategy: "Unlimited" },
  { feature: "Posts per day", starter: "5", growth: "15", scale: "Unlimited", strategy: "Unlimited" },
  { feature: "Weekly learning", starter: true, growth: true, scale: true, strategy: true },
  { feature: "Guardian safety", starter: true, growth: true, scale: true, strategy: true },
  { feature: "Content recycling", starter: false, growth: true, scale: true, strategy: true },
  { feature: "Custom tasks", starter: false, growth: true, scale: true, strategy: true },
  { feature: "Judge reports", starter: false, growth: true, scale: true, strategy: true },
  { feature: "Proof library", starter: false, growth: false, scale: true, strategy: true },
  { feature: "Custom integrations", starter: false, growth: false, scale: true, strategy: true },
  { feature: "AI Strategist", starter: false, growth: false, scale: false, strategy: true },
  { feature: "Weekly pillars", starter: false, growth: false, scale: false, strategy: true },
  { feature: "Cross-channel coherence", starter: false, growth: false, scale: false, strategy: true },
];

const Pricing = () => {
  const navigate = useNavigate();

  const renderCell = (val: boolean | string) => {
    if (val === true) return <Check className="w-4 h-4 text-primary mx-auto" />;
    if (val === false) return <Minus className="w-4 h-4 text-muted-foreground/30 mx-auto" />;
    return <span className="text-xs font-medium">{val}</span>;
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-16 relative overflow-hidden">
      <div className="text-center mb-12 relative z-10 animate-fade-in">
        <button onClick={() => navigate("/login")} className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block transition-colors">
          ← Back to login
        </button>
        <h1 className="text-3xl font-bold tracking-tight">
          Simple pricing for your AI marketing team
        </h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm">
          Start with one channel. Scale when you're ready.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full relative z-10">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`relative rounded-xl p-6 flex flex-col animate-fade-in glow-border glass-card ${
              plan.popular ? "border-primary/30" : ""
            } ${plan.comingSoon ? "opacity-60" : ""}`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-0.5 rounded-full">
                POPULAR
              </span>
            )}
            {plan.comingSoon && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground text-xs font-medium px-3 py-0.5 rounded-full">
                COMING Q2
              </span>
            )}

            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="text-xs text-muted-foreground mb-3">{plan.subtitle}</p>
            <div className="mb-5">
              {plan.comingSoon ? (
                <span className="text-muted-foreground text-sm">Coming Q2</span>
              ) : (
                <>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/month</span>
                </>
              )}
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" /> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => !plan.comingSoon && navigate("/onboarding")}
              disabled={plan.comingSoon}
              className={`w-full text-sm font-semibold rounded-lg py-2.5 transition-all ${
                plan.comingSoon
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : plan.popular
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-16 max-w-5xl w-full relative z-10 animate-fade-in" style={{ animationDelay: "0.4s" }}>
        <h2 className="text-xl font-bold text-center mb-8">Compare all features</h2>
        <div className="glass-card rounded-xl overflow-hidden border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-card/50">
                <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 w-[200px]">Feature</th>
                <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">Starter</th>
                <th className="text-center text-xs font-semibold px-4 py-3 text-primary">Growth</th>
                <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">Scale</th>
                <th className="text-center text-xs font-semibold text-muted-foreground px-4 py-3">Strategy</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row, i) => (
                <tr key={row.feature} className={`border-b border-border/50 ${i % 2 === 0 ? "" : "bg-card/20"}`}>
                  <td className="text-xs font-medium px-4 py-2.5">{row.feature}</td>
                  <td className="text-center px-4 py-2.5">{renderCell(row.starter)}</td>
                  <td className="text-center px-4 py-2.5">{renderCell(row.growth)}</td>
                  <td className="text-center px-4 py-2.5">{renderCell(row.scale)}</td>
                  <td className="text-center px-4 py-2.5">{renderCell(row.strategy)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
