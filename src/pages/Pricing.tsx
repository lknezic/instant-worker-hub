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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center mb-12">
        <button onClick={() => navigate("/login")} className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Back to login
        </button>
        <h1 className="text-3xl font-semibold tracking-tight">Simple, transparent pricing</h1>
        <p className="text-muted-foreground mt-2">Start automating your marketing today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl w-full">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-card border rounded-lg p-6 flex flex-col ${
              plan.popular ? "border-primary" : "border-border"
            } ${plan.comingSoon ? "opacity-50" : ""}`}
          >
            {plan.popular && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
                POPULAR
              </span>
            )}
            {plan.comingSoon && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-muted text-muted-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
                COMING Q2
              </span>
            )}

            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <div className="mt-2 mb-4">
              {plan.comingSoon ? (
                <span className="text-muted-foreground text-sm">Coming Q2</span>
              ) : (
                <>
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/mo</span>
                </>
              )}
            </div>

            <ul className="space-y-2 mb-6 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="text-primary">✓</span> {f}
                </li>
              ))}
            </ul>

            <button
              onClick={() => !plan.comingSoon && navigate("/onboarding")}
              disabled={plan.comingSoon}
              className={`w-full text-sm font-medium rounded-md py-2 transition-opacity ${
                plan.comingSoon
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary text-primary-foreground hover:opacity-90"
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
