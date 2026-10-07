import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, RotateCw } from 'lucide-react';
import {
  knowledgeCards,
  knowledgeCategories,
  categoryColorMap,
} from '@/data/knowledgeCards';

function getCategoryClasses(category: string): string {
  const colors = categoryColorMap[category];
  if (colors) return `${colors.light} ${colors.dark}`;
  return 'bg-primary/10 text-primary';
}

export default function KnowledgeFlipCard() {
  const [currentIdx, setCurrentIdx] = useState(() =>
    Math.floor(Math.random() * knowledgeCards.length)
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCards = useMemo(() => {
    if (!selectedCategory) return knowledgeCards;
    return knowledgeCards.filter(c => c.category === selectedCategory);
  }, [selectedCategory]);

  const card = filteredCards[currentIdx % filteredCards.length];
  const displayIdx = (currentIdx % filteredCards.length) + 1;

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIdx((prev) => (prev + 1) % filteredCards.length);
    }, 200);
  };

  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    setIsFlipped(false);
    setCurrentIdx(0);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Category filter */}
      <div className="flex flex-wrap gap-1.5 justify-center mb-3">
        <button
          onClick={() => handleCategoryChange(null)}
          className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
            selectedCategory === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-primary/10'
          }`}
        >
          全部
        </button>
        {knowledgeCategories.map(cat => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              selectedCategory === cat
                ? 'bg-primary text-primary-foreground'
                : `${getCategoryClasses(cat)} hover:opacity-80`
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Flip card */}
      <div
        className="cursor-pointer perspective-1000"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)',
          }}
        >
          {/* Front */}
          <div
            style={{ backfaceVisibility: 'hidden' }}
            className="h-48"
          >
            <Card className="h-full bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="p-5 h-full flex flex-col items-center justify-center text-center">
                <Lightbulb className="h-8 w-8 text-primary mb-3 animate-float" />
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium mb-1 ${getCategoryClasses(card.category)}`}>
                  {card.category}
                </span>
                <h3 className="text-2xl font-bold poem-title text-primary">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-3">点击翻转查看</p>
              </CardContent>
            </Card>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Card className="h-full min-h-48">
              <CardContent className="p-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getCategoryClasses(card.category)}`}>
                      {card.category}
                    </span>
                    <span className="text-lg font-bold poem-title">{card.title}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{card.content}</p>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">点击翻回</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <RotateCw className="h-3.5 w-3.5" />
          换一个
        </button>
        <span className="text-xs text-muted-foreground">
          {displayIdx} / {filteredCards.length}
        </span>
      </div>
    </div>
  );
}
