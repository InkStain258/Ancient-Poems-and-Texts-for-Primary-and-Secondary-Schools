import { Link } from 'react-router-dom';
import type { ClassicalWork } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FavoriteButton from './FavoriteButton';
import { highlightText, smartTruncate } from '@/lib/highlight';

interface WorkCardProps {
  work: ClassicalWork;
  keyword?: string;
}

export default function WorkCard({ work, keyword }: WorkCardProps) {
  // 摘要文本：有关键词时用智能截断，否则固定截断
  const displayText = keyword
    ? smartTruncate(work.text.original, keyword, 60)
    : work.text.original.length > 60
      ? work.text.original.slice(0, 60) + '…'
      : work.text.original;

  return (
    <Link to={`/works/${work.id}`}>
      <Card className="card-modern group h-full cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors poem-title">
                {keyword ? highlightText(work.title, keyword) : work.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {keyword ? highlightText(`${work.dynasty} · ${work.author}`, keyword) : `${work.dynasty} · ${work.author}`}
              </p>
            </div>
            <FavoriteButton workId={work.id} />
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 poem-text-sm">
            {keyword ? highlightText(displayText, keyword) : displayText}
          </p>

          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary" className="text-xs">
              {work.gradeLevel.stage} {work.gradeLevel.grade}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {work.genre.category} · {work.genre.subGenre}
            </Badge>
            {work.themes.slice(0, 2).map((theme) => (
              <span key={theme} className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium theme-badge-${theme}`}>
                {theme}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
