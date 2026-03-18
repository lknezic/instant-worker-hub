import { useState, useEffect, useCallback } from "react";
import { workflowQuestions, reviewCards as mockReviewCards, improvementsSummary, overallImprovement, postSummary, weeklyPillar, type ReviewCard } from "@/data/mockData";
import { events as eventsApi } from "@/lib/api";
import { Check, ChevronRight, Sparkles } from "lucide-react";
import { useWorkflow } from "@/contexts/WorkflowContext";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";
import { toast } from "sonner";

const stepMeta = [
  { label: "Answer Questions", time: "2 min" },
  { label: "Review Content", time: "5 min" },
  { label: "Check Improvements", time: "1 min" },
  { label: "Approve Strategy", time: "1 min" },
  { label: "Post & Go", time: "1 min" },
];

const bestPost = {
  content: "Numbers that changed my trading: 45 DTE, 0.30 delta, 2% max risk per position...",
  impressions: 6800,
  saves: 142,
  comments: 31,
  workerName: "X Poster",
  workerEmoji: "✍️",
};

function getWorkerEmoji(agentName: string): string {
  const map: Record<string, string> = {
    "x-tweet-thread-poster": "✍️",
    "x-engagement-agent": "💬",
    "reddit-comment-answer": "🗣️",
    "reddit-flagship-poster": "📝",
    "content-recycler": "♻️",
  };
  return map[agentName] || "🤖";
}

function getWorkerName(agentName: string): string {
  const map: Record<string, string> = {
    "x-tweet-thread-poster": "X Poster",
    "x-engagement-agent": "X Engagement",
    "reddit-comment-answer": "Reddit Commenter",
    "reddit-flagship-poster": "Reddit Flagship",
    "content-recycler": "Content Recycler",
  };
  return map[agentName] || agentName;
}

function eventToCard(ev: any): ReviewCard {
  return {
    id: String(ev.id),
    workerId: ev.agent_name,
    workerEmoji: getWorkerEmoji(ev.agent_name),
    workerName: getWorkerName(ev.agent_name),
    channel: ev.channel === "x" ? "X" : "Reddit",
    skill: ev.skill_name || "unknown",
    content: ev.final_text || ev.draft_text || "",
    status: ev.review_status as any,
    rating: ev.review_rating || 0,
    metrics: ev.impressions ? { views: ev.impressions, saves: ev.bookmarks || 0, comments: ev.replies || 0 } : undefined,
  };
}

const Confetti = () => {
  const colors = [
    "hsl(var(--primary))",
    "hsl(var(--success))",
    "hsl(var(--info))",
    "hsl(var(--warning))",
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 40 }, (_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const size = 4 + Math.random() * 6;
        const color = colors[i % colors.length];
        const rotation = Math.random() * 360;
        return (
          <div
            key={i}
            className="absolute animate-confetti"
            style={{
              left: `${left}%`,
              top: "-10px",
              width: `${size}px`,
              height: `${size * 0.6}px`,
              backgroundColor: color,
              borderRadius: "2px",
              animationDelay: `${delay}s`,
              transform: `rotate(${rotation}deg)`,
            }}
          />
        );
      })}
    </div>
  );
};

const TodayWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>(mockReviewCards);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [done, setDone] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { setTodayComplete } = useWorkflow();

  // Fetch pending events from API, fall back to mock data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await eventsApi.list({ review_status: "pending", limit: 50 });
        if (!cancelled && data.events && data.events.length > 0) {
          setReviewCards(data.events.map(eventToCard));
        }
      } catch {
        // API not available — keep mock data
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const pendingReview = reviewCards.filter((c) => c.status === "pending");
  const allQuestionsAnswered = answeredQuestions.size >= workflowQuestions.length;
  const allReviewed = pendingReview.length === 0;
  const isTier3 = false;

  const answerQuestion = (qId: string) => {
    setAnsweredQuestions((prev) => new Set(prev).add(qId));
  };

  const handleReviewAction = useCallback(async (cardId: string, action: "approved" | "rejected") => {
    setReviewCards((prev) => prev.map((c) => c.id === cardId ? { ...c, status: action } : c));
    setCurrentReviewIndex((i) => Math.min(i + 1, reviewCards.length - 1));
    setEditingCard(null);
    toast(action === "approved" ? "✅ Post approved" : "❌ Post rejected", {
      duration: 2000,
    });

    try {
      await eventsApi.update(cardId, { review_status: action });
    } catch {
      // API not available — local state already updated
    }
  }, [reviewCards.length]);

  const handleRate = useCallback(async (cardId: string, rating: number) => {
    setReviewCards((prev) => prev.map((c) => c.id === cardId ? { ...c, rating } : c));
    toast(`⭐ Rated ${rating}/10`, { duration: 1500 });

    try {
      await eventsApi.rate(cardId, rating);
    } catch {
      // API not available — local state already updated
    }
  }, []);

  const handleEdit = (card: ReviewCard) => {
    setEditingCard(card.id);
    setEditContent(card.content);
  };

  const handleSaveEdit = async (cardId: string) => {
    setReviewCards((prev) => prev.map((c) => c.id === cardId ? { ...c, content: editContent } : c));
    setEditingCard(null);
    toast("✏️ Post updated", { duration: 1500 });

    try {
      await eventsApi.update(cardId, { review_edited_text: editContent });
    } catch {
      // API not available — local state already updated
    }
  };

  const handleSkip = useCallback(async (cardId: string) => {
    setReviewCards(prev => prev.map(c => c.id === cardId ? { ...c, status: "approved" } : c));
    toast("⏭ Skipped", { duration: 1500 });

    try {
      await eventsApi.update(cardId, { review_status: "approved" });
    } catch {
      // API not available — local state already updated
    }
  }, []);

  const nextStep = () => {
    if (currentStep === 2 && !isTier3) {
      setCurrentStep(4);
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleComplete = () => {
    setShowConfetti(true);
    setTodayComplete(true);
    setTimeout(() => {
      setDone(true);
      setTimeout(() => setShowConfetti(false), 1000);
    }, 800);
  };

  // Keyboard shortcuts for review step
  useEffect(() => {
    if (currentStep !== 1 || pendingReview.length === 0) return;
    const card = pendingReview[0];
    if (!card) return;

    const handler = (e: KeyboardEvent) => {
      if (editingCard) return; // Don't capture when editing
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "a" || e.key === "A") handleReviewAction(card.id, "approved");
      else if (e.key === "r" || e.key === "R") handleReviewAction(card.id, "rejected");
      else if (e.key === "s" || e.key === "S") handleSkip(card.id);
      else if (e.key === "e" || e.key === "E") handleEdit(card);
      else if (e.key >= "1" && e.key <= "9") handleRate(card.id, parseInt(e.key));
      else if (e.key === "0") handleRate(card.id, 10);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentStep, pendingReview, editingCard, handleReviewAction, handleRate, handleSkip]);

  const totalTime = stepMeta.reduce((acc, s) => acc + parseInt(s.time), 0);

  if (done) {
    return (
      <div className="h-full flex items-center justify-center">
        {showConfetti && <Confetti />}
        <div className="text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-4 pulse-ring">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h2 className="text-xl font-bold mb-2">Today complete!</h2>
          <p className="text-sm text-muted-foreground">See you tomorrow morning. ☕</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {showConfetti && <Confetti />}
      <KeyboardShortcuts />

      {/* Progress bar */}
      <div className="px-6 py-3 border-b border-border bg-card/30 shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Good morning, Luka. Here's your marketing today.
          </span>
          <span className="text-xs text-muted-foreground">~{totalTime} min total</span>
        </div>
        <div className="flex items-center gap-1">
          {stepMeta.map((s, i) => {
            const isSkipped = i === 3 && !isTier3;
            if (isSkipped) return null;
            return (
              <div key={i} className="flex-1 flex items-center gap-1">
                <div className={`h-1.5 flex-1 rounded-full transition-all ${
                  i < currentStep ? "bg-primary" : i === currentStep ? "bg-primary/50" : "bg-muted"
                }`} />
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-primary font-semibold">Step {currentStep + 1} of {isTier3 ? 5 : 4}</span>
          <span className="text-xs text-muted-foreground">• {stepMeta[currentStep]?.label} • ~{stepMeta[currentStep]?.time} remaining</span>
          {currentStep === 1 && (
            <span className="text-[10px] text-muted-foreground ml-auto font-mono">A approve · R reject · S skip · E edit · 1-9 rate</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* STEP 1: Answer Questions */}
          {currentStep === 0 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold mb-1">🔔 {workflowQuestions.length} questions from your team</h2>
              <p className="text-sm text-muted-foreground mb-6">Your workers need your input before they start today.</p>

              <div className="space-y-3">
                {workflowQuestions.map((q) => {
                  const answered = answeredQuestions.has(q.id);
                  return (
                    <div key={q.id} className={`glass-card rounded-xl p-4 transition-all ${answered ? "opacity-50 border-l-2 border-success" : "glow-border"}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{q.workerEmoji}</span>
                        <span className="text-sm font-semibold">{q.workerName} asks:</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">"{q.question}"</p>
                      {!answered ? (
                        <div className="flex gap-2">
                          {q.options.map((opt) => (
                            <button
                              key={opt.action}
                              onClick={() => answerQuestion(q.id)}
                              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-success font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Answered</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {allQuestionsAnswered && (
                <div className="mt-6 flex items-center justify-between animate-fade-in">
                  <span className="text-sm text-success font-medium flex items-center gap-1.5"><Check className="w-4 h-4" /> All answered</span>
                  <button onClick={nextStep} className="bg-primary text-primary-foreground text-sm font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 transition-all flex items-center gap-1.5">
                    Next step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Review Content — Card Stack */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">📝 {reviewCards.length} posts ready for review</h2>
                <span className="text-sm text-muted-foreground">{reviewCards.length - pendingReview.length} / {reviewCards.length}</span>
              </div>

              {!allReviewed ? (
                <div className="relative" style={{ minHeight: "340px" }}>
                  {/* Next card peek (behind) */}
                  {pendingReview.length > 1 && (
                    <div className="absolute inset-x-3 top-3 glass-card rounded-xl p-5 opacity-30 scale-[0.97] pointer-events-none border border-border/30" style={{ zIndex: 0 }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">{pendingReview[1].workerEmoji}</span>
                        <span className="text-sm font-semibold">{pendingReview[1].workerName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">"{pendingReview[1].content}"</p>
                    </div>
                  )}

                  {/* Third card peek */}
                  {pendingReview.length > 2 && (
                    <div className="absolute inset-x-6 top-5 glass-card rounded-xl p-5 opacity-15 scale-[0.94] pointer-events-none border border-border/20" style={{ zIndex: -1 }}>
                      <div className="h-12" />
                    </div>
                  )}

                  {/* Current card */}
                  {(() => {
                    const card = pendingReview[0];
                    if (!card) return null;
                    return (
                      <div key={card.id} className="relative glass-card-strong rounded-xl p-6 glow-border animate-scale-in" style={{ zIndex: 1 }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{card.workerEmoji}</span>
                            <span className="text-sm font-semibold">{card.workerName}</span>
                          </div>
                          <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{card.skill}</span>
                        </div>

                        {editingCard === card.id ? (
                          <div className="mb-4">
                            <textarea
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                              rows={5}
                              className="w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-all"
                            />
                            <div className="flex gap-2 mt-2">
                              <button onClick={() => handleSaveEdit(card.id)} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium">Save</button>
                              <button onClick={() => setEditingCard(null)} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground leading-relaxed mb-5 min-h-[60px]">"{card.content}"</p>
                        )}

                        {/* Numbered Rating 1-10 */}
                        <div className="flex items-center gap-1.5 mb-5">
                          <span className="text-xs text-muted-foreground mr-1">Rate:</span>
                          {Array.from({ length: 10 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => handleRate(card.id, i + 1)}
                              className={`w-7 h-7 rounded-md text-xs font-semibold flex items-center justify-center transition-all border ${
                                i + 1 === card.rating
                                  ? "bg-primary text-primary-foreground border-primary"
                                  : i < card.rating
                                  ? "bg-primary/15 text-primary border-primary/30"
                                  : "bg-muted/30 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          {card.rating > 0 && (
                            <span className="text-xs text-primary font-bold ml-1">{card.rating}/10</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => handleReviewAction(card.id, "approved")} className="flex-1 text-xs font-medium py-2.5 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-colors">
                            ✅ Approve
                          </button>
                          <button onClick={() => handleEdit(card)} className="flex-1 text-xs font-medium py-2.5 rounded-lg bg-info/15 text-info hover:bg-info/25 transition-colors">
                            ✏️ Edit
                          </button>
                          <button onClick={() => handleReviewAction(card.id, "rejected")} className="flex-1 text-xs font-medium py-2.5 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">
                            ❌ Reject
                          </button>
                          <button onClick={() => handleSkip(card.id)} className="text-xs font-medium py-2.5 px-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
                            ⏭ Skip
                          </button>
                        </div>

                        <div className="text-center mt-4">
                          <span className="text-[10px] text-muted-foreground">
                            {reviewCards.length - pendingReview.length + 1} of {reviewCards.length}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-8 animate-fade-in">
                  <span className="text-success text-lg">✅</span>
                  <p className="text-sm font-medium mt-2">All content reviewed</p>
                </div>
              )}

              {allReviewed && (
                <div className="mt-6 flex justify-end animate-fade-in">
                  <button onClick={nextStep} className="bg-primary text-primary-foreground text-sm font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 transition-all flex items-center gap-1.5">
                    Next step <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Check Improvements */}
          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold mb-6">📈 This week's improvements</h2>

              {/* Best post callout */}
              <div className="glass-card-strong rounded-xl p-5 gradient-border mb-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">🏆</span>
                  <span className="text-sm font-bold text-primary">Your best post this week</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span>{bestPost.workerEmoji}</span>
                  <span className="text-xs font-semibold">{bestPost.workerName}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">"{bestPost.content}"</p>
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <span>👁 {bestPost.impressions.toLocaleString()}</span>
                  <span>🔖 {bestPost.saves}</span>
                  <span>💬 {bestPost.comments}</span>
                </div>
              </div>

              <div className="glass-card rounded-xl p-5 space-y-4">
                {improvementsSummary.map((imp, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">{imp.workerEmoji}</span>
                      <span className="text-sm font-semibold">{imp.workerName} learned:</span>
                    </div>
                    <ul className="ml-8 space-y-1">
                      <li className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="text-success text-xs">●</span>
                        "{imp.learned}" <span className="text-[10px] text-primary font-medium">← new</span>
                      </li>
                      {imp.stopped && (
                        <li className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="text-destructive text-xs">●</span>
                          Stopped: {imp.stopped}
                        </li>
                      )}
                    </ul>
                  </div>
                ))}

                <div className="pt-3 border-t border-border">
                  <p className="text-sm font-medium">📊 Overall: {overallImprovement}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button onClick={nextStep} className="bg-primary text-primary-foreground text-sm font-semibold rounded-lg px-5 py-2.5 hover:opacity-90 transition-all flex items-center gap-1.5">
                  Got it <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Approve Strategy (Tier 3 — Agent Plan style) */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              {isTier3 ? (
                <div>
                  <h2 className="text-lg font-bold mb-2">📋 This Week's Content Pillar</h2>
                  <p className="text-sm text-muted-foreground mb-6">Your strategist aligned all workers around one theme.</p>

                  <div className="glass-card-strong rounded-xl p-5 gradient-border mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                        <span className="text-sm">🎯</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-primary font-semibold uppercase tracking-wider">Weekly Theme</span>
                        <h3 className="text-sm font-bold">{weeklyPillar.title}</h3>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {weeklyPillar.angles.map((angle, i) => (
                        <div key={i} className="flex items-start gap-3 glass-card rounded-lg p-3">
                          <div className="w-5 h-5 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] text-primary font-bold">{i + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-semibold">{angle.worker}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">{angle.plan}</p>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-success neon-dot-green shrink-0 mt-1.5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={nextStep} className="flex-1 bg-primary text-primary-foreground text-sm font-semibold rounded-lg py-2.5 hover:opacity-90 transition-all">
                      ✅ Approve Plan
                    </button>
                    <button onClick={nextStep} className="text-sm py-2.5 px-4 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all">
                      Skip
                    </button>
                  </div>
                </div>
              ) : (
                <div className="glass-card rounded-xl p-6 text-center">
                  <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-sm font-semibold mb-2">Strategy Suite</h3>
                  <p className="text-xs text-muted-foreground mb-4">
                    Get weekly content pillars that align all your workers around one powerful theme.
                  </p>
                  <button className="text-xs bg-primary text-primary-foreground font-semibold rounded-lg px-4 py-2 hover:opacity-90 transition-all">
                    Upgrade to Strategy Suite →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Post & Go */}
          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-lg font-bold mb-6">🚀 Today's plan</h2>

              <div className="glass-card rounded-xl p-5 mb-6 space-y-2">
                <p className="text-sm text-muted-foreground">• {postSummary.xPosts.total} X posts scheduled ({postSummary.xPosts.auto} auto-post, {postSummary.xPosts.needScreenshots} need screenshots)</p>
                <p className="text-sm text-muted-foreground">• {postSummary.redditDrafts} Reddit comment drafts ready</p>
                <p className="text-sm text-muted-foreground">• {postSummary.engagementReplies} engagement replies queued</p>
              </div>

              <div className="space-y-2">
                <button onClick={handleComplete} className="w-full text-sm font-medium py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                  📸 I'll add screenshots now
                </button>
                <button onClick={handleComplete} className="w-full bg-primary text-primary-foreground text-sm font-semibold rounded-lg py-2.5 hover:opacity-90 transition-all">
                  ✅ All good, post everything
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodayWorkflow;
