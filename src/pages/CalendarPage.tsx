import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Calendar, Share2, Download, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getAllWorks } from '@/services/DataService';
import type { ClassicalWork } from '@/types';

/** 用日期种子确定选取的诗文（确保每天固定） */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getWorkForDay(dayOfYear: number, works: ClassicalWork[]): ClassicalWork {
  // 使用简单的哈希确保稳定
  const idx = (dayOfYear * 7 + 13) % works.length;
  return works[Math.abs(idx)];
}

function getWorkForDate(date: Date, works: ClassicalWork[]): ClassicalWork {
  const day = getDayOfYear(date);
  return getWorkForDay(day, works);
}

const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

export default function CalendarPage() {
  const allWorks = useMemo(() => getAllWorks(), []);
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [posterOpen, setPosterOpen] = useState(false);

  // 月份导航
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  // 日历网格
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(currentYear, currentMonth, d));
    return days;
  }, [currentYear, currentMonth]);

  const selectedWork = useMemo(() => {
    if (!selectedDate) return null;
    return getWorkForDate(selectedDate, allWorks);
  }, [selectedDate, allWorks]);

  // 键盘 ← → 翻月
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevMonth();
      else if (e.key === 'ArrowRight') nextMonth();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* 标题 */}
      <div className="text-center animate-fade-in-up">
        <h1 className="text-3xl font-bold poem-title flex items-center justify-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          <span className="text-aurora">诗词日历</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          365 天 · {allWorks.length} 篇轮转 · 每天一首，与古人共鸣 ·{' '}
          <kbd className="glass-chip px-1.5 py-0.5 text-[10px]">←</kbd>{' '}
          <kbd className="glass-chip px-1.5 py-0.5 text-[10px]">→</kbd> 翻月
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 日历网格 */}
        <div className="lg:col-span-3 animate-fade-in-up stagger-1">
          <Card className="card-modern relative overflow-hidden">
            <CardContent className="p-4">
              {/* 月份导航 */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <button
                    className="glass-chip px-3 py-1 text-xs font-medium text-primary hover:scale-105 transition-transform"
                    onClick={() => {
                      setCurrentYear(today.getFullYear());
                      setCurrentMonth(today.getMonth());
                      setSelectedDate(today);
                    }}
                  >
                    今天
                  </button>
                </div>
                <h2 className="text-xl font-bold poem-title">
                  {currentYear}年 {MONTH_NAMES[currentMonth]}
                </h2>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              {/* 星期标头 */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <div key={d} className="text-center text-xs text-muted-foreground font-medium py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* 日期网格 */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, i) => {
                  if (!date) return <div key={`empty-${i}`} />;
                  const isSelected = selectedDate &&
                    date.getFullYear() === selectedDate.getFullYear() &&
                    date.getMonth() === selectedDate.getMonth() &&
                    date.getDate() === selectedDate.getDate();
                  const todayFlag = isToday(date);
                  const work = getWorkForDate(date, allWorks);

                  return (
                    <button
                      key={date.toISOString()}
                      title={`${work.title} · ${work.author}`}
                      className={`relative p-1.5 rounded-lg text-sm transition-all hover:bg-primary/10 hover:scale-105 ${
                        isSelected ? 'bg-primary/15 font-bold' : ''
                      } ${todayFlag ? 'font-bold text-primary' : ''}`}
                      style={
                        isSelected
                          ? { boxShadow: '0 0 0 2px hsl(var(--primary) / 0.5), 0 0 18px hsl(var(--primary) / 0.25)' }
                          : undefined
                      }
                      onClick={() => setSelectedDate(date)}
                    >
                      <span className={todayFlag ? 'text-primary' : ''}>{date.getDate()}</span>
                      {/* 日期下方的诗意小点 */}
                      <div
                        className={`absolute bottom-0.5 left-1/2 -translate-x-1/2 rounded-full transition-all ${
                          todayFlag ? 'w-1.5 h-1.5 breathe' : 'w-1 h-1'
                        }`}
                        style={{
                          backgroundColor: `hsl(${(getDayOfYear(date) * 37) % 360} 60% 55%)`,
                          boxShadow: todayFlag
                            ? `0 0 8px hsl(${(getDayOfYear(date) * 37) % 360} 70% 60%)`
                            : undefined,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 每日一诗展示 */}
        <div className="lg:col-span-2 animate-fade-in-up stagger-2">
          {selectedWork && selectedDate ? (
            <DailyPoemCard work={selectedWork} date={selectedDate} onPoster={() => setPosterOpen(true)} />
          ) : (
            <Card className="paper-texture">
              <CardContent className="p-6 text-center text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>选择一个日期查看当日推荐诗文</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* 年度浏览：12 个月缩略 */}
      <div className="animate-fade-in-up stagger-3">
        <h2 className="text-xl font-bold mb-4 poem-title">年度速览</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {MONTH_NAMES.map((name, mIdx) => {
            const sampleDate = new Date(currentYear, mIdx, 1);
            const work = getWorkForDate(sampleDate, allWorks);
            return (
              <button
                key={mIdx}
                className={`glass glass-hover text-left p-3 rounded-xl ${
                  mIdx === currentMonth ? 'ring-1 ring-primary/40' : ''
                }`}
                onClick={() => {
                  setCurrentMonth(mIdx);
                  setSelectedDate(sampleDate);
                }}
              >
                <p className="font-semibold text-sm poem-title">{name}</p>
                <p className="text-xs text-muted-foreground mt-1 truncate">{work.title}</p>
                <p className="text-xs text-muted-foreground truncate">{work.author}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 日历海报弹窗 */}
      {posterOpen && selectedWork && selectedDate && (
        <CalendarPosterModal
          work={selectedWork}
          date={selectedDate}
          open={posterOpen}
          onClose={() => setPosterOpen(false)}
        />
      )}
    </div>
  );
}

/** 每日一诗卡片 */
function DailyPoemCard({ work, date, onPoster }: { work: ClassicalWork; date: Date; onPoster: () => void }) {
  const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;

  return (
    <Card className="card-modern corner-decoration h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">{dateStr}</span>
          <Button variant="ghost" size="sm" className="gap-1 text-xs" onClick={onPoster}>
            <Share2 className="h-3.5 w-3.5" />
            海报
          </Button>
        </div>

        <Link to={`/works/${work.id}`} className="group flex-1">
          <h3 className="text-xl font-bold poem-title group-hover:text-primary transition-colors mb-1">
            {work.title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{work.dynasty} · {work.author}</p>
          <div className="verse-highlight flex-1">
            <p className="poem-text text-base leading-loose">
              {work.text.sentences.length > 0
                ? work.text.sentences.slice(0, 6).join('\n')
                : work.text.original.slice(0, 80)}
            </p>
          </div>
        </Link>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/30">
          <div className="flex gap-1.5">
            {work.themes.slice(0, 3).map(t => (
              <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full theme-badge-${t}`}>
                {t}
              </span>
            ))}
          </div>
          <Link to={`/works/${work.id}`}>
            <Button variant="outline" size="sm">阅读全文</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

/** 日历海报弹窗 */
function CalendarPosterModal({ work, date, open, onClose }: {
  work: ClassicalWork;
  date: Date;
  open: boolean;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;

  const drawPoster = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGenerating(true);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 540, H = 960;
    canvas.width = W;
    canvas.height = H;

    // 背景
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#fdf6e3');
    bg.addColorStop(1, '#f5ecd7');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 装饰框
    ctx.strokeStyle = 'rgba(180,160,120,0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(20, 20, W - 40, H - 40);
    ctx.strokeStyle = 'rgba(180,160,120,0.25)';
    ctx.strokeRect(32, 32, W - 64, H - 64);

    // 日期
    ctx.fillStyle = '#8b7355';
    ctx.font = 'bold 48px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText(dateStr, W / 2, 120);

    // 分隔线
    ctx.strokeStyle = 'rgba(180,160,120,0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 80, 140);
    ctx.lineTo(W / 2 + 80, 140);
    ctx.stroke();

    // 诗题
    ctx.fillStyle = '#2c2420';
    ctx.font = 'bold 30px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.fillText(work.title, W / 2, 200);

    // 作者
    ctx.fillStyle = '#7a6a52';
    ctx.font = '16px "Noto Serif SC", serif';
    ctx.fillText(`${work.dynasty} · ${work.author}`, W / 2, 236);

    // 分隔线
    ctx.strokeStyle = 'rgba(180,160,120,0.3)';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 100, 256);
    ctx.lineTo(W / 2 + 100, 256);
    ctx.stroke();

    // 诗文
    ctx.fillStyle = '#3a3228';
    const sentences = work.text.sentences.length > 0 ? work.text.sentences : [work.text.original];
    const fontSize = sentences.length > 8 ? 15 : sentences.length > 4 ? 17 : 20;
    ctx.font = `${fontSize}px "Noto Serif SC", serif`;
    ctx.textAlign = 'center';
    const lh = fontSize * 1.9;
    const startY = 296;
    sentences.slice(0, 12).forEach((s, i) => ctx.fillText(s, W / 2, startY + i * lh));

    // 底部
    ctx.fillStyle = '#b8a888';
    ctx.font = '12px "Noto Serif SC", serif';
    ctx.fillText('部编古诗文  |  诗词日历', W / 2, H - 62);

    setPreviewUrl(canvas.toDataURL('image/png'));
    setGenerating(false);
  }, [work, dateStr]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(drawPoster, 50);
      return () => clearTimeout(timer);
    } else {
      setPreviewUrl(null);
    }
  }, [open, drawPoster]);

  const handleDownload = useCallback(() => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `诗词日历_${dateStr}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [previewUrl, dateStr]);

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-h-[92vh] overflow-y-auto w-[380px] max-w-[95vw] animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <h3 className="font-semibold text-lg poem-title flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-primary" />日历海报
          </h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-accent"><X className="h-4 w-4" /></button>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="px-4 py-4 flex justify-center">
          {generating && <div className="flex flex-col items-center gap-3 py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="text-sm text-muted-foreground">生成中...</span></div>}
          {!generating && previewUrl && <img src={previewUrl} alt="日历海报" className="rounded-lg shadow-md max-w-full h-auto" style={{ maxHeight: '65vh' }} />}
        </div>
        <div className="flex gap-3 px-4 py-3 border-t border-border/30">
          <Button variant="outline" className="flex-1 gap-1.5" onClick={handleDownload}><Download className="h-4 w-4" />保存图片</Button>
          <Button className="flex-1 gap-1.5" onClick={handleDownload}><Share2 className="h-4 w-4" />分享</Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
