import { useState, useEffect, useRef } from "react";
import { strategistMessages, type StrategistMessage } from "@/data/mockData";
import { Send, Lock, Sparkles } from "lucide-react";

interface Props {
  tier?: 1 | 2 | 3;
}

const TypingIndicator = () => (
  <div className="flex items-center gap-1 px-3 py-2">
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
    <span className="text-[10px] text-muted-foreground ml-1.5">Strategist is typing...</span>
  </div>
);

const ChatMessage = ({
  msg,
  onQuickReply,
  disabled,
}: {
  msg: StrategistMessage;
  onQuickReply?: (reply: string) => void;
  disabled?: boolean;
}) => {
  if (msg.role === "strategist") {
    return (
      <div className="flex gap-2.5 animate-fade-in">
        <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-xs">🧠</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="glass-card rounded-lg rounded-tl-sm p-3 border-l-2 border-primary/40">
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{msg.content}</p>
          </div>
          {msg.quickReplies && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {msg.quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => !disabled && onQuickReply?.(reply)}
                  disabled={disabled}
                  className={`text-[11px] px-2.5 py-1 rounded-full border border-primary/30 text-primary transition-colors ${
                    disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-primary/10"
                  }`}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end animate-fade-in">
      <div className="bg-primary/10 border border-primary/20 rounded-lg rounded-tr-sm p-3 max-w-[85%]">
        <p className="text-xs leading-relaxed">{msg.content}</p>
      </div>
    </div>
  );
};

const StrategistPanel = ({ tier = 2 }: Props) => {
  const [messages, setMessages] = useState<StrategistMessage[]>(strategistMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { id: `u${Date.now()}`, role: "user", content: input }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `s${Date.now()}`,
          role: "strategist",
          content: "I'll look into that and update your settings accordingly.",
          quickReplies: ["Thanks", "Tell me more"],
        },
      ]);
    }, 1500);
  };

  const handleQuickReply = (reply: string) => {
    setMessages((prev) => [...prev, { id: `u${Date.now()}`, role: "user", content: reply }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `s${Date.now()}`,
          role: "strategist",
          content: "Got it! I've noted that down. Anything else you'd like to adjust?",
          quickReplies: ["No, looks good", "One more thing"],
        },
      ]);
    }, 1200);
  };

  // Locked panel for Tier 1/2 — shows greyed-out preview of real conversation
  if (tier < 3) {
    return (
      <div className="w-64 shrink-0 border-l border-border bg-card/20 flex flex-col relative">
        {/* Header */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
              <span className="text-xs">🧠</span>
            </div>
            <span className="text-sm font-semibold">Strategist</span>
            <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
          </div>
        </div>

        {/* Greyed-out preview of real conversation */}
        <div className="flex-1 overflow-hidden p-3 space-y-3 opacity-40 pointer-events-none select-none">
          {strategistMessages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} disabled />
          ))}
        </div>

        {/* Greyed-out input */}
        <div className="p-3 border-t border-border opacity-30 pointer-events-none">
          <div className="flex items-center gap-2 bg-background/50 border border-border rounded-lg px-3 py-2">
            <span className="flex-1 text-xs text-muted-foreground">Type a message...</span>
            <Send className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Upgrade overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center pb-6 pointer-events-auto">
          <div className="text-center px-4">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-bold mb-1">Your AI Marketing Director</h3>
            <p className="text-[11px] text-muted-foreground mb-4 leading-relaxed">
              Get proactive advice, voice optimization, and make changes through conversation.
            </p>
            <button className="w-full text-xs bg-primary text-primary-foreground font-semibold rounded-lg py-2.5 hover:opacity-90 transition-all btn-glow">
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
      <div className="p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-primary/15 flex items-center justify-center">
            <span className="text-xs">🧠</span>
          </div>
          <span className="text-sm font-semibold">Strategist</span>
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-success neon-dot-green" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} msg={msg} onQuickReply={handleQuickReply} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <div className="p-3 border-t border-border">
        <div className="flex items-center gap-2 bg-background/50 border border-border rounded-lg px-3 py-2 focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/30 transition-all">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="text-primary hover:text-primary/80 transition-colors disabled:opacity-30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategistPanel;
