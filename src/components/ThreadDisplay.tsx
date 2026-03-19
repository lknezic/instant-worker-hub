/**
 * ThreadDisplay — splits thread text at [N/M] markers and renders
 * each tweet as a separate visual card. If no markers found, renders
 * as plain text.
 */

interface ThreadDisplayProps {
  content: string;
  className?: string;
}

export default function ThreadDisplay({ content, className = "" }: ThreadDisplayProps) {
  // Detect thread markers: [1/7], [2/7], etc.
  const threadPattern = /\[(\d+)\/(\d+)\]/g;
  const hasThreadMarkers = threadPattern.test(content);

  if (!hasThreadMarkers) {
    // Regular post — just show the text
    return (
      <p className={`text-sm text-muted-foreground leading-relaxed ${className}`}>
        "{content}"
      </p>
    );
  }

  // Split into individual tweets
  // Reset regex after test
  const parts = content.split(/\[\d+\/\d+\]\s*/);
  const total = parts.filter(p => p.trim()).length;

  // First part before [1/N] is usually empty, filter it out
  const tweets = parts.filter(p => p.trim());

  return (
    <div className={`space-y-2 ${className}`}>
      {tweets.map((tweet, i) => (
        <div
          key={i}
          className="relative pl-4 border-l-2 border-primary/20 hover:border-primary/40 transition-colors"
        >
          <span className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center text-[9px] font-bold text-primary/60">
            {i + 1}
          </span>
          <p className="text-sm text-muted-foreground leading-relaxed py-1">
            {tweet.trim()}
          </p>
        </div>
      ))}
      <p className="text-[10px] text-muted-foreground/50 pl-4">
        Thread • {total} tweets
      </p>
    </div>
  );
}
