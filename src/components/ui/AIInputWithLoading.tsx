import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Search } from "lucide-react";

interface AIInputWithLoadingProps {
  onSubmit: (value: string) => void;
  isLoading?: boolean;
  loadingPhrases?: string[];
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  label?: string;
  className?: string;
  multiline?: boolean;
  rows?: number;
}

const AIInputWithLoading = ({
  onSubmit,
  isLoading = false,
  loadingPhrases = ["Processing...", "Analyzing...", "Almost there..."],
  placeholder = "Enter a value...",
  disabled,
  icon,
  label,
  className = "",
  multiline = false,
  rows = 1,
}: AIInputWithLoadingProps) => {
  const [value, setValue] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [phraseFading, setPhraseFading] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Cycle through loading phrases with fade transition
  useEffect(() => {
    if (!isLoading) {
      setPhraseIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setPhraseFading(true);
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % loadingPhrases.length);
        setPhraseFading(false);
      }, 200);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading, loadingPhrases.length]);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || isLoading || disabled) return;
    onSubmit(value.trim());
  }, [value, isLoading, disabled, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const InputComponent = multiline ? "textarea" : "input";

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1.5">{label}</label>
      )}
      <div
        className={`relative flex items-center gap-2 rounded-lg border bg-background/50 transition-all duration-300 ${
          isLoading
            ? "border-primary/30 shadow-[0_0_20px_hsl(var(--primary)/0.06)]"
            : "border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20"
        }`}
      >
        {/* Icon or loading spinner */}
        <div className="pl-3 flex items-center">
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : icon ? (
            <span className="text-muted-foreground">{icon}</span>
          ) : (
            <Search className="w-4 h-4 text-muted-foreground" />
          )}
        </div>

        {/* Input or loading phrase */}
        {isLoading ? (
          <div className="flex-1 py-2.5 pr-3">
            <span
              className={`text-sm text-primary/80 transition-opacity duration-200 ${
                phraseFading ? "opacity-0" : "opacity-100"
              }`}
            >
              {loadingPhrases[phraseIndex]}
            </span>
            {/* Progress bar */}
            <div className="mt-2 h-0.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/60 rounded-full transition-all duration-[2000ms] ease-linear"
                style={{
                  width: `${((phraseIndex + 1) / loadingPhrases.length) * 100}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <InputComponent
            ref={inputRef as any}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={multiline ? rows : undefined}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground py-2.5 pr-3 resize-none"
          />
        )}
      </div>
    </div>
  );
};

export default AIInputWithLoading;
