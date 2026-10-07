import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PoemPuzzleProps {
  /** The full sentences to pick puzzle from */
  sentences: string[];
  /** Title of the poem for display */
  title?: string;
  /** Author of the poem */
  author?: string;
  /** Difficulty: 1 = first 2 sentences, 2 = first 4, 3 = all */
  difficulty?: 1 | 2 | 3;
  /** Callback when puzzle is completed */
  onComplete?: () => void;
  /** Callback to request next poem */
  onNextPoem?: () => void;
  /** Whether there are more poems available */
  hasMore?: boolean;
}

interface PuzzlePiece {
  id: number;
  text: string;
  currentIndex: number;
}

/** Shuffle array using Fisher-Yates algorithm */
function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Get number of sentences to use based on difficulty and available count */
function getSentencesCount(total: number, difficulty: 1 | 2 | 3): number {
  if (difficulty === 1) return Math.min(2, total);
  if (difficulty === 2) return Math.min(4, total);
  return total;
}

const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = {
  1: '初窥',
  2: '品味',
  3: '通览',
};

const DIFFICULTY_EMOJI: Record<1 | 2 | 3, string> = {
  1: '🌱',
  2: '🌿',
  3: '🌳',
};

export default function PoemPuzzle({
  sentences,
  title,
  author,
  difficulty: initialDifficulty = 1,
  onComplete,
  onNextPoem,
  hasMore = false,
}: PoemPuzzleProps) {
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(initialDifficulty);

  const puzzleSentences = useMemo(
    () => sentences.slice(0, getSentencesCount(sentences.length, difficulty)),
    [sentences, difficulty]
  );

  const fullText = puzzleSentences.join('');

  const charList = useMemo(() => {
    return fullText.split('').map((char, idx) => ({
      id: idx,
      char,
    }));
  }, [fullText]);

  const [shuffledPieces, setShuffledPieces] = useState<PuzzlePiece[]>(() => {
    const shuffled = shuffleArray(
      charList.map((c, idx) => ({
        id: c.id,
        text: c.char,
        currentIndex: idx,
      }))
    );
    return shuffled.map((p, idx) => ({ ...p, currentIndex: idx }));
  });

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const correctOrder = useMemo(
    () => charList.map((c) => c.id),
    [charList]
  );

  // Re-shuffle when difficulty changes or sentences change
  const handleDifficultyChange = useCallback((newDiff: 1 | 2 | 3) => {
    setDifficulty(newDiff);
    setSelectedIds([]);
    setIsComplete(false);
  }, []);

  const handlePieceClick = useCallback(
    (pieceId: number) => {
      if (isComplete) return;
      if (selectedIds.includes(pieceId)) {
        setSelectedIds((prev) => prev.filter((id) => id !== pieceId));
        return;
      }
      const newSelected = [...selectedIds, pieceId];
      setSelectedIds(newSelected);

      // Check if the selected order matches the correct order up to this point
      const nextExpectedIdx = newSelected.length - 1;
      if (newSelected[nextExpectedIdx] !== correctOrder[nextExpectedIdx]) {
        // Wrong choice — briefly flash and reset
        setTimeout(() => {
          setSelectedIds([]);
        }, 400);
        return;
      }

      // Check if complete
      if (newSelected.length === correctOrder.length) {
        setIsComplete(true);
        onComplete?.();
      }
    },
    [selectedIds, isComplete, correctOrder, onComplete]
  );

  const handleReset = useCallback(() => {
    const shuffled = shuffleArray(charList.map((c, idx) => ({
      id: c.id,
      text: c.char,
      currentIndex: idx,
    })));
    setShuffledPieces(shuffled.map((p, idx) => ({ ...p, currentIndex: idx })));
    setSelectedIds([]);
    setIsComplete(false);
  }, [charList]);

  const handleNextPoem = useCallback(() => {
    setSelectedIds([]);
    setIsComplete(false);
    onNextPoem?.();
  }, [onNextPoem]);

  return (
    <Card className="breathing-glow relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg poem-title flex items-center gap-2">
          <span className="text-2xl">🧩</span>
          诗词拼图
          {title && (
            <span className="text-sm font-normal text-muted-foreground">
              — {title}{author ? ` · ${author}` : ''}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Difficulty selector */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs text-muted-foreground">难度：</span>
          {([1, 2, 3] as const).map((d) => (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              className={`
                px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200
                ${difficulty === d
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              {DIFFICULTY_EMOJI[d]} {DIFFICULTY_LABELS[d]}
            </button>
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            ({puzzleSentences.length}句)
          </span>
        </div>

        {isComplete ? (
          <div className="text-center py-4 space-y-3 animate-scale-in">
            <div className="text-3xl mb-2">🎉</div>
            <p className="poem-text text-xl text-primary font-semibold">
              {puzzleSentences.join(' ')}
            </p>
            <p className="text-sm text-muted-foreground">恭喜，拼图完成！</p>
            <div className="flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                再来一次
              </Button>
              {hasMore && (
                <Button variant="default" size="sm" onClick={handleNextPoem}>
                  下一首 →
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Hint text */}
            <p className="text-sm text-muted-foreground text-center">
              请按正确顺序点击字符，还原诗句
            </p>

            {/* Selected progress */}
            <div className="min-h-[48px] flex flex-wrap gap-1.5 justify-center p-3 rounded-lg bg-muted/30 border border-border/30">
              {selectedIds.length === 0 ? (
                <span className="text-muted-foreground/50 text-sm">点击下方字符开始...</span>
              ) : (
                selectedIds.map((id) => {
                  const piece = charList.find((c) => c.id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary font-medium text-base poem-text border border-primary/20"
                    >
                      {piece?.char}
                    </span>
                  );
                })
              )}
            </div>

            {/* Shuffled pieces */}
            <div className="flex flex-wrap gap-1.5 justify-center p-3 rounded-lg border border-border/20 bg-background">
              {shuffledPieces.map((piece) => {
                const isSelected = selectedIds.includes(piece.id);
                return (
                  <button
                    key={piece.id}
                    onClick={() => handlePieceClick(piece.id)}
                    disabled={isSelected}
                    className={`
                      inline-flex items-center justify-center w-9 h-9 rounded-lg text-base poem-text font-medium
                      transition-all duration-200 select-none
                      ${isSelected
                        ? 'bg-primary/20 text-primary/40 cursor-not-allowed scale-90 opacity-50'
                        : 'bg-muted hover:bg-primary/15 hover:text-primary hover:scale-105 active:scale-95 cursor-pointer border border-border/30 hover:border-primary/30'
                      }
                    `}
                  >
                    {piece.text}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                重新打乱
              </Button>
              {hasMore && (
                <Button variant="ghost" size="sm" onClick={handleNextPoem}>
                  换一首
                </Button>
              )}
            </div>
          </>
        )}

        {/* Decorative ink glow */}
        <div className="ink-glow absolute -top-4 -right-4 w-16 h-16 pointer-events-none" />
      </CardContent>
    </Card>
  );
}
