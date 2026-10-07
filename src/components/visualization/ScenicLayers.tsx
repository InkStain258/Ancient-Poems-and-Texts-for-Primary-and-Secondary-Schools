import type { ScenicData } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface ScenicLayersProps {
  data: ScenicData;
  title?: string;
}

export default function ScenicLayers({ data, title = '景物层次' }: ScenicLayersProps) {
  const levelColors = ['bg-primary/10 border-primary/30', 'bg-secondary border-secondary/80', 'bg-accent border-accent/80'];

  return (
    <div>
      <h4 className="text-sm font-medium mb-3">{title}</h4>
      <div className="space-y-2">
        {data.layers.map((layer, index) => (
          <Card key={index} className={`border ${levelColors[index % levelColors.length]}`}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-primary whitespace-nowrap">
                  {layer.level}
                </span>
                <span className="text-sm">{layer.content}</span>
              </div>
              {layer.keywords && layer.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {layer.keywords.map((kw) => (
                    <span key={kw} className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
