import { useState } from "react";
import { kanbanCards as initialCards, type KanbanCard } from "@/data/mockData";

const columns = [
  { key: "pending" as const, label: "PENDING", dotColor: "bg-warning" },
  { key: "approved" as const, label: "APPROVED", dotColor: "bg-info" },
  { key: "posted" as const, label: "POSTED", dotColor: "bg-success" },
  { key: "rejected" as const, label: "REJECTED", dotColor: "bg-destructive" },
];

const Dashboard = () => {
  const [cards, setCards] = useState<KanbanCard[]>(initialCards);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskWorker, setNewTaskWorker] = useState("w1");

  const updateCard = (id: string, updates: Partial<KanbanCard>) => {
    setCards((c) => c.map((card) => card.id === id ? { ...card, ...updates } : card));
  };

  const addTask = () => {
    if (!newTaskContent.trim()) return;
    const newCard: KanbanCard = {
      id: `k${Date.now()}`,
      workerId: newTaskWorker,
      workerEmoji: "✍️",
      workerName: "X Poster",
      skill: "custom",
      content: newTaskContent,
      status: "pending",
      rating: 0,
    };
    setCards((c) => [...c, newCard]);
    setNewTaskContent("");
    setShowAddModal(false);
  };

  const StarRating = ({ rating, cardId }: { rating: number; cardId: string }) => (
    <div className="flex gap-px">
      {Array.from({ length: 10 }, (_, i) => (
        <button
          key={i}
          onClick={() => updateCard(cardId, { rating: i + 1 })}
          className={`w-3.5 h-3.5 rounded-sm text-[9px] flex items-center justify-center transition-all ${
            i < rating ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground/20"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Stats bar */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-8 text-sm shrink-0 bg-card/30">
        {[
          { label: "Posts this week", value: "15/35", color: "text-foreground" },
          { label: "Pending", value: "7", color: "text-warning" },
          { label: "Engagement", value: "2.3%", color: "text-success" },
          { label: "Grade", value: "B+", color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="flex items-baseline gap-2">
            <span className="text-muted-foreground text-xs">{stat.label}</span>
            <span className={`font-display font-semibold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Strategy banner */}
      <div className="mx-6 mt-4 px-4 py-2.5 glass-card rounded-lg flex items-center justify-between shrink-0">
        <span className="text-sm text-muted-foreground">
          Upgrade to <span className="text-foreground font-medium">Strategy Suite</span> for weekly content pillars
        </span>
        <span className="text-[10px] font-display font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
          Coming Soon
        </span>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="grid grid-cols-4 gap-3 h-full min-w-[800px]">
          {columns.map((col) => {
            const colCards = cards.filter((c) => c.status === col.key);
            return (
              <div key={col.key} className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${col.dotColor}`} />
                    <span className="text-[11px] font-display font-semibold tracking-widest text-muted-foreground">{col.label}</span>
                    <span className="text-[11px] text-muted-foreground/50">{colCards.length}</span>
                  </div>
                  {col.key === "pending" && (
                    <button onClick={() => setShowAddModal(true)} className="text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                      + Add
                    </button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {colCards.map((card) => (
                    <div key={card.id} className="glass-card rounded-lg p-3 glow-border">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-sm">{card.workerEmoji}</span>
                        <span className="text-xs font-display font-medium">{card.workerName}</span>
                      </div>
                      <span className="inline-block text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-medium mb-2">
                        {card.skill}
                      </span>
                      <p className="text-xs text-muted-foreground line-clamp-3 mb-2.5 leading-relaxed">{card.content}</p>

                      {card.status === "posted" && card.metrics && (
                        <p className="text-[11px] text-muted-foreground/70 mb-2">
                          👁 {card.metrics.views.toLocaleString()} · 🔖 {card.metrics.saves} · 💬 {card.metrics.comments}
                        </p>
                      )}

                      <StarRating rating={card.rating} cardId={card.id} />

                      {card.status === "pending" && (
                        <div className="flex gap-1.5 mt-2.5">
                          <button onClick={() => updateCard(card.id, { status: "approved" })} className="flex-1 text-[11px] font-medium py-1 rounded-md bg-success/15 text-success hover:bg-success/25 transition-colors">
                            Approve
                          </button>
                          <button className="flex-1 text-[11px] font-medium py-1 rounded-md bg-info/15 text-info hover:bg-info/25 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => updateCard(card.id, { status: "rejected" })} className="flex-1 text-[11px] font-medium py-1 rounded-md bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors">
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="glass-card-strong rounded-xl p-6 w-full max-w-md gradient-border animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display font-semibold mb-4">Add Task</h3>
            <textarea
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="Write the content..."
              rows={4}
              className="w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary/50 placeholder:text-muted-foreground resize-none mb-3 transition-all"
            />
            <select
              value={newTaskWorker}
              onChange={(e) => setNewTaskWorker(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-4"
            >
              <option value="w1">✍️ X Poster</option>
              <option value="w2">💬 X Engagement</option>
              <option value="w3">🗣️ Reddit Commenter</option>
              <option value="w4">📝 Reddit Flagship</option>
              <option value="w5">♻️ Content Recycler</option>
            </select>
            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 text-sm py-2.5 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-all">Cancel</button>
              <button onClick={addTask} className="flex-1 text-sm py-2.5 bg-primary text-primary-foreground rounded-lg btn-glow hover:opacity-90 transition-all font-display font-semibold">Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
