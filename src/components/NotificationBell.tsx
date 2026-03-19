import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { notificationsApi } from "@/lib/api";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

const typeIcon: Record<string, string> = {
  judge: "📊",
  guardian_block: "🛡️",
  post_published: "✍️",
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchNotifications = () => {
    notificationsApi.list(20)
      .then((d) => {
        setNotifications(d.notifications as Notification[]);
        setUnreadCount(d.unread_count);
      })
      .catch(() => {});
  };

  // Fetch on mount + when popover opens
  useEffect(() => { fetchNotifications(); }, []);
  useEffect(() => { if (open) fetchNotifications(); }, [open]);

  const handleMarkAllRead = async () => {
    await notificationsApi.readAll().catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
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
            <button onClick={handleMarkAllRead} className="text-[10px] text-primary hover:text-primary/80 font-medium transition-colors">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <span className="text-lg block mb-1">🔔</span>
              <p className="text-xs text-muted-foreground">No notifications yet. Activity from your workers will appear here.</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-2.5 px-3 py-2.5 border-b border-border/50 transition-colors hover:bg-card/80 ${!n.read ? "bg-primary/5" : ""}`}
              >
                <span className="text-sm mt-0.5">{typeIcon[n.type] || "🔔"}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${!n.read ? "text-foreground font-medium" : "text-muted-foreground"}`}>{n.title}</p>
                  {n.body && <p className="text-[10px] text-muted-foreground line-clamp-1">{n.body}</p>}
                  <span className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</span>
                </div>
                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
