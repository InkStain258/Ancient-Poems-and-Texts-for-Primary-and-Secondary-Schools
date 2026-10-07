import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface EmptyStateProps {
  title?: string;
  description?: string;
  showAction?: boolean;
}

export default function EmptyState({
  title = '暂无数据',
  description = '没有找到符合条件的内容',
  showAction = true,
}: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
      {/* Decorative ink scroll painting */}
      <div className="relative mb-6">
        <img
          src="./images/ink-scroll.webp"
          alt=""
          className="w-24 h-24 object-cover rounded-full opacity-20 pointer-events-none"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl poem-title text-primary/50">空</span>
        </div>
      </div>
      <h3 className="text-lg font-medium text-muted-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground/70 mt-1 max-w-xs">{description}</p>
      {showAction && (
        <Button variant="outline" className="mt-4" onClick={() => navigate('/works')}>
          浏览全部诗文
        </Button>
      )}
    </div>
  );
}
