import { useState } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const notifications = [
  { id: 1, icon: "✍️", text: "X Poster generated 3 posts", time: "2m ago", unread: true },
  { id: 2, icon: "📊", text: "Judge ran — 2 new insights", time: "15m ago", unread: true },
  { id: 3, icon: "🛡️", text: "Guardian blocked 1 post", time: "1h ago", unread: true },
  { id: 4, icon: "💬", text: "X Engagement replied to 5 threads", time: "2h ago", unread: false },
  { id: 5, icon: "📝", text: "Reddit Flagship drafted a case study", time: "3h ago", unread: false },
];

const NotificationBell = () => {
  const [read, setRead] = useState<Set<number>>(new Set());
  const unreadCount = notifications.filter((n) => n.unread && !read.has(n.id)).length;

  const markAllRead = () => {
    setRead(new Set(notifications.map((n) => n.id)));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground text-[8px] font-bold flex items-center justify-center animate-scale-in">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="w-72 p-0 bg-card border-border">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <span className="text-xs font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="text-[10px] text-primary hover:text-primary/80 font-medium transition-colors">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.map((n) => {
            const isUnread = n.unread && !read.has(n.id);
            return (
              <div
                key={n.id}
                className={`flex items-start gap-2.5 px-3 py-2.5 border-b border-border/50 transition-colors hover:bg-card/80 ${isUnread ? "bg-primary/5" : ""}`}
              >
                <span className="text-sm mt-0.5">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${isUnread ? "text-foreground font-medium" : "text-muted-foreground"}`}>{n.text}</p>
                  <span className="text-[10px] text-muted-foreground">{n.time}</span>
                </div>
                {isUnread && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
