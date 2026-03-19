import { Bell } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const NotificationBell = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all">
          <Bell className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start" className="w-72 p-0 bg-card border-border">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border">
          <span className="text-xs font-semibold">Notifications</span>
        </div>
        <div className="px-3 py-6 text-center">
          <span className="text-lg block mb-1">🔔</span>
          <p className="text-xs text-muted-foreground">No notifications yet. Activity from your workers will appear here.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationBell;
