import { useEffect, useRef, useState, useCallback } from 'react';

interface ScrollRevealTextProps {
  /** The text to reveal */
  text: string;
  /** CSS class name */
  className?: string;
  /** Delay between character reveals in ms */
  charDelay?: number;
  /** Whether to split by character or by sentence (。！？) */
  mode?: 'char' | 'sentence';
  /** Custom threshold for intersection */
  threshold?: number;
}

export default function ScrollRevealText({
  text,
  className = '',
  charDelay = 30,
  mode = 'char',
  threshold = 0.2,
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);

  // Split text based on mode
  const segments = (() => {
    if (mode === 'sentence') {
      // Split on Chinese sentence-ending punctuation
      const parts: string[] = [];
      let current = '';
      for (const char of text) {
        current += char;
        if ('。！？；'.includes(char)) {
          parts.push(current);
          current = '';
        }
      }
      if (current) parts.push(current);
      return parts;
    }
    return text.split('');
  })();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!isVisible) return;

    if (revealedCount < segments.length) {
      const timer = setTimeout(() => {
        setRevealedCount((prev) => prev + 1);
      }, charDelay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, revealedCount, segments.length, charDelay]);

  return (
    <div ref={containerRef} className={`leading-relaxed ${className}`}>
      {segments.map((segment, idx) => (
        <span
          key={idx}
          className="transition-all duration-500 ease-out"
          style={{
            opacity: idx < revealedCount ? 1 : 0,
            transform: idx < revealedCount ? 'translateY(0)' : 'translateY(8px)',
            filter: idx < revealedCount ? 'blur(0)' : 'blur(4px)',
            display: mode === 'char' ? 'inline' : 'inline',
          }}
        >
          {segment}
        </span>
      ))}
    </div>
  );
}
