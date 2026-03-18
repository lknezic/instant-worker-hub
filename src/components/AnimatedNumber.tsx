import { useState, useEffect } from "react";

interface Props {
  value: string; // e.g. "1.2%", "+50%", "-9%"
  duration?: number;
  className?: string;
}

const AnimatedNumber = ({ value, duration = 1200, className = "" }: Props) => {
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    // Extract numeric part and suffix
    const match = value.match(/^([+-]?)(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const sign = match[1];
    const target = parseFloat(match[2]);
    const suffix = match[3];
    const hasDecimal = match[2].includes(".");
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (hasDecimal) {
        setDisplay(`${sign}${current.toFixed(1)}${suffix}`);
      } else {
        setDisplay(`${sign}${Math.round(current)}${suffix}`);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span className={className}>{display}</span>;
};

export default AnimatedNumber;
