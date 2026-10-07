import { Link } from 'react-router-dom';
import { BookOpen, Users, Landmark, Tag, Sparkles, RefreshCw, Copy, Check } from 'lucide-react';
import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StatBadge from '@/components/common/StatBadge';
import SearchBar from '@/components/common/SearchBar';
import WorkCard from '@/components/common/WorkCard';
import KnowledgeFlipCard from '@/components/common/KnowledgeFlipCard';
import InkSplashButton from '@/components/common/InkSplashButton';
import PoemPuzzle from '@/components/common/PoemPuzzle';
import ScrollRevealText from '@/components/common/ScrollRevealText';
import { PosterShareButton } from '@/components/common/PoemPoster';
import { useDailyPoem } from '@/hooks/useDailyPoem';
import { getCountsByStage, getAllWorks } from '@/services/DataService';
import { getSummaryStats } from '@/services/StatsService';
import { inkQuoteData, inkTypeConfig } from '@/data/inkQuotes';
import type { InkQuote, InkType } from '@/data/inkQuotes';
import { DYNASTIES, THEMES } from '@/types';
import type { Stage, ClassicalWork } from '@/types';

export default function HomePage() {
  const { work: dailyWork, reason, refresh: refreshDailyPoem } = useDailyPoem();
  const stats = getSummaryStats();
  const stageCounts = getCountsByStage();

  return (
    <div className="container mx-auto px-4 py-6 space-y-10 watermark-bg">
      {/* Hero Section with ink wash background */}
      <section className="hero-ink-bg glass text-center py-14 md:py-20 rounded-2xl relative overflow-hidden">
        {/* Ink painting background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
          style={{ backgroundImage: "url('./images/hero-ink-bg.webp')" }}
        />
        {/* Floating petals decoration */}
        <div className="petal" style={{ left: '10%', top: '20%', animationDelay: '0s', animationDuration: '6s' }} />
        <div className="petal" style={{ left: '30%', top: '10%', animationDelay: '1.5s', animationDuration: '5s' }} />
        <div className="petal" style={{ left: '60%', top: '15%', animationDelay: '3s', animationDuration: '7s' }} />
        <div className="petal" style={{ left: '80%', top: '25%', animationDelay: '0.5s', animationDuration: '5.5s' }} />
        <div className="petal" style={{ left: '50%', top: '5%', animationDelay: '2s', animationDuration: '6.5s' }} />
        {/* Star twinkle decorations */}
        <div className="star-twinkle absolute top-6 right-12 pointer-events-none w-24 h-24" />
        <div className="animate-fade-in-up">
          <div className="inline-block mb-4">
            <span className="seal-stamp">诗</span>
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-primary poem-title mb-4 animate-fade-in-up stagger-2 text-aurora">
          部编古诗文
        </h1>
        <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto animate-fade-in-up stagger-3">
          探索中华经典诗文之美，涵盖小学到高中部编版语文教材全部古诗文篇目
        </p>
        <div className="flex justify-center mb-6 animate-fade-in-up stagger-4">
          <div className="w-full max-w-lg">
            <SearchBar />
          </div>
        </div>
        <div className="flex justify-center gap-3 animate-fade-in-up stagger-5">
          <Link to="/works">
            <Button size="lg">浏览全部诗文</Button>
          </Link>
          <Link to="/category">
            <Button variant="outline" size="lg">分类浏览</Button>
          </Link>
        </div>

        {/* Mountain silhouette SVG decoration */}
        <svg className="mountain-silhouette" viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,120 L0,80 Q60,40 120,70 Q180,100 240,60 Q300,20 360,50 Q420,80 480,45 Q540,10 600,40 Q660,70 720,35 Q780,0 840,30 Q900,60 960,25 Q1020,0 1080,35 Q1140,70 1200,40 Q1260,10 1320,45 Q1380,80 1440,60 L1440,120 Z" fill="currentColor"/>
        </svg>
      </section>

      {/* Stats Section */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="animate-fade-in-up stagger-1">
            <StatBadge icon={<BookOpen className="h-5 w-5" />} label="诗文总数" value={stats.totalWorks} />
          </div>
          <div className="animate-fade-in-up stagger-2">
            <StatBadge icon={<Users className="h-5 w-5" />} label="作者数量" value={stats.totalAuthors} />
          </div>
          <div className="animate-fade-in-up stagger-3">
            <StatBadge icon={<Landmark className="h-5 w-5" />} label="跨越朝代" value={stats.totalDynasties} />
          </div>
          <div className="animate-fade-in-up stagger-4">
            <StatBadge icon={<Tag className="h-5 w-5" />} label="主题分类" value={stats.totalThemes} />
          </div>
        </div>
      </section>

      {/* Ink wash divider */}
      <div className="ink-divider" />

      {/* Stage Entry Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-4 poem-title">学段导航</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([
            { stage: '小学' as Stage, img: './images/ink-plum.webp', darkImg: './images/ink-plum-dark.webp', label: '桃李初萌', color: 'from-pink-900/70' },
            { stage: '初中' as Stage, img: './images/ink-orchid.webp', darkImg: './images/ink-orchid-dark.webp', label: '幽兰含芳', color: 'from-indigo-900/70' },
            { stage: '高中' as Stage, img: './images/ink-pine.webp', darkImg: './images/ink-pine-dark.webp', label: '苍松傲立', color: 'from-emerald-900/70' },
          ]).map(({ stage, img, darkImg, label, color }, i) => (
            <Link key={stage} to={`/works?stage=${encodeURIComponent(stage)}`}>
              <Card className={`card-ink-hover animate-fade-in-up stagger-${i + 1} overflow-hidden relative`}>
                {/* Light mode background */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-15 dark:hidden pointer-events-none"
                  style={{ backgroundImage: `url('${img}')` }}
                />
                {/* Dark mode background */}
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-20 hidden dark:block pointer-events-none"
                  style={{ backgroundImage: `url('${darkImg}')` }}
                />
                {/* Gradient overlay for readability in dark mode */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} to-transparent opacity-0 dark:opacity-100 pointer-events-none`} />
                <CardContent className="p-6 text-center relative z-10">
                  <h3 className="text-xl font-semibold drop-shadow-sm dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] group-hover:text-primary transition-colors">{stage}</h3>
                  <p className="text-muted-foreground text-sm mt-1 dark:text-gray-300 drop-shadow-sm dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{stageCounts[stage]} 篇诗文</p>
                  <p className="text-xs text-primary/60 mt-2 poem-text italic drop-shadow-sm dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] dark:text-primary/80">{label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Daily Poem */}
      {dailyWork && (
        <section className="animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold poem-title">每日一诗</h2>
            <button
              onClick={refreshDailyPoem}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors active:scale-95"
              title="换一首"
            >
              <RefreshCw className="h-4 w-4" />
              换一首
            </button>
          </div>
          <Card className="overflow-hidden corner-decoration">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{reason}</p>
                  <h3 className="text-2xl font-bold text-primary poem-title">{dailyWork.title}</h3>
                  <p className="text-muted-foreground mt-1">{dailyWork.dynasty} · {dailyWork.author}</p>
                  <div className="mt-3 verse-highlight">
                    <p className="poem-text text-lg max-w-lg">{dailyWork.text.original}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PosterShareButton work={dailyWork} reason={reason} />
                  <Link to={`/works/${dailyWork.id}`}>
                    <Button variant="outline">阅读全文</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Knowledge Flip Card */}
      <section className="animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 poem-title">文学常识</h2>
        <KnowledgeFlipCard />
      </section>

      {/* Quick Category Links */}
      <section className="animate-fade-in">
        <h2 className="text-2xl font-bold mb-4 poem-title">快速浏览</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {DYNASTIES.slice(0, 4).map((d, i) => (
            <Link key={d} to={`/works?dynasty=${encodeURIComponent(d)}`}>
              <Card className={`card-ink-hover animate-scale-in stagger-${i + 1}`}>
                <CardContent className="p-3 text-center">
                  <p className="font-medium group-hover:text-primary">{d}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
          {THEMES.slice(0, 4).map((t, i) => (
            <Link key={t} to={`/works?theme=${encodeURIComponent(t)}`}>
              <Card className={`card-ink-hover animate-scale-in stagger-${i + 5}`}>
                <CardContent className="p-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium theme-badge-${t}`}>
                    {t}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Experience Section */}
      <section className="animate-fade-in-up floating-ribbon relative">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold poem-title shimmer-glow">互动体验</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Poem Puzzle */}
          <PuzzleSection />

          {/* Ink Splash Demo */}
          <InkSplashSection />
        </div>

        {/* Star twinkle decorations */}
        <div className="star-twinkle absolute top-4 right-8 pointer-events-none w-16 h-16 opacity-50" />
      </section>

      {/* Bottom decoration */}
      <div className="wave-divider" />
      <div className="text-center py-4 opacity-30">
        <p className="text-sm poem-text">路漫漫其修远兮，吾将上下而求索</p>
      </div>
    </div>
  );
}

/** Puzzle section sub-component — supports multiple poems with rotation */
function PuzzleSection() {
  const allWorks = getAllWorks();
  const [poemIndex, setPoemIndex] = useState(0);

  // Pick works with enough sentences for puzzles (poetry with 4+ sentences)
  const puzzleWorks = useMemo(
    () => allWorks.filter((w) => w.text.sentences.length >= 4 && w.genre.category === '诗'),
    [allWorks]
  );

  const currentWork = puzzleWorks[poemIndex % puzzleWorks.length] || puzzleWorks[0];

  const handleNextPoem = useCallback(() => {
    setPoemIndex((prev) => (prev + 1) % puzzleWorks.length);
  }, [puzzleWorks.length]);

  if (!currentWork) return null;

  return (
    <PoemPuzzle
      key={poemIndex}
      sentences={currentWork.text.sentences}
      title={currentWork.title}
      author={currentWork.author}
      difficulty={1}
      hasMore={puzzleWorks.length > 1}
      onNextPoem={handleNextPoem}
    />
  );
}

/** Ink splash button section with rich interactions */
function InkSplashSection() {
  const [currentQuote, setCurrentQuote] = useState<InkQuote | null>(null);
  const [currentType, setCurrentType] = useState<InkType | null>(null);
  const [count, setCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ quote: InkQuote; type: InkType }[]>([]);

  const handleInkClick = useCallback((type: InkType) => {
    const quotes = inkQuoteData[type];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(quote);
    setCurrentType(type);
    setCount((c) => c + 1);
    setCopied(false);
    setHistory((prev) => [{ quote, type }, ...prev].slice(0, 8));
  }, []);

  const handleCopy = useCallback(() => {
    if (!currentQuote) return;
    const text = `${currentQuote.text} —— ${currentQuote.author}《${currentQuote.source}》`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [currentQuote]);

  const totalQuotes = useMemo(() => Object.values(inkQuoteData).reduce((sum, arr) => sum + arr.length, 0), []);

  return (
    <Card className="breathing-glow">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold poem-title flex items-center gap-2">
            <span className="text-xl">🖌️</span>
            水墨名句
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {totalQuotes} 条名句
            </span>
            {count > 0 && (
              <span className="text-xs text-muted-foreground">
                已赏 {count} 句
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">点击水墨按钮，品鉴古文名句，感受千年文脉</p>

        {/* Ink buttons grid — 2 rows of 5 */}
        <div className="grid grid-cols-5 gap-2">
          {inkTypeConfig.map(({ label, variant, size, desc }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <InkSplashButton variant={variant} size={size} onClick={() => handleInkClick(label)}>
                {label}
              </InkSplashButton>
              <span className="text-[10px] text-muted-foreground">{desc}</span>
            </div>
          ))}
        </div>

        {/* Quote display area */}
        {currentQuote && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 animate-fade-in-up space-y-2">
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs text-primary/50 font-medium">{currentType}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
                title="复制名句"
              >
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {copied ? '已复制' : '复制'}
              </button>
            </div>
            <p className="poem-text text-base text-primary/90 text-center leading-relaxed">{currentQuote.text}</p>
            <p className="text-xs text-muted-foreground text-center">
              —— {currentQuote.author}《{currentQuote.source}》
            </p>
          </div>
        )}

        {/* Recent history */}
        {history.length > 1 && (
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">最近品鉴</p>
            <div className="space-y-1">
              {history.slice(1).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground/70">
                  <span className="shrink-0 text-primary/40">{item.type}</span>
                  <span className="truncate poem-text">{item.quote.text}</span>
                  <span className="shrink-0 opacity-50">{item.quote.author}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scroll Reveal Text demo */}
        <div className="pt-4 border-t border-border/20 mt-4">
          <h3 className="text-lg font-semibold poem-title flex items-center gap-2 mb-2">
            <span className="text-xl">📜</span>
            滚动显现
          </h3>
          <ScrollRevealText
            text="千里之行，始于足下。学而不思则罔，思而不学则殆。温故而知新，可以为师矣。"
            mode="sentence"
            charDelay={400}
            className="text-muted-foreground"
          />
        </div>
      </CardContent>
    </Card>
  );
}
