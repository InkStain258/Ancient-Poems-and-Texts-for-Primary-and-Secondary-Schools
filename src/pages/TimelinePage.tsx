import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllWorks, getWorksByDynasty } from '@/services/DataService';
import { DYNASTIES } from '@/types';
import type { Dynasty, ClassicalWork } from '@/types';
import ImageryPalette from '@/components/common/ImageryPalette';
import { getStyleScores, DIMENSION_COLORS, STYLE_DIMENSIONS } from '@/lib/styleScorer';

/** 朝代元信息 */
interface DynastyMeta {
  dynasty: Dynasty;
  period: string;
  desc: string;
  movements: string[];
  color: string;
  icon: string;
}

const DYNASTY_META: DynastyMeta[] = [
  { dynasty: '先秦', period: '约前11世纪—前221年', desc: '诗经楚辞，华夏诗源', movements: ['诗经', '楚辞', '诸子散文'], color: '#8B4513', icon: '甲骨' },
  { dynasty: '汉', period: '前206—220年', desc: '乐府歌行，赋体流风', movements: ['乐府诗', '汉赋', '五言诗'], color: '#B8860B', icon: '竹简' },
  { dynasty: '魏晋南北朝', period: '220—589年', desc: '建安风骨，田园山水', movements: ['建安文学', '田园诗', '山水诗', '骈文'], color: '#6B8E23', icon: '竹林' },
  { dynasty: '唐', period: '618—907年', desc: '诗国巅峰，万古风流', movements: ['初唐四杰', '盛唐气象', '中唐新乐府', '晚唐婉约'], color: '#DC143C', icon: '牡丹' },
  { dynasty: '宋', period: '960—1279年', desc: '词韵流芳，理学余音', movements: ['豪放词', '婉约词', '江西诗派', '理学诗'], color: '#4169E1', icon: '青瓷' },
  { dynasty: '元', period: '1271—1368年', desc: '曲调悠扬，杂剧兴盛', movements: ['元曲', '散曲', '杂剧'], color: '#9370DB', icon: '戏台' },
  { dynasty: '明', period: '1368—1644年', desc: '复古革新，文坛争鸣', movements: ['前后七子', '公安派', '小品文'], color: '#2E8B57', icon: '城墙' },
  { dynasty: '清', period: '1644—1912年', desc: '词学复兴，诗坛多元', movements: ['浙西词派', '常州词派', '桐城派', '性灵派'], color: '#708090', icon: '园林' },
  { dynasty: '近现代', period: '1912年至今', desc: '新旧交汇，诗风转型', movements: ['白话诗', '新文化运动', '旧体新变'], color: '#CD853F', icon: '灯塔' },
];

export default function TimelinePage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeDynasty, setActiveDynasty] = useState<Dynasty>('唐');

  const dynastyWorksMap = useMemo(() => {
    const map = new Map<Dynasty, ClassicalWork[]>();
    for (const d of DYNASTIES) {
      map.set(d, getWorksByDynasty(d));
    }
    return map;
  }, []);

  const activeWorks = dynastyWorksMap.get(activeDynasty) ?? [];
  const activeMeta = DYNASTY_META.find(m => m.dynasty === activeDynasty)!;

  // 键盘 ← → 切换朝代
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setActiveDynasty((prev) => DYNASTIES[Math.max(0, DYNASTIES.indexOf(prev) - 1)]);
      } else if (e.key === 'ArrowRight') {
        setActiveDynasty((prev) => DYNASTIES[Math.min(DYNASTIES.length - 1, DYNASTIES.indexOf(prev) + 1)]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const scrollToDynasty = (idx: number) => {
    if (!scrollRef.current) return;
    const node = scrollRef.current.children[idx] as HTMLElement;
    if (node) {
      node.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const currentIdx = DYNASTIES.indexOf(activeDynasty);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* 页面标题 */}
      <div className="text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold poem-title text-aurora">时空穿越长卷</h1>
        <p className="text-muted-foreground mt-2">
          横贯千年文脉，纵览朝代诗风 ·{' '}
          <kbd className="glass-chip px-1.5 py-0.5 text-[10px]">←</kbd>{' '}
          <kbd className="glass-chip px-1.5 py-0.5 text-[10px]">→</kbd> 键切换朝代
        </p>
      </div>

      {/* 朝代导航条 */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => {
            const prev = Math.max(0, currentIdx - 1);
            setActiveDynasty(DYNASTIES[prev]);
            scrollToDynasty(prev);
          }}
          disabled={currentIdx === 0}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm"
          onClick={() => {
            const next = Math.min(DYNASTIES.length - 1, currentIdx + 1);
            setActiveDynasty(DYNASTIES[next]);
            scrollToDynasty(next);
          }}
          disabled={currentIdx === DYNASTIES.length - 1}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* 时间轴横向滚动 */}
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto py-4 px-10 scrollbar-thin snap-x snap-mandatory">
          {DYNASTY_META.map((meta) => {
            const isActive = meta.dynasty === activeDynasty;
            const workCount = dynastyWorksMap.get(meta.dynasty)?.length ?? 0;
            return (
              <button
                key={meta.dynasty}
                className={`snap-center shrink-0 flex flex-col items-center gap-1.5 px-4 py-3 rounded-xl border transition-all duration-300 min-w-[110px] ${
                  isActive
                    ? 'scale-105'
                    : 'border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.02]'
                }`}
                style={
                  isActive
                    ? {
                        borderColor: meta.color,
                        background: `linear-gradient(160deg, ${meta.color}1f 0%, transparent 75%)`,
                        boxShadow: `0 10px 30px ${meta.color}30, 0 0 0 1px ${meta.color}40`,
                      }
                    : undefined
                }
                onClick={() => setActiveDynasty(meta.dynasty)}
              >
                <span className={`text-2xl transition-transform duration-300 ${isActive ? 'scale-125' : ''}`}>
                  {meta.icon}
                </span>
                <span
                  className="font-bold text-base poem-title"
                  style={isActive ? { color: meta.color } : undefined}
                >
                  {meta.dynasty}
                </span>
                <span className="text-[10px] text-muted-foreground whitespace-nowrap">{meta.period}</span>
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                  style={
                    isActive
                      ? { backgroundColor: meta.color + '22', color: meta.color, border: `1px solid ${meta.color}44` }
                      : { backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--muted-foreground))' }
                  }
                >
                  {workCount} 篇
                </span>
              </button>
            );
          })}
        </div>

        {/* 朝代光谱脊线 */}
        <div
          className="relative h-1 mx-12 rounded-full opacity-80"
          style={{ background: `linear-gradient(90deg, ${DYNASTY_META.map((m) => m.color).join(', ')})` }}
        >
          <span
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-background border-2 transition-all duration-500"
            style={{
              left: `calc(${((currentIdx + 0.5) / DYNASTY_META.length) * 100}% - 7px)`,
              borderColor: activeMeta.color,
              boxShadow: `0 0 14px 3px ${activeMeta.color}66`,
            }}
          />
        </div>
      </div>

      {/* 当前朝代详情 */}
      <div className="animate-fade-in-up" key={activeDynasty}>
        {/* 朝代信息卡 */}
        <Card
          className="card-modern relative overflow-hidden mb-6"
          style={{ boxShadow: `0 18px 48px ${activeMeta.color}22, 0 0 0 1px ${activeMeta.color}18` }}
        >
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 breathe"
                style={{
                  backgroundColor: activeMeta.color + '20',
                  border: `2px solid ${activeMeta.color}40`,
                  boxShadow: `0 0 24px ${activeMeta.color}44`,
                }}
              >
                {activeMeta.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold poem-title" style={{ color: activeMeta.color }}>
                  {activeMeta.dynasty}
                  <span className="text-sm font-normal text-muted-foreground ml-3">{activeMeta.period}</span>
                </h2>
                <p className="text-muted-foreground mt-1">{activeMeta.desc}</p>
                {/* 文学流派标签 */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeMeta.movements.map(m => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: activeMeta.color + '15',
                        color: activeMeta.color,
                        border: `1px solid ${activeMeta.color}30`,
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <BookOpen className="h-5 w-5" style={{ color: activeMeta.color }} />
                <span className="text-2xl font-bold" style={{ color: activeMeta.color }}>{activeWorks.length}</span>
                <span className="text-muted-foreground">篇作品</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 作品网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeWorks.map((w) => {
            const scores = getStyleScores(w);
            const dominant = STYLE_DIMENSIONS.reduce((a, b) => scores[a] > scores[b] ? a : b);
            return (
              <Link key={w.id} to={`/works/${w.id}`} className="group">
                <Card className="card-modern h-full relative overflow-hidden">
                  <CardContent className="p-4">
                    {/* 标题行 */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-bold text-base poem-title group-hover:text-primary transition-colors">
                          {w.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{w.author}</p>
                      </div>
                      <span
                        className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        style={{
                          backgroundColor: DIMENSION_COLORS[dominant] + '20',
                          color: DIMENSION_COLORS[dominant],
                        }}
                      >
                        {dominant}
                      </span>
                    </div>

                    {/* 诗句片段 */}
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {w.text.sentences[0] ?? w.text.original.slice(0, 30)}
                    </p>

                    {/* 意象色彩 */}
                    <ImageryPalette text={w.text.original} compact />

                    {/* 风格迷你条 */}
                    <div className="flex gap-0.5 mt-2">
                      {STYLE_DIMENSIONS.map(dim => (
                        <div
                          key={dim}
                          className="h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.max(scores[dim] / 10, 4)}%`,
                            backgroundColor: DIMENSION_COLORS[dim],
                            opacity: 0.7,
                          }}
                          title={`${dim}: ${scores[dim]}`}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {activeWorks.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            暂无该朝代作品
          </div>
        )}
      </div>
    </div>
  );
}
