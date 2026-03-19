import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import AIVoiceInput from "./AIVoiceInput";
import VanishInput from "../ui/VanishInput";

interface AIPromptBoxProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  vanishPlaceholders?: string[];
}

const AIPromptBox = ({ onSend, isLoading, disabled, placeholder = "Type a message..." }: AIPromptBoxProps) => {
  const [value, setValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 80)}px`;
  }, [value]);

  const handleSend = () => {
    if (!value.trim() || isLoading || disabled) return;
    onSend(value.trim());
    setValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (text: string) => {
    setValue((prev) => (prev ? `${prev} ${text}` : text));
    inputRef.current?.focus();
  };

  const canSend = value.trim().length > 0 && !isLoading && !disabled;

  return (
    <div
      className={`relative flex items-end gap-1.5 rounded-lg border bg-background/50 px-3 py-2 transition-all duration-200 ${
        isFocused
          ? "border-primary/40 ring-1 ring-primary/20 shadow-[0_0_12px_hsl(var(--primary)/0.08)]"
          : "border-border hover:border-border/80"
      } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {/* Auto-expanding textarea */}
      <textarea
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        disabled={disabled || isLoading}
        rows={1}
        className="flex-1 resize-none bg-transparent text-xs leading-relaxed outline-none placeholder:text-muted-foreground min-h-[20px] max-h-[80px] py-0.5"
      />

      {/* Voice input */}
      <AIVoiceInput
        onTranscript={handleVoiceTranscript}
        disabled={disabled || isLoading}
        className="shrink-0 w-6 h-6 rounded-md hover:bg-muted/50"
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={!canSend}
        className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
          canSend
            ? "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
            : "text-muted-foreground/40"
        }`}
        type="button"
      >
        {isLoading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Send className="w-3 h-3" />
        )}
      </button>
    </div>
  );
};

export default AIPromptBox;
