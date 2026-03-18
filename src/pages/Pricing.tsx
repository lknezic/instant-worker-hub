import { useNavigate } from "react-router-dom";

const plans = [
  {
    name: "Starter",
    price: "$99",
    popular: false,
    features: ["1 channel", "3 workers", "5 posts/day"],
    cta: "Get Started",
    comingSoon: false,
  },
  {
    name: "Growth",
    price: "$249",
    popular: true,
    features: ["2 channels", "10 workers", "15 posts/day"],
    cta: "Get Started",
    comingSoon: false,
  },
  {
    name: "Scale",
    price: "$499",
    popular: false,
    features: ["Unlimited channels", "Unlimited workers", "Unlimited posts"],
    cta: "Get Started",
    comingSoon: false,
  },
  {
    name: "Strategy Suite",
    price: "Coming Q2",
    popular: false,
    features: ["Your AI Marketing Director", "Weekly content pillars", "Cross-channel coherence"],
    cta: "Notify Me",
    comingSoon: true,
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-grid bg-radial-top relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="text-center mb-12 relative z-10 animate-fade-in">
        <button onClick={() => navigate("/login")} className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block transition-colors">
          ← Back to login
        </button>
        <h1 className="font-display text-4xl font-bold tracking-tight">
          Simple, transparent <span className="text-primary">pricing</span>
        </h1>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          Hire your AI marketing team today. No training, no setup — just results.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full relative z-10">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`relative rounded-xl p-6 flex flex-col animate-fade-in glow-border ${
              plan.popular ? "gradient-border glass-card-strong" : "glass-card"
            } ${plan.comingSoon ? "opacity-40" : ""}`}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-display font-semibold px-3 py-0.5 rounded-full btn-glow">
                POPULAR
              </span>
            )}
            {plan.comingSoon && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground text-xs font-medium px-3 py-0.5 rounded-full">
                COMING Q2
              </span>
            )}

            <h2 className="font-display text-lg font-semibold">{plan.name}</h2>
            <div className="mt-2 mb-5">
              {plan.comingSoon ? (
                <span className="text-muted-foreground text-sm">Coming Q2</span>
              ) : (
                <>
                  <span className="font-display text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </>
              )}
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-muted-foreground flex items-center gap-2.5">
                  <span className="text-primary text-xs">●</span> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => !plan.comingSoon && navigate("/onboarding")}
              disabled={plan.comingSoon}
              className={`w-full text-sm font-display font-semibold rounded-lg py-2.5 transition-all ${
                plan.comingSoon
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : plan.popular
                    ? "bg-primary text-primary-foreground btn-glow hover:opacity-90"
                    : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
