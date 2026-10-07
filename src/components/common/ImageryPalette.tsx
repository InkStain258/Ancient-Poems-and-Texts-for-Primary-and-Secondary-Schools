import { useMemo } from 'react';
import { Palette } from 'lucide-react';
import { extractImageryColors, hslToString, imageryGradient, type ImageryColor } from '@/lib/imageryColors';

interface ImageryPaletteProps {
  text: string;
  title?: string;
  compact?: boolean;
}

/** 意象色彩提取组件 - 展示诗文的意象配色卡 */
export default function ImageryPalette({ text, title, compact = false }: ImageryPaletteProps) {
  const colors = useMemo(() => extractImageryColors(text), [text]);

  if (colors.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic flex items-center gap-2 py-2">
        <Palette className="h-4 w-4" />
        暂无匹配意象色彩
      </div>
    );
  }

  const displayColors = compact ? colors.slice(0, 4) : colors.slice(0, 8);
  const gradient = imageryGradient(colors);

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className="h-6 w-20 rounded-full"
          style={{ background: gradient }}
          title={displayColors.map(c => `${c.keyword}(${c.mood})`).join('、')}
        />
        <span className="text-xs text-muted-foreground">
          {displayColors.map(c => c.keyword).join(' ')}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold poem-title flex items-center gap-2">
          <Palette className="h-5 w-5 text-primary" />
          {title}
        </h3>
      )}

      {/* 渐变色带 */}
      <div className="rounded-xl overflow-hidden shadow-md">
        <div
          className="h-16 w-full"
          style={{ background: gradient }}
        />
      </div>

      {/* 色卡列表 */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
        {displayColors.map((color) => (
          <ColorCard key={color.keyword} color={color} />
        ))}
      </div>

      {/* 意象词云 */}
      <div className="flex flex-wrap gap-1.5">
        {colors.slice(0, 12).map((color) => (
          <span
            key={color.keyword}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: hslToString(color.hsl, 0.15),
              color: hslToString({ h: color.hsl.h, s: Math.min(color.hsl.s + 10, 100), l: Math.max(color.hsl.l - 25, 20) }),
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: hslToString(color.hsl) }}
            />
            {color.keyword}
          </span>
        ))}
      </div>
    </div>
  );
}

function ColorCard({ color }: { color: ImageryColor }) {
  return (
    <div className="group rounded-lg overflow-hidden border border-border/30 card-ink-hover">
      <div
        className="h-12 transition-transform group-hover:scale-105"
        style={{ backgroundColor: hslToString(color.hsl) }}
      />
      <div className="p-1.5 text-center">
        <p className="text-sm font-medium">{color.keyword}</p>
        <p className="text-[10px] text-muted-foreground">{color.mood}</p>
      </div>
    </div>
  );
}
