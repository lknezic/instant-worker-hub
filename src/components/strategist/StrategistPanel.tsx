import { useState } from "react";
import { strategistMessages, type StrategistMessage } from "@/data/mockData";
import { MessageSquare, Send, Lock } from "lucide-react";

interface Props {
  tier?: 1 | 2 | 3;
}

const StrategistPanel = ({ tier = 2 }: Props) => {
  const [messages, setMessages] = useState<StrategistMessage[]>(strategistMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: `u${Date.now()}`, role: "user", content: input }]);
    setInput("");
    // Simulate strategist reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: `s${Date.now()}`, role: "strategist", content: "I'll look into that and update your settings accordingly.", quickReplies: ["Thanks", "Tell me more"] },
      ]);
    }, 1000);
  };

  const handleQuickReply = (reply: string) => {
    setMessages((prev) => [...prev, { id: `u${Date.now()}`, role: "user", content: reply }]);
  };

  // Locked panel for Tier 1/2
  if (tier < 3) {
    return (
      <div className="w-60 shrink-0 border-l border-border bg-card/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
              <span className="text-xs">🧠</span>
            </div>
            <span className="text-sm font-semibold">Strategist</span>
            <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
          </div>
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <h3 className="text-sm font-semibold mb-3">Your AI Marketing Director</h3>
          <ul className="space-y-2 text-xs text-muted-foreground mb-6">
            {[
              "Weekly content strategy",
              "Proactive performance advice",
              "Voice & tone optimization",
              "Competitor monitoring",
              "Changes through conversation",
            ].map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="text-primary text-[10px]">●</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="border-t border-border pt-4 mb-4">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Preview</span>
          </div>

          <div className="glass-card rounded-lg p-3 border-l-2 border-primary/40">
            <p className="text-xs text-muted-foreground leading-relaxed">
              💬 "Your evening posts are 40% better than morning ones. Want me to shift your schedule?"
            </p>
          </div>

          <div className="mt-auto pt-4">
            <button className="w-full text-xs bg-primary text-primary-foreground font-semibold rounded-lg py-2.5 hover:opacity-90 transition-all">
              Upgrade to Strategy Suite →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active panel for Tier 3
  return (
    <div className="w-80 shrink-0 border-l border-border bg-card/20 flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
            <span className="text-xs">🧠</span>
          </div>
          <span className="text-sm font-semibold">Strategist</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-success neon-dot-green" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id}>
            {msg.role === "strategist" ? (
              <div className="glass-card rounded-lg p-3 border-l-2 border-primary/40">
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{msg.content}</p>
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {msg.quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                  <p className="text-xs leading-relaxed">{msg.content}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 bg-background/50 border border-border rounded-lg px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
          <button onClick={handleSend} className="text-primary hover:text-primary/80 transition-colors">
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategistPanel;
