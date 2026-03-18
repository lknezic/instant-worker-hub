const Placeholder = ({ title, icon }: { title: string; icon: string }) => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center">
      <span className="text-4xl block mb-3">{icon}</span>
      <h2 className="text-lg font-semibold mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground">Coming soon — this feature is under development</p>
    </div>
  </div>
);

export const Judge = () => <Placeholder title="Judge — Weekly Reports" icon="⚖️" />;
export const Proof = () => <Placeholder title="Proof Library" icon="📊" />;
export const Safety = () => <Placeholder title="Safety Guardian" icon="🛡️" />;
