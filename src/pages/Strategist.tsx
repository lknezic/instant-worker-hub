import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { strategist, analyst } from "@/lib/api";
import { Send, Loader2, RefreshCw, User, Building2, Target, Compass, TrendingUp, TrendingDown, Minus, Users, AlertTriangle, CheckCircle2, Pencil, X, Check, BarChart3 } from "lucide-react";
import AIPromptBox from "@/components/strategist/AIPromptBox";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  profile_updates: Record<string, string> | null;
  created_at: string;
}

interface ProfileBundle {
  company_core: { business_name?: string; website?: string; description?: string };
  company_profile: { audience?: string; regions?: string; pain_points?: string; topics?: string; voice_style?: string; features?: string; competitors?: string };
  strategy_state: { current_goal?: string; primary_constraint?: string; stage?: string; current_play?: string; ninety_day_outcome?: string };
}

// ─── Typing Indicator ─────────────────────────────────────────────

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
    <span className="text-[10px] text-muted-foreground ml-1.5">Strategist is thinking...</span>
  </div>
);

// ─── Profile Update Badge (inline in chat) ────────────────────────

const ProfileUpdateBadge = ({ updates }: { updates: Record<string, string> }) => {
  const entries = Object.entries(updates);
  if (entries.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      {entries.map(([field, value]) => (
        <div key={field} className="flex items-center gap-1.5 text-[10px] text-primary/80 bg-primary/5 rounded px-2 py-1">
          <RefreshCw className="w-2.5 h-2.5" />
          <span className="font-medium">{field.replace(/_/g, " ")}</span>
          <span className="text-muted-foreground">→</span>
          <span className="truncate max-w-[200px]">{String(value)}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Chat Message ─────────────────────────────────────────────────

const ChatMessage = ({ msg }: { msg: Message }) => {
  if (msg.role === "assistant") {
    return (
      <div className="flex gap-2.5 animate-chat-bubble-left">
        <div className="w-7 h-7 rounded-md bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-sm">🧠</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="glass-card rounded-lg rounded-tl-sm p-3 border-l-2 border-primary/40">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{msg.content}</p>
          </div>
          {msg.profile_updates && Object.keys(msg.profile_updates).length > 0 && (
            <ProfileUpdateBadge updates={msg.profile_updates} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end animate-chat-bubble-right">
      <div className="bg-primary/10 border border-primary/20 rounded-lg rounded-tr-sm p-3 max-w-[85%]">
        <p className="text-sm leading-relaxed">{msg.content}</p>
      </div>
    </div>
  );
};

// ─── Editable Profile Field ───────────────────────────────────────

const ProfileField = ({
  label,
  value,
  icon: Icon,
  highlighted,
  fieldKey,
  onSave,
}: {
  label: string;
  value: string | undefined;
  icon: React.ElementType;
  highlighted?: boolean;
  fieldKey: string;
  onSave: (field: string, value: string) => void;
}) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value || "");

  const handleSave = () => {
    if (editValue.trim() !== (value || "").trim()) {
      onSave(fieldKey, editValue.trim());
    }
    setEditing(false);
  };

  const displayValue = value || "—";
  const isEmpty = !value;

  return (
    <div
      className={`group p-2.5 rounded-lg transition-all duration-500 ${
        highlighted
          ? "bg-primary/10 border border-primary/30 ring-1 ring-primary/20"
          : "hover:bg-card/40"
      }`}
    >
      <div className="flex items-start gap-2">
        <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 ${
          isEmpty ? "bg-destructive/10" : highlighted ? "bg-primary/20" : "bg-card"
        }`}>
          {isEmpty ? (
            <AlertTriangle className="w-3 h-3 text-destructive/60" />
          ) : highlighted ? (
            <CheckCircle2 className="w-3 h-3 text-primary" />
          ) : (
            <Icon className="w-3 h-3 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
            {!editing && (
              <button
                onClick={() => { setEditValue(value || ""); setEditing(true); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Pencil className="w-2.5 h-2.5 text-muted-foreground hover:text-primary" />
              </button>
            )}
          </div>
          {editing ? (
            <div className="flex items-center gap-1 mt-1">
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") setEditing(false); }}
                className="flex-1 text-xs bg-background/50 border border-border rounded px-2 py-1 outline-none focus:border-primary/40"
              />
              <button onClick={handleSave} className="w-5 h-5 rounded flex items-center justify-center text-primary hover:bg-primary/10">
                <Check className="w-3 h-3" />
              </button>
              <button onClick={() => setEditing(false)} className="w-5 h-5 rounded flex items-center justify-center text-muted-foreground hover:bg-card">
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <p className={`text-xs mt-0.5 leading-relaxed ${isEmpty ? "text-muted-foreground/50 italic" : ""}`}>
              {displayValue}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Business Profile Panel ───────────────────────────────────────

const BusinessProfile = ({
  profile,
  highlightedFields,
  onFieldSave,
  isLoading,
}: {
  profile: ProfileBundle | null;
  highlightedFields: Set<string>;
  onFieldSave: (field: string, value: string) => void;
  isLoading: boolean;
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <Building2 className="w-8 h-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">No profile yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Start a conversation and your profile will build automatically.</p>
      </div>
    );
  }

  const core = profile.company_core;
  const prof = profile.company_profile;
  const strat = profile.strategy_state;

  return (
    <div className="space-y-4 p-3 overflow-y-auto">
      {/* Strategy State */}
      <div>
        <h3 className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-2 px-1">Strategy</h3>
        <div className="space-y-1">
          <ProfileField label="Stage" value={strat.stage} icon={Compass} highlighted={highlightedFields.has("stage")} fieldKey="stage" onSave={onFieldSave} />
          <ProfileField label="Constraint" value={strat.primary_constraint} icon={AlertTriangle} highlighted={highlightedFields.has("primary_constraint")} fieldKey="primary_constraint" onSave={onFieldSave} />
          <ProfileField label="Current Play" value={strat.current_play} icon={Target} highlighted={highlightedFields.has("current_play")} fieldKey="current_play" onSave={onFieldSave} />
          <ProfileField label="90-Day Goal" value={strat.ninety_day_outcome} icon={TrendingUp} highlighted={highlightedFields.has("ninety_day_outcome")} fieldKey="ninety_day_outcome" onSave={onFieldSave} />
        </div>
      </div>

      {/* Business */}
      <div>
        <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Business</h3>
        <div className="space-y-1">
          <ProfileField label="Business Name" value={core.business_name} icon={Building2} highlighted={highlightedFields.has("business_name")} fieldKey="business_name" onSave={onFieldSave} />
          <ProfileField label="Description" value={core.description} icon={Building2} highlighted={highlightedFields.has("description")} fieldKey="description" onSave={onFieldSave} />
        </div>
      </div>

      {/* Audience */}
      <div>
        <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Audience</h3>
        <div className="space-y-1">
          <ProfileField label="Audience" value={prof.audience} icon={Users} highlighted={highlightedFields.has("audience")} fieldKey="audience" onSave={onFieldSave} />
          <ProfileField label="Pain Points" value={prof.pain_points} icon={AlertTriangle} highlighted={highlightedFields.has("pain_points")} fieldKey="pain_points" onSave={onFieldSave} />
          <ProfileField label="Competitors" value={prof.competitors} icon={Users} highlighted={highlightedFields.has("competitors")} fieldKey="competitors" onSave={onFieldSave} />
        </div>
      </div>

      {/* Voice & Content */}
      <div>
        <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Voice & Content</h3>
        <div className="space-y-1">
          <ProfileField label="Voice Style" value={prof.voice_style} icon={User} highlighted={highlightedFields.has("voice_style")} fieldKey="voice_style" onSave={onFieldSave} />
          <ProfileField label="Topics" value={prof.topics} icon={Target} highlighted={highlightedFields.has("topics")} fieldKey="topics" onSave={onFieldSave} />
        </div>
      </div>
    </div>
  );
};

// ─── Analyst Brief Card ──────────────────────────────────────────

const AnalystBriefCard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["analyst-brief"],
    queryFn: () => analyst.brief("7d"),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading || !data) return null;

  const { content_metrics, health_signals } = data;

  const trendIcon =
    content_metrics.trend === "up" ? (
      <TrendingUp className="w-3.5 h-3.5 text-success" />
    ) : content_metrics.trend === "down" ? (
      <TrendingDown className="w-3.5 h-3.5 text-destructive" />
    ) : (
      <Minus className="w-3.5 h-3.5 text-muted-foreground" />
    );

  const alerts = health_signals?.alerts ?? [];

  return (
    <div className="mx-4 mt-3 mb-1 glass-card rounded-lg px-4 py-2.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs border-l-2 border-primary/40">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <BarChart3 className="w-3.5 h-3.5" />
        <span className="font-medium text-foreground/80">This week</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Posts:</span>
        <span className="font-semibold">{content_metrics.posts_published}</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-muted-foreground">Engagement:</span>
        {trendIcon}
        <span className="font-semibold">
          {(content_metrics.avg_engagement_rate * 100).toFixed(1)}%
        </span>
      </div>
      {content_metrics.top_channel && (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">Top:</span>
          <span className="font-semibold capitalize">{content_metrics.top_channel}</span>
        </div>
      )}
      {alerts.length > 0 && (
        <div className="flex items-center gap-1 text-destructive/80">
          <AlertTriangle className="w-3 h-3" />
          <span>{alerts[0]}</span>
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────

const Strategist = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<ProfileBundle | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [highlightedFields, setHighlightedFields] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Load messages on mount
  useEffect(() => {
    strategist.messages()
      .then((data) => {
        setMessages(data.messages || []);
      })
      .catch((err) => {
        console.error("Failed to load messages:", err);
        toast.error("Could not load conversation history");
      })
      .finally(() => setMessagesLoading(false));
  }, []);

  // Load profile on mount
  const loadProfile = useCallback(() => {
    setProfileLoading(true);
    strategist.profile()
      .then((data) => {
        setProfile(data.profile);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
      })
      .finally(() => setProfileLoading(false));
  }, []);

  useEffect(() => { loadProfile(); }, [loadProfile]);

  // Send a message
  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    // Optimistic: add user message
    const userMsg: Message = {
      id: `u_${Date.now()}`,
      role: "user",
      content: text.trim(),
      profile_updates: null,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const result = await strategist.chat(text.trim());

      const assistantMsg: Message = {
        id: result.message_id || `a_${Date.now()}`,
        role: "assistant",
        content: result.response,
        profile_updates: result.profile_updates,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      // If profile was updated, refresh it and highlight changed fields
      if (result.profile_updates && Object.keys(result.profile_updates).length > 0) {
        const updatedKeys = new Set(Object.keys(result.profile_updates));
        setHighlightedFields(updatedKeys);
        loadProfile();

        // Clear highlights after 5 seconds
        setTimeout(() => setHighlightedFields(new Set()), 5000);
      }
    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Failed to send message. Please try again.");
      // Remove the optimistic user message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsTyping(false);
    }
  };

  // Edit a profile field manually
  const handleFieldSave = async (field: string, value: string) => {
    try {
      await strategist.updateField(field, value);
      loadProfile();
      toast.success(`Updated ${field.replace(/_/g, " ")}`);
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update field");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <div>
            <h1 className="text-lg font-bold">
              Ask Your <span className="text-primary">Strategist</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              {profile?.company_core?.business_name
                ? `Strategy workspace for ${profile.company_core.business_name}`
                : "Your AI marketing director — ask anything about your strategy"}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-success neon-dot-green" />
            <span className="text-[10px] text-muted-foreground">Online</span>
          </div>
        </div>
      </div>

      {/* Analyst Brief */}
      <AnalystBriefCard />

      {/* Two-panel layout */}
      <div className="flex flex-1 min-h-0">
        {/* PANEL 1: Chat (60%) */}
        <div className="flex flex-col w-[60%] border-r border-border">
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <h2 className="text-sm font-semibold mb-1">Welcome to your Strategist</h2>
                <p className="text-xs text-muted-foreground max-w-sm">
                  Ask me anything about your marketing strategy. I'll help diagnose your business, identify constraints, and recommend plays. Your profile builds automatically as we talk.
                </p>
              </div>
            ) : (
              messages.map((msg) => <ChatMessage key={msg.id} msg={msg} />)
            )}
            {isTyping && <TypingIndicator />}
          </div>

          {/* Input */}
          <div className="shrink-0 p-4 border-t border-border">
            <AIPromptBox
              onSend={handleSend}
              isLoading={isTyping}
              placeholder="Ask your strategist..."
              vanishPlaceholders={[
                "What should my 90-day goal be?",
                "Who is my ideal customer?",
                "What's my biggest growth constraint?",
                "Analyze my content strategy...",
                "Help me define my voice...",
              ]}
            />
          </div>
        </div>

        {/* PANEL 2: Business Profile (40%) */}
        <div className="flex flex-col w-[40%]">
          <div className="shrink-0 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-semibold">Business Profile</span>
              <span className="text-[10px] text-muted-foreground ml-auto">Auto-updated from chat</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <BusinessProfile
              profile={profile}
              highlightedFields={highlightedFields}
              onFieldSave={handleFieldSave}
              isLoading={profileLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Strategist;
