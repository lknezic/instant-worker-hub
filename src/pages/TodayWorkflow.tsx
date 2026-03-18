import { useState } from "react";
import { workflowQuestions, reviewCards as initialReviewCards, improvementsSummary, overallImprovement, postSummary, type ReviewCard } from "@/data/mockData";
import { Check, ChevronRight, Sparkles, Star } from "lucide-react";

const stepMeta = [
  { label: "Answer Questions", time: "2 min" },
  { label: "Review Content", time: "5 min" },
  { label: "Check Improvements", time: "1 min" },
  { label: "Approve Strategy", time: "1 min" },
  { label: "Post & Go", time: "1 min" },
];

const TodayWorkflow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [reviewCards, setReviewCards] = useState<ReviewCard[]>(initialReviewCards);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [done, setDone] = useState(false);

  const pendingReview = reviewCards.filter((c) => c.status === "pending");
  const allQuestionsAnswered = answeredQuestions.size >= workflowQuestions.length;
  const allReviewed = pendingReview.length === 0;
  // Skip step 3 (strategy) for tier 1/2
  const isTier3 = false;

  const answerQuestion = (qId: string) => {
    setAnsweredQuestions((prev) => new Set(prev).add(qId));
  };

  const handleReviewAction = (cardId: string, action: "approved" | "rejected") => {
    setReviewCards((prev) => prev.map((c) => c.id === cardId ? { ...c, status: action } : c));
    setCurrentReviewIndex((i) => Math.min(i + 1, reviewCards.length - 1));
    setEditingCard(null);
  };

  const handleRate = (cardId: string, rating: number) => {
    setReviewCards((prev) => prev.map((c) => c.id === cardId ? { ...c, rating } : c));
  };

  const handleEdit = (card: ReviewCard) => {
    setEditingCard(card.id);
    setEditContent(card.content);
  };

  const handleSaveEdit = (cardId: string) => {
    setReviewCards((prev) => prev.map((c) => c.id === cardId ? { ...c, content: editContent } : c));
    setEditingCard(null);
  };

  const nextStep = () => {
    if (currentStep === 2 && !isTier3) {
      setCurrentStep(4); // Skip strategy step
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  const totalTime = stepMeta.reduce((acc, s) => acc + parseInt(s.time), 0);

  if (done) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center animate-scale-in">
          <div className="text-5xl mb-4">☕</div>
          <h2 className="text-xl font-bold mb-2">Today complete!</h2>
          <p className="text-sm text-muted-foreground">See you tomorrow morning.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
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

          {/* STEP 2: Review Content */}
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold">📝 {reviewCards.length} posts ready for review</h2>
                <span className="text-sm text-muted-foreground">{reviewCards.length - pendingReview.length} / {reviewCards.length}</span>
              </div>

              {!allReviewed ? (
                (() => {
                  const card = pendingReview[0];
                  if (!card) return null;
                  return (
                    <div key={card.id} className="glass-card-strong rounded-xl p-5 glow-border animate-scale-in">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{card.workerEmoji}</span>
                          <span className="text-sm font-semibold">{card.workerName}</span>
                        </div>
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{card.skill}</span>
                      </div>

                      {editingCard === card.id ? (
                        <div className="mb-4">
                          <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={4}
                            className="w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none transition-all"
                          />
                          <div className="flex gap-2 mt-2">
                            <button onClick={() => handleSaveEdit(card.id)} className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-medium">Save</button>
                            <button onClick={() => setEditingCard(null)} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5">Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{card.content}"</p>
                      )}

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 mb-4">
                        <span className="text-xs text-muted-foreground mr-1">Rate:</span>
                        {Array.from({ length: 10 }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => handleRate(card.id, i + 1)}
                            className={`w-5 h-5 rounded text-xs flex items-center justify-center transition-all ${
                              i < card.rating ? "text-primary" : "text-muted-foreground/20"
                            }`}
                          >
                            <Star className="w-3.5 h-3.5" fill={i < card.rating ? "currentColor" : "none"} />
                          </button>
                        ))}
                        {card.rating > 0 && <span className="text-xs text-primary font-semibold ml-1">{card.rating}/10</span>}
                      </div>

                      <div className="flex gap-2">
                        <button onClick={() => handleReviewAction(card.id, "approved")} className="flex-1 text-xs font-medium py-2 rounded-lg bg-success/15 text-success hover:bg-success/25 transition-colors">
                          ✅ Approve
                        </button>
                        <button onClick={() => handleEdit(card)} className="flex-1 text-xs font-medium py-2 rounded-lg bg-info/15 text-info hover:bg-info/25 transition-colors">
                          ✏️ Edit
                        </button>
                        <button onClick={() => handleReviewAction(card.id, "rejected")} className="flex-1 text-xs font-medium py-2 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">
                          ❌ Reject
                        </button>
                        <button onClick={() => { setReviewCards(prev => prev.map(c => c.id === card.id ? { ...c, status: "approved" } : c)); }} className="text-xs font-medium py-2 px-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">
                          ⏭ Skip
                        </button>
                      </div>
                    </div>
                  );
                })()
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

          {/* STEP 4: Approve Strategy (Tier 3 only — show teaser for others) */}
          {currentStep === 3 && (
            <div className="animate-fade-in">
              {isTier3 ? (
                <div>
                  <h2 className="text-lg font-bold mb-6">📋 This Week's Content Pillar</h2>
                  {/* Tier 3 content would go here */}
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
                <button onClick={() => setDone(true)} className="w-full text-sm font-medium py-2.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all">
                  📸 I'll add screenshots now
                </button>
                <button onClick={() => setDone(true)} className="w-full bg-primary text-primary-foreground text-sm font-semibold rounded-lg py-2.5 hover:opacity-90 transition-all">
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
