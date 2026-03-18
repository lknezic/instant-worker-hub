import { useState } from "react";
import { kanbanCards as initialCards, type KanbanCard } from "@/data/mockData";

const columns = [
  { key: "pending" as const, label: "PENDING", color: "text-warning" },
  { key: "approved" as const, label: "APPROVED", color: "text-info" },
  { key: "posted" as const, label: "POSTED", color: "text-success" },
  { key: "rejected" as const, label: "REJECTED", color: "text-destructive" },
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
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }, (_, i) => (
        <button
          key={i}
          onClick={() => updateCard(cardId, { rating: i + 1 })}
          className={`text-xs transition-colors ${i < rating ? "text-primary" : "text-muted-foreground/30"}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Stats bar */}
      <div className="px-6 py-3 border-b border-border flex items-center gap-6 text-sm shrink-0">
        <span>Posts this week: <span className="text-foreground font-medium">15/35</span></span>
        <span>Pending: <span className="text-warning font-medium">7</span></span>
        <span>Engagement: <span className="text-success font-medium">2.3%</span></span>
        <span>Grade: <span className="text-primary font-medium">B+</span></span>
      </div>

      {/* Strategy banner */}
      <div className="mx-6 mt-4 px-4 py-2.5 bg-card/50 border border-border rounded-md flex items-center justify-between shrink-0">
        <span className="text-sm text-muted-foreground">
          ✨ Upgrade to Strategy Suite for weekly content pillars
        </span>
        <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Coming Soon</span>
      </div>

      {/* Kanban */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="grid grid-cols-4 gap-4 h-full min-w-[800px]">
          {columns.map((col) => {
            const colCards = cards.filter((c) => c.status === col.key);
            return (
              <div key={col.key} className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold tracking-wider ${col.color}`}>{col.label}</span>
                    <span className="text-xs text-muted-foreground">{colCards.length}</span>
                  </div>
                  {col.key === "pending" && (
                    <button onClick={() => setShowAddModal(true)} className="text-xs text-primary hover:underline">+ Add Task</button>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                  {colCards.map((card) => (
                    <div key={card.id} className="bg-card border border-border rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-sm">{card.workerEmoji}</span>
                        <span className="text-xs font-medium">{card.workerName}</span>
                      </div>
                      <span className="inline-block text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded mb-2">{card.skill}</span>
                      <p className="text-xs text-muted-foreground line-clamp-3 mb-2">{card.content}</p>

                      {card.status === "posted" && card.metrics && (
                        <p className="text-xs text-muted-foreground mb-2">
                          👁 {card.metrics.views.toLocaleString()} · 🔖 {card.metrics.saves} · 💬 {card.metrics.comments}
                        </p>
                      )}

                      <StarRating rating={card.rating} cardId={card.id} />

                      {card.status === "pending" && (
                        <div className="flex gap-1.5 mt-2">
                          <button onClick={() => updateCard(card.id, { status: "approved" })} className="flex-1 text-xs py-1 rounded bg-success/20 text-success hover:bg-success/30 transition-colors">
                            Approve
                          </button>
                          <button className="flex-1 text-xs py-1 rounded bg-info/20 text-info hover:bg-info/30 transition-colors">
                            Edit
                          </button>
                          <button onClick={() => updateCard(card.id, { status: "rejected" })} className="flex-1 text-xs py-1 rounded bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors">
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
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-sm font-semibold mb-4">Add Task</h3>
            <textarea
              value={newTaskContent}
              onChange={(e) => setNewTaskContent(e.target.value)}
              placeholder="Write the content..."
              rows={4}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground resize-none mb-3"
            />
            <select
              value={newTaskWorker}
              onChange={(e) => setNewTaskWorker(e.target.value)}
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary mb-4"
            >
              <option value="w1">✍️ X Poster</option>
              <option value="w2">💬 X Engagement</option>
              <option value="w3">🗣️ Reddit Commenter</option>
              <option value="w4">📝 Reddit Flagship</option>
              <option value="w5">♻️ Content Recycler</option>
            </select>
            <div className="flex gap-2">
              <button onClick={() => setShowAddModal(false)} className="flex-1 text-sm py-2 border border-border rounded-md text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
              <button onClick={addTask} className="flex-1 text-sm py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity font-medium">Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
