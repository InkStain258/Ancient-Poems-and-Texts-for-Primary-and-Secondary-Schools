import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DynastyDistChart from '@/components/visualization/DynastyDistChart';
import GradeDistChart from '@/components/visualization/GradeDistChart';
import ThemeDistChart from '@/components/visualization/ThemeDistChart';
import GenreDistChart from '@/components/visualization/GenreDistChart';
import AuthorTopChart from '@/components/visualization/AuthorTopChart';
import DynastyStageHeatmap from '@/components/visualization/DynastyStageHeatmap';
import CharCountDistChart from '@/components/visualization/CharCountDistChart';
import RelationGraph from '@/components/visualization/RelationGraph';
import AuthorJourneyMap from '@/components/visualization/AuthorJourneyMap';
import { getSummaryStats, getAuthorRanking } from '@/services/StatsService';

export default function StatsPage() {
  const stats = getSummaryStats();
  const authorRanking = getAuthorRanking(12);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Banner */}
      <div className="relative rounded-xl overflow-hidden animate-fade-in-up">
        <img
          src="./images/ink-moon-tower.webp"
          alt=""
          className="w-full h-28 md:h-36 object-cover opacity-10 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/30 pointer-events-none" />
        <div className="ink-dot absolute top-4 left-8 opacity-20" />
        <div className="ink-dot absolute bottom-3 right-6 opacity-25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <h1 className="text-3xl font-bold poem-title text-aurora">数据统计</h1>
          <p className="text-sm text-muted-foreground mt-2 verse-highlight inline-block px-3 py-1">以数据之眼，观诗文万象</p>
        </div>
      </div>

      {/* ── Core metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { value: stats.totalWorks, label: '诗文总数', icon: '📜' },
          { value: stats.totalAuthors, label: '作者数量', icon: '✍️' },
          { value: stats.totalDynasties, label: '跨越朝代', icon: '🏯' },
          { value: stats.totalThemes, label: '主题分类', icon: '🎨' },
          { value: stats.totalChars.toLocaleString(), label: '总字数', icon: '📝' },
          { value: stats.totalAnnotations, label: '注释条目', icon: '📖' },
        ].map((item, i) => (
          <div
            key={item.label}
            className="animate-fade-in-up card-modern"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <Card className="border-0 shadow-none bg-transparent hover:bg-primary/5 transition-colors duration-200">
              <CardContent className="p-3 text-center">
                <span className="text-xl">{item.icon}</span>
                <p className="text-2xl font-bold text-primary mt-1">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* ── Highlight stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in-up stagger-1">
        {[
          { label: '最热门朝代', value: `${stats.topDynasty.name} (${stats.topDynasty.count}篇)`, icon: '🏛️' },
          { label: '最多产作者', value: `${stats.topAuthor.name} (${stats.topAuthor.count}篇)`, icon: '🏅' },
          { label: '最常见主题', value: `${stats.topTheme.name} (${stats.topTheme.count}篇)`, icon: '🌟' },
          { label: '诗文/文言文', value: `${stats.poetryCount} : ${stats.proseCount}`, icon: '📚' },
        ].map((item) => (
          <div key={item.label} className="card-modern">
            <Card className="border-0 shadow-none bg-transparent hover:bg-primary/5 transition-colors duration-200">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold mt-0.5">{item.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* ── Char stats mini cards ── */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up stagger-2">
        <div className="card-modern">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">篇均字数</p>
              <p className="text-lg font-bold text-primary">{stats.avgChars}</p>
            </CardContent>
          </Card>
        </div>
        <div className="card-modern">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">最长篇目</p>
              <p className="text-sm font-semibold text-primary truncate" title={`${stats.maxCharWork.title} (${stats.maxCharWork.count}字)`}>
                {stats.maxCharWork.title} <span className="text-muted-foreground">({stats.maxCharWork.count}字)</span>
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="card-modern">
          <Card className="border-0 shadow-none bg-transparent">
            <CardContent className="p-3 text-center">
              <p className="text-xs text-muted-foreground">最短篇目</p>
              <p className="text-sm font-semibold text-primary truncate" title={`${stats.minCharWork.title} (${stats.minCharWork.count}字)`}>
                {stats.minCharWork.title} <span className="text-muted-foreground">({stats.minCharWork.count}字)</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Distribution charts row 1 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up stagger-3">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-lg brush-underline pb-1 inline-block">朝代分布</CardTitle>
          </CardHeader>
          <CardContent>
            <DynastyDistChart />
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-lg brush-underline pb-1 inline-block">学段分布</CardTitle>
          </CardHeader>
          <CardContent>
            <GradeDistChart />
          </CardContent>
        </Card>
      </div>

      {/* ── Distribution charts row 2 ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up stagger-4">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-lg brush-underline pb-1 inline-block">主题分布</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeDistChart />
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-lg brush-underline pb-1 inline-block">文体分布</CardTitle>
          </CardHeader>
          <CardContent>
            <GenreDistChart />
          </CardContent>
        </Card>
      </div>

      {/* ── Author TOP 10 + Char count dist ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up stagger-5">
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-lg brush-underline pb-1 inline-block">作者产量 TOP 10</CardTitle>
          </CardHeader>
          <CardContent>
            <AuthorTopChart />
          </CardContent>
        </Card>
        <Card className="card-modern">
          <CardHeader>
            <CardTitle className="text-lg brush-underline pb-1 inline-block">字数分布</CardTitle>
          </CardHeader>
          <CardContent>
            <CharCountDistChart />
          </CardContent>
        </Card>
      </div>

      {/* ── Dynasty × Stage heatmap ── */}
      <Card className="card-modern animate-fade-in-up stagger-6">
        <CardHeader>
          <CardTitle className="text-lg brush-underline pb-1 inline-block">朝代 × 学段热力图</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            颜色越深表示该朝代在对应学段的选篇越多，可直观发现教材选篇的时空分布规律。
          </p>
          <DynastyStageHeatmap />
        </CardContent>
      </Card>

      {/* ── Author ranking table ── */}
      <Card className="card-modern animate-fade-in-up stagger-7">
        <CardHeader>
          <CardTitle className="text-lg brush-underline pb-1 inline-block">作者排行榜</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-muted">
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">排名</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">作者</th>
                  <th className="text-left py-2 px-3 text-muted-foreground font-medium">朝代</th>
                  <th className="text-center py-2 px-3 text-muted-foreground font-medium">入选篇数</th>
                  <th className="text-right py-2 px-3 text-muted-foreground font-medium">代表作</th>
                </tr>
              </thead>
              <tbody>
                {authorRanking.map((author, i) => (
                  <tr
                    key={author.name}
                    className="border-b border-muted/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          i === 0
                            ? 'bg-amber-400 text-amber-950 shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                            : i === 1
                              ? 'bg-slate-300 text-slate-700'
                              : i === 2
                                ? 'bg-orange-700/90 text-orange-50'
                                : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium poem-text">{author.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{author.dynasty}</td>
                    <td className="py-2 px-3 text-center font-semibold text-primary">{author.count}</td>
                    <td className="py-2 px-3 text-right">
                      {author.representative && (
                        <Link
                          to={`/works/${author.representative}`}
                          className="text-xs text-muted-foreground hover:text-primary transition-colors underline underline-offset-2"
                        >
                          查看 →
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* ── Relationship network ── */}
      <Card className="card-modern animate-fade-in-up stagger-8">
        <CardHeader>
          <CardTitle className="text-lg brush-underline pb-1 inline-block">诗文关系网络</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            展示作者、作品、朝代、主题之间的关联网络。节点大小代表关联作品数，作者名标签悬于节点上方、
            朝代嵌于色环之内；创作关系为实线、同主题/同朝代为虚线（曲率错开防重叠）。
            <span className="hidden md:inline"> 悬停高亮相邻节点并显示关联篇数，可拖拽节点、缩放画布。</span>
            <span className="inline"> 🟢作者 🟠作品 🟡主题 🔴朝代</span>
          </p>
          <RelationGraph height="500px" />
        </CardContent>
      </Card>

      {/* ── Author journey map ── */}
      <Card className="card-modern animate-fade-in-up stagger-9">
        <CardHeader>
          <CardTitle className="text-lg poem-title brush-underline pb-1">文学行迹图</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            展示教材中主要文学家的行迹路线，不同颜色代表不同作者。路线端点与多位作者到访的枢纽城市
            以金色涟漪标注，节点大小随到访次数分级；悬停查看城市典故与行迹站位，底部图例可点击显隐作者。
            <span className="hidden md:inline"> 可拖拽和缩放查看。</span>
          </p>
          <AuthorJourneyMap height="550px" />
        </CardContent>
      </Card>

      {/* Bottom poetic divider */}
      <div className="pt-4 text-center">
        <div className="ink-divider max-w-xs mx-auto" />
        <p className="mt-3 text-xs text-muted-foreground/50 poem-text">博观而约取，厚积而薄发</p>
      </div>
    </div>
  );
}
