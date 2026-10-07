import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import FavoriteButton from '@/components/common/FavoriteButton';
import WorkCard from '@/components/common/WorkCard';
import EmptyState from '@/components/common/EmptyState';
import InteractivePoemText from '@/components/common/InteractivePoemText';
import KnowledgeFlipCard from '@/components/common/KnowledgeFlipCard';
import PoemPuzzle from '@/components/common/PoemPuzzle';
import EmotionCurve from '@/components/visualization/EmotionCurve';
import NarrativeTimeline from '@/components/visualization/NarrativeTimeline';
import ScenicLayers from '@/components/visualization/ScenicLayers';
import RelationGraph from '@/components/visualization/RelationGraph';
import AuthorJourneyMap from '@/components/visualization/AuthorJourneyMap';
import ImageryPalette from '@/components/common/ImageryPalette';
import StyleRadar, { StyleTag } from '@/components/common/StyleRadar';
import { getAuthorJourney } from '@/services/GeoService';
import { getAllWorks } from '@/services/DataService';
import { getStyleScores, STYLE_DIMENSIONS, DIMENSION_LABELS, DIMENSION_COLORS } from '@/lib/styleScorer';
import { useWorkDetail } from '@/hooks/useWorkDetail';
import type { Theme, ClassicalWork } from '@/types';

/** Select a decorative ink painting based on work themes */
function getThemeDecorImage(themes: Theme[]): string {
  const themeImageMap: Record<string, string> = {
    '田园': './images/ink-lotus.webp',
    '山水': './images/ink-landscape.webp',
    '思乡': './images/ink-moon.webp',
    '送别': './images/ink-pine.webp',
    '咏物': './images/ink-plum.webp',
    '哲理': './images/ink-scroll.webp',
    '爱国': './images/ink-crane.webp',
    '人生': './images/ink-bamboo.webp',
  };
  for (const t of themes) {
    if (themeImageMap[t]) return themeImageMap[t];
  }
  return './images/ink-plum.webp';
}

export default function WorkDetailPage() {
  const { work, relatedWorks } = useWorkDetail();

  // 动态设置页面标题
  useEffect(() => {
    if (work) {
      document.title = work.title + ' - 部编古诗文';
    }
    return () => { document.title = '部编古诗文'; };
  }, [work]);

  if (!work) {
    return <EmptyState title="诗文未找到" description="请检查链接是否正确" />;
  }

  const hasVisualization = work.visualization && work.visualization.type !== 'none';

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Back navigation */}
      <Link to="/works" className="animate-fade-in">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回列表
        </Button>
      </Link>

      {/* Title section with decoration */}
      <div className="flex items-start justify-between animate-fade-in-up stagger-1 ink-glow">
        <div>
          <h1 className="text-3xl font-bold poem-title brush-underline pb-2">{work.title}</h1>
          <p className="text-muted-foreground mt-2 text-lg poem-text-sm">
            {work.dynasty} · {work.author}
          </p>
        </div>
        <FavoriteButton workId={work.id} className="h-10 w-10" />
      </div>

      {/* Tags with theme colors */}
      <div className="flex flex-wrap gap-2 animate-fade-in-up stagger-2">
        <Badge variant="secondary">{work.gradeLevel.stage} {work.gradeLevel.grade}</Badge>
        <Badge variant="outline">{work.genre.category} · {work.genre.subGenre}</Badge>
        {work.themes.map((t) => (
          <span key={t} className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium theme-badge-${t}`}>
            {t}
          </span>
        ))}
      </div>

      <div className="ink-divider" />

      {/* Main content with tabs */}
      <Tabs defaultValue="original" className="w-full animate-fade-in-up stagger-3">
        <TabsList className="w-full justify-start flex-wrap gap-1 sticky top-14 z-30 bg-background/95 backdrop-blur-md border-b pb-2 pt-1 rounded-none supports-[backdrop-filter]:bg-background/80">
          <TabsTrigger value="original">原文</TabsTrigger>
          <TabsTrigger value="annotation">注释</TabsTrigger>
          <TabsTrigger value="translation">译文</TabsTrigger>
          {work.literaryInfo && <TabsTrigger value="literary">赏析</TabsTrigger>}
          {hasVisualization && <TabsTrigger value="visualization">可视化</TabsTrigger>}
          <TabsTrigger value="imagery">意象色彩</TabsTrigger>
          <TabsTrigger value="style">风格雷达</TabsTrigger>
          <TabsTrigger value="relation">关系网络</TabsTrigger>
          {getAuthorJourney(work.author) && <TabsTrigger value="journey">行迹图</TabsTrigger>}
        </TabsList>

        {/* Original text - interactive with annotations */}
        <TabsContent value="original">
          <Card className="corner-decoration paper-texture relative">
            <CardContent className="p-6">
              <InteractivePoemText
                original={work.text.original}
                annotations={work.annotations}
                sentences={work.text.sentences}
              />
              {work.stats && (
                <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
                  <span>共 {work.stats.charCount} 字</span>
                  <span>{work.stats.sentenceCount} 句</span>
                </div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                💡 点击带下划线的词语可查看注释
              </p>
              {/* Decorative ink painting based on theme */}
              <img
                src={getThemeDecorImage(work.themes)}
                alt=""
                className="absolute top-0 right-0 w-24 h-32 object-cover opacity-[0.06] pointer-events-none"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Annotations */}
        <TabsContent value="annotation">
          <Card className="paper-texture">
            <CardHeader>
              <CardTitle className="text-lg poem-title brush-underline pb-1">词语注释 <span className="text-sm font-normal text-muted-foreground">（共 {work.annotations.length} 条）</span></CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {work.annotations.map((ann, i) => (
                    <div key={i} className="flex gap-3 py-1.5 border-b border-border/30 last:border-0 hover:bg-primary/5 transition-colors rounded px-1">
                      <span className="font-semibold text-primary min-w-fit">{ann.term}</span>
                      <span className="text-muted-foreground">{ann.note}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Translation */}
        <TabsContent value="translation">
          <Card className="ink-wash-blob">
            <CardHeader>
              <CardTitle className="text-lg poem-title">白话译文</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="leading-relaxed text-lg">{work.translation}</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Literary analysis */}
        {work.literaryInfo && (
          <TabsContent value="literary">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">作者简介</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{work.literaryInfo.authorBio}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">创作背景</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="leading-relaxed">{work.literaryInfo.background}</p>
                </CardContent>
              </Card>
              <Card className="corner-decoration relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-lg">文学价值</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="verse-highlight">
                    <p className="leading-relaxed">{work.literaryInfo.significance}</p>
                  </div>
                  {/* Decorative ink painting based on theme */}
                  <img
                    src={getThemeDecorImage(work.themes)}
                    alt=""
                    className="absolute bottom-0 right-0 w-20 h-28 object-cover opacity-[0.05] pointer-events-none"
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Visualization */}
        {hasVisualization && work.visualization && (
          <TabsContent value="visualization">
            <div className="space-y-4">
              {work.visualization.type === 'narrative' && work.visualization.narrativeData && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">故事梗概</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-relaxed text-base">{work.visualization.narrativeData.summary}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <NarrativeTimeline data={work.visualization.narrativeData} />
                    </CardContent>
                  </Card>
                </>
              )}
              {work.visualization.type === 'lyrical' && work.visualization.lyricalData && (
                <Card>
                  <CardContent className="p-4">
                    <EmotionCurve data={work.visualization.lyricalData} />
                  </CardContent>
                </Card>
              )}
              {work.visualization.type === 'scenic' && work.visualization.scenicData && (
                <Card>
                  <CardContent className="p-4">
                    <ScenicLayers data={work.visualization.scenicData} />
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        )}

        {/* Imagery Color Palette */}
        <TabsContent value="imagery">
          <Card className="paper-texture">
            <CardContent className="p-6">
              <ImageryPalette text={work.text.original} title="意象色彩" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Style Radar */}
        <TabsContent value="style">
          <StyleRadarSection work={work} />
        </TabsContent>

        {/* Relation graph */}
        <TabsContent value="relation">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">诗文关系网络</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-3">展示与本文相关的作者、同朝代作品、同主题作品之间的关系。可拖拽和缩放查看。</p>
              <RelationGraph workId={work.id} height="450px" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Author Journey Map */}
        {getAuthorJourney(work.author) && (
          <TabsContent value="journey">
            <Card className="paper-texture">
              <CardHeader>
                <CardTitle className="text-lg poem-title brush-underline pb-1">
                  {work.author}行迹图
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-3">
                  展示{work.author}的主要行迹路线，可拖拽和缩放查看。标记点为{work.author}曾到访的重要地点，箭头飞线表示行迹方向。
                </p>
                <AuthorJourneyMap author={work.author} height="450px" />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <div className="ink-divider" />

      {/* Knowledge flip card */}
      <section className="animate-fade-in-up">
        <h2 className="text-xl font-bold mb-4 poem-title">文学常识</h2>
        <KnowledgeFlipCard />
      </section>

      {/* Interactive Puzzle */}
      {work.text.sentences.length >= 2 && (
        <section className="animate-fade-in-up floating-ribbon relative">
          <h2 className="text-xl font-bold mb-4 poem-title shimmer-glow">互动拼图</h2>
          <PoemPuzzle
            sentences={work.text.sentences}
            title={work.title}
            author={work.author}
          />
        </section>
      )}

      {/* Related works */}
      {relatedWorks.length > 0 && (
        <section className="animate-fade-in">
          <h2 className="text-xl font-bold mb-4 poem-title">相关推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedWorks.map((w) => (
              <WorkCard key={w.id} work={w} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** 风格雷达详情区（含对比功能） */
function StyleRadarSection({ work }: { work: ClassicalWork }) {
  const [compareId, setCompareId] = useState<string | null>(null);
  const allWorks = useMemo(() => getAllWorks(), []);
  const scores = useMemo(() => getStyleScores(work), [work]);
  const compareWork = useMemo(() => compareId ? allWorks.find(w => w.id === compareId) : undefined, [compareId, allWorks]);

  // 同作者/同朝代作品用于对比
  const comparableWorks = useMemo(() => {
    return allWorks
      .filter(w => w.id !== work.id && (w.author === work.author || w.dynasty === work.dynasty))
      .slice(0, 12);
  }, [allWorks, work]);

  return (
    <div className="space-y-4">
      <Card className="paper-texture">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold poem-title">风格雷达图</h3>
            <StyleTag scores={scores} />
          </div>
          <StyleRadar work={work} compareWork={compareWork} height="380px" />

          {/* 分数详情 */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
            {STYLE_DIMENSIONS.map(dim => (
              <div key={dim} className="text-center p-2 rounded-lg" style={{ backgroundColor: DIMENSION_COLORS[dim] + '10' }}>
                <p className="text-xs text-muted-foreground">{DIMENSION_LABELS[dim]}</p>
                <p className="text-lg font-bold" style={{ color: DIMENSION_COLORS[dim] }}>{scores[dim]}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 对比选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">对比其他作品</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {comparableWorks.map(w => (
              <button
                key={w.id}
                className={`px-3 py-1.5 rounded-full text-xs transition-all border ${
                  compareId === w.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-secondary/50 hover:bg-primary/10 border-border/30'
                }`}
                onClick={() => setCompareId(compareId === w.id ? null : w.id)}
              >
                {w.title} · {w.author}
              </button>
            ))}
          </div>
          {compareId && (
            <p className="text-sm text-muted-foreground mt-2">
              已选择对比：{compareWork?.title} · {compareWork?.author}
              <button className="ml-2 text-primary hover:underline" onClick={() => setCompareId(null)}>
                取消对比
              </button>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
