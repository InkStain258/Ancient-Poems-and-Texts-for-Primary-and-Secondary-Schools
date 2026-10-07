import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface AnnotationPopupProps {
  term: string;
  note: string;
  x: number;
  y: number;
  onClose: () => void;
}

function AnnotationPopup({ term, note, x, y, onClose }: AnnotationPopupProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [adjustedTop, setAdjustedTop] = useState(y - 10);

  // Measure actual height after render and adjust position upward
  useEffect(() => {
    if (ref.current) {
      const popupHeight = ref.current.offsetHeight;
      setAdjustedTop(Math.max(8, y - popupHeight - 8));
    }
  }, [y]);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const popupWidth = 288; // w-72
  const style: React.CSSProperties = {
    position: 'fixed',
    left: Math.max(8, Math.min(x, window.innerWidth - popupWidth - 16)),
    top: adjustedTop,
    zIndex: 9999,
  };

  const popup = (
    <div
      ref={ref}
      style={style}
      className="w-72 bg-popover border rounded-lg shadow-2xl p-3 animate-scale-in"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-bold text-primary">{term}</span>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          ✕
        </button>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
    </div>
  );

  // Render via Portal to body to escape parent stacking context
  return createPortal(popup, document.body);
}

interface InteractivePoemTextProps {
  original: string;
  annotations: Array<{ term: string; note: string }>;
  sentences?: string[];
}

export default function InteractivePoemText({ original, annotations, sentences }: InteractivePoemTextProps) {
  const [popup, setPopup] = useState<{ term: string; note: string; x: number; y: number } | null>(null);

  // Build a map of annotation terms
  const termMap = new Map(annotations.map((a) => [a.term, a.note]));

  const handlePopupClose = useCallback(() => setPopup(null), []);

  // Split original text by annotation terms, creating highlighted segments
  const renderText = () => {
    if (annotations.length === 0) {
      return <span>{original}</span>;
    }

    // Sort terms by length (longest first) to avoid partial matches
    const sortedTerms = [...annotations].sort((a, b) => b.term.length - a.term.length);

    let remaining = original;
    const parts: Array<{ text: string; isAnnotated: boolean; term?: string }> = [];
    // Safety limit must be > max text length; use 10000 to handle long classical texts like 离骚 (2900+ chars)
    let safety = 0;

    while (remaining.length > 0 && safety < 10000) {
      safety++;
      let found = false;

      for (const ann of sortedTerms) {
        if (remaining.startsWith(ann.term)) {
          parts.push({ text: ann.term, isAnnotated: true, term: ann.term });
          remaining = remaining.slice(ann.term.length);
          found = true;
          break;
        }
      }

      if (!found) {
        // Add the next character as plain text
        const nextChar = remaining[0];
        if (parts.length > 0 && !parts[parts.length - 1].isAnnotated) {
          parts[parts.length - 1].text += nextChar;
        } else {
          parts.push({ text: nextChar, isAnnotated: false });
        }
        remaining = remaining.slice(1);
      }
    }

    return parts.map((part, i) => {
      if (part.isAnnotated && part.term) {
        return (
          <span
            key={i}
            className="text-primary underline decoration-dotted underline-offset-4 cursor-pointer hover:bg-primary/10 rounded px-0.5 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              const rect = e.currentTarget.getBoundingClientRect();
              setPopup({
                term: part.term!,
                note: termMap.get(part.term!) || '',
                x: rect.left,
                y: rect.top,
              });
            }}
          >
            {part.text}
          </span>
        );
      }
      return <span key={i}>{part.text}</span>;
    });
  };

  return (
    <div className="relative">
      <div className="poem-text text-xl leading-loose whitespace-pre-line">
        {renderText()}
      </div>
      {popup && (
        <AnnotationPopup
          term={popup.term}
          note={popup.note}
          x={popup.x}
          y={popup.y}
          onClose={handlePopupClose}
        />
      )}
    </div>
  );
}
