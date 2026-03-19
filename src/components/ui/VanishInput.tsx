import { useState, useEffect, useRef, useCallback } from "react";

interface VanishInputProps {
  placeholders: string[];
  onSubmit: (value: string) => void;
  disabled?: boolean;
  className?: string;
  cycleInterval?: number;
}

const VanishInput = ({
  placeholders,
  onSubmit,
  disabled,
  className = "",
  cycleInterval = 3000,
}: VanishInputProps) => {
  const [value, setValue] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isVanishing, setIsVanishing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Rotate placeholders when input is empty
  useEffect(() => {
    if (value || disabled) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setPlaceholderIndex((i) => (i + 1) % placeholders.length);
        setIsTransitioning(false);
      }, 300);
    }, cycleInterval);
    return () => clearInterval(interval);
  }, [value, disabled, placeholders.length, cycleInterval]);

  const handleSubmit = useCallback(() => {
    if (!value.trim() || disabled) return;

    // Vanish animation
    setIsVanishing(true);
    setTimeout(() => {
      onSubmit(value.trim());
      setValue("");
      setIsVanishing(false);
      inputRef.current?.focus();
    }, 400);
  }, [value, disabled, onSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled || isVanishing}
        className={`w-full bg-transparent text-xs outline-none transition-all duration-300 ${
          isVanishing
            ? "opacity-0 translate-y-2 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
        placeholder=""
      />
      {/* Custom animated placeholder */}
      {!value && (
        <span
          className={`absolute left-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none transition-all duration-300 ${
            isTransitioning
              ? "opacity-0 -translate-y-full"
              : "opacity-100 translate-y-[-50%]"
          }`}
        >
          {placeholders[placeholderIndex]}
        </span>
      )}
    </div>
  );
};

export default VanishInput;
