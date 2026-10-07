import { Link } from 'react-router-dom';
import type { CategoryEntry } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface CategoryGridProps {
  title: string;
  categories: CategoryEntry[];
  basePath: string;
  filterKey?: string;
}

export default function CategoryGrid({ title, categories, basePath, filterKey = 'category' }: CategoryGridProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.value}
            to={`${basePath}?${filterKey}=${encodeURIComponent(cat.value)}`}
          >
            <Card className="group transition-all hover:shadow-md hover:border-primary/30 cursor-pointer">
              <CardContent className="p-4 text-center">
                {cat.icon && <span className="text-2xl mb-1 block">{cat.icon}</span>}
                <p className="font-medium group-hover:text-primary transition-colors">{cat.label}</p>
                {cat.count > 0 && (
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.count} 篇</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
