const Placeholder = ({ title, description }: { title: string; description: string }) => (
  <div className="h-full flex items-center justify-center bg-grid bg-radial-center">
    <div className="text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl glass-card-strong gradient-border flex items-center justify-center mx-auto mb-5">
        <span className="text-2xl">🔮</span>
      </div>
      <h2 className="font-display text-xl font-bold mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground max-w-xs mx-auto">{description}</p>
      <span className="inline-block mt-4 text-[10px] font-display font-semibold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full uppercase tracking-wider">
        Coming Soon
      </span>
    </div>
  </div>
);

export const Judge = () => <Placeholder title="Judge" description="Weekly performance reports and grading for all your AI workers" />;
export const Proof = () => <Placeholder title="Proof Library" description="Evidence and metrics that prove your workers' impact" />;
export const Safety = () => <Placeholder title="Safety Guardian" description="Automated compliance checks and content safety monitoring" />;
