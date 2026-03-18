import { useState } from "react";
import { Keyboard } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const shortcuts = [
  { key: "A", action: "Approve post" },
  { key: "R", action: "Reject post" },
  { key: "S", action: "Skip post" },
  { key: "E", action: "Edit post" },
  { key: "1-9", action: "Rate post (1-9)" },
  { key: "0", action: "Rate post (10)" },
  { key: "→", action: "Next step" },
];

const KeyboardShortcuts = () => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="fixed bottom-4 right-4 z-40 w-8 h-8 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-all glow-border">
        <span className="text-xs font-mono font-bold">?</span>
      </button>
    </PopoverTrigger>
    <PopoverContent side="top" align="end" className="w-56 p-0 bg-card border-border">
      <div className="px-3 py-2.5 border-b border-border">
        <span className="text-xs font-semibold flex items-center gap-1.5">
          <Keyboard className="w-3 h-3" /> Keyboard Shortcuts
        </span>
      </div>
      <div className="p-2">
        {shortcuts.map((s) => (
          <div key={s.key} className="flex items-center justify-between px-2 py-1.5">
            <span className="text-xs text-muted-foreground">{s.action}</span>
            <kbd className="text-[10px] font-mono font-bold bg-muted px-1.5 py-0.5 rounded border border-border">{s.key}</kbd>
          </div>
        ))}
      </div>
    </PopoverContent>
  </Popover>
);

export default KeyboardShortcuts;
