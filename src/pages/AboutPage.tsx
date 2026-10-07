import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useRef, useState } from 'react';
import { getAllWorks, getWorksByStage } from '@/services/DataService';
import { authors } from '@/data/authors';
import {
  BookOpen, Search, BarChart3, Network, MessageCircle, Sparkles,
  Github, ExternalLink, Scale, Feather, GraduationCap, Heart,
  Library, PenTool, Eye, Brain, Map, Puzzle, MousePointer, Waves,
  ChevronRight
} from 'lucide-react';

/** Animated counter hook */
function useAnimatedCounter(target: number, duration = 1200, trigger = true) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration, trigger]);
  return value;
}

/** Scroll-triggered visibility hook */
function useScrollVisible(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/** Typewriter text component */
function TypewriterText({ text, delay = 80, trigger = true }: { text: string; delay?: number; trigger?: boolean }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    setStarted(true);
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay, trigger]);

  if (!started) return <span>{text[0]}</span>;

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-[2px] h-[1em] bg-primary/60 ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
}

export default function AboutPage() {
  const statsVisible = useScrollVisible();
  const contentVisible = useScrollVisible();
  const featuresVisible = useScrollVisible();
  const makerVisible = useScrollVisible();
  const licenseVisible = useScrollVisible();

  // 动态统计：直接从数据源计算，与数据保持同步，永不过期
  const stats = useMemo(() => {
    const all = getAllWorks();
    return {
      total: all.length,
      authors: authors.length,
      primary: getWorksByStage('小学').length,
      middle: getWorksByStage('初中').length,
      high: getWorksByStage('高中').length,
      themes: new Set(all.flatMap((w) => w.themes)).size,
      dynasties: new Set(all.map((w) => w.dynasty)).size,
    };
  }, []);

  const countWorks = useAnimatedCounter(stats.total, 1200, statsVisible.visible);
  const countAuthors = useAnimatedCounter(stats.authors, 1200, statsVisible.visible);
  const countStages = useAnimatedCounter(3, 600, statsVisible.visible);
  const countThemes = useAnimatedCounter(stats.themes, 1200, statsVisible.visible);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8 animate-fade-in-up relative overflow-hidden">
        {/* Floating petals */}
        <div className="petal" style={{ left: '15%', top: '10%', animationDelay: '0s', animationDuration: '5s' }} />
        <div className="petal" style={{ left: '70%', top: '5%', animationDelay: '2s', animationDuration: '6s' }} />
        <div className="petal" style={{ left: '45%', top: '15%', animationDelay: '1s', animationDuration: '7s' }} />
        <div className="petal" style={{ left: '85%', top: '20%', animationDelay: '3s', animationDuration: '5.5s' }} />
        <div className="ink-dot" style={{ left: '8%', top: '30%', animationDelay: '1s' }} />
        <div className="ink-dot" style={{ left: '92%', top: '40%', animationDelay: '2.5s' }} />
        <div className="inline-block mb-4">
          <span className="seal-stamp">关于</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-primary poem-title mb-3 text-aurora">
          关于我们
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto leading-relaxed">
          <TypewriterText text="探索中华经典诗文之美，让古人的智慧在指尖流淌" delay={60} trigger={true} />
        </p>
      </section>

      <div className="ink-divider max-w-xs mx-auto" />

      {/* Stats Counter Section */}
      <div ref={statsVisible.ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: countWorks, label: '诗文篇目', hint: `${stats.dynasties} 个朝代` },
          { value: countAuthors, label: '历代作者', hint: '先秦至近现代' },
          { value: countStages, label: '学段覆盖', hint: '小学 · 初中 · 高中' },
          { value: countThemes, label: '主题分类', hint: `${stats.total} 篇全覆盖` },
        ].map((s, i) => (
          <div
            key={s.label}
            className={`card-modern text-center py-6 px-3 transition-all duration-700 ${
              statsVisible.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <p className="text-4xl md:text-5xl font-bold poem-title tabular-nums text-aurora">{s.value}</p>
            <p className="text-sm font-medium mt-2 poem-text-sm">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="ink-divider max-w-xs mx-auto" />

      {/* 功能介绍 */}
      <section ref={featuresVisible.ref} className={`relative transition-all duration-700 ${featuresVisible.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Decorative ink painting */}
        <div
          className="absolute right-0 top-0 w-48 h-48 bg-cover bg-center opacity-[0.06] pointer-events-none mask-radial"
          style={{ backgroundImage: "url('./images/ink-guqin.webp')" }}
        />
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold poem-title brush-underline pb-1">功能介绍</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FeatureCard icon={<Library className="h-5 w-5" />} title="全量诗文收录" description={`涵盖小学、初中、高中部编版语文教材全部 ${stats.total} 篇古诗文，${stats.authors} 位作者，横跨多个朝代，篇篇有注释赏析。`} index={0} visible={featuresVisible.visible} />
          <FeatureCard icon={<Search className="h-5 w-5" />} title="全文智能搜索" description="基于 Fuse.js 模糊搜索引擎，支持按标题、作者、朝代、主题、原文内容等多维度即时检索。" index={1} visible={featuresVisible.visible} />
          <FeatureCard icon={<Eye className="h-5 w-5" />} title="五维分类筛选" description="按学段、朝代、主题、体裁、作者五大维度自由组合筛选，快速定位感兴趣的诗文。" index={2} visible={featuresVisible.visible} />
          <FeatureCard icon={<BarChart3 className="h-5 w-5" />} title="数据可视化" description="ECharts 驱动的统计图表：朝代分布、主题词云、学段对比、作者产出排行，以图表洞察诗文全貌。" index={3} visible={featuresVisible.visible} />
          <FeatureCard icon={<Network className="h-5 w-5" />} title="关系网络图谱" description="力导向布局呈现作者—作品—主题—朝代的关系网络，单篇聚焦或全局鸟瞰，发现隐藏关联。" index={4} visible={featuresVisible.visible} />
          <FeatureCard icon={<Brain className="h-5 w-5" />} title="深度可视化" description="叙事类诗文的故事时间轴与情节梗概、写景类诗文的写景层次图、抒情类诗文的情感曲线图，多维度感受诗文之美。" index={5} visible={featuresVisible.visible} />
          <FeatureCard icon={<Map className="h-5 w-5" />} title="行迹图" description="基于地理信息的作者行迹可视化，在地图上追踪诗人的足迹路线，将诗文与地理空间关联，身临其境感受诗境。" index={6} visible={featuresVisible.visible} />
          <FeatureCard icon={<PenTool className="h-5 w-5" />} title="交互式注释" description="原文中的注释词语可点击查看释义浮窗，诗词鉴赏不再需要频繁翻查词典。" index={7} visible={featuresVisible.visible} />
          <FeatureCard icon={<Puzzle className="h-5 w-5" />} title="诗词拼图" description="将诗句打乱顺序，点击字符按正确语序还原，在趣味互动中加深对诗句的记忆与理解。" index={8} visible={featuresVisible.visible} />
          <FeatureCard icon={<MousePointer className="h-5 w-5" />} title="水墨光效交互" description="自定义水墨风格光标、流光文字、呼吸光晕、墨滴扩散等动态视觉效果，沉浸式体验古典诗境之美。" index={9} visible={featuresVisible.visible} />
          <FeatureCard icon={<MessageCircle className="h-5 w-5" />} title="AI 助手" description="内置 AI 悬浮球，支持 OpenAI 兼容接口，可自由配置 API 地址与模型，与 AI 对话探讨诗文深意。" index={10} visible={featuresVisible.visible} />
          <FeatureCard icon={<Feather className="h-5 w-5" />} title="文学常识卡片" description="平仄、对仗、用典、意象、词牌、赋比兴……翻转卡片学习传统文学知识，寓教于乐。" index={11} visible={featuresVisible.visible} />
          <FeatureCard icon={<BookOpen className="h-5 w-5" />} title="每日一诗" description="每日精选一篇诗文推荐，让经典融入日常，日积月累感受诗意人生。" index={12} visible={featuresVisible.visible} />
          <FeatureCard icon={<Waves className="h-5 w-5" />} title="动态视觉装饰" description="飘动光带、星点闪烁、水墨晕染等细腻动效贯穿全站，以视觉语言诠释古典美学的意韵与节奏。" index={13} visible={featuresVisible.visible} />
        </div>
      </section>

      <div className="ink-divider max-w-xs mx-auto" />

      {/* 内容简介 — Timeline style */}
      <section ref={contentVisible.ref} className={`relative transition-all duration-700 ${contentVisible.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Decorative ink painting */}
        <div
          className="absolute left-0 bottom-0 w-40 h-40 bg-cover bg-center opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: "url('./images/ink-study.webp')" }}
        />
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold poem-title brush-underline pb-1">内容简介</h2>
        </div>
        <Card className="corner-decoration paper-texture">
          <CardContent className="p-6 space-y-6">
            <p className="leading-relaxed">
              本站收录了现行部编版（统编版）语文教材中全部古诗文篇目，涵盖从小学到高中三个学段，
              是目前最完整的部编版古诗文数字化学习资源之一。
            </p>

            {/* Timeline-style stage descriptions */}
            <div className="relative pl-8 space-y-6">
              {/* Vertical timeline line */}
              <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-primary/10" />

              {/* 小学 */}
              <div className={`relative transition-all duration-600 ${contentVisible.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '0.1s' }}>
                <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-primary/80 border-2 border-background shadow-sm" />
                <div className="verse-highlight">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">小学</span>
                    <span className="text-xs text-muted-foreground">{stats.primary} 篇</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    以短小精悍的唐诗宋词为主，注重语言感知与审美启蒙，从《静夜思》到《村居》，陪伴孩子走进古典诗词的世界。
                  </p>
                </div>
              </div>

              {/* 初中 */}
              <div className={`relative transition-all duration-600 ${contentVisible.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '0.25s' }}>
                <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-primary/60 border-2 border-background shadow-sm" />
                <div className="verse-highlight">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">初中</span>
                    <span className="text-xs text-muted-foreground">{stats.middle} 篇</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    篇目难度与篇幅递增，从《桃花源记》的乌托邦想象到《岳阳楼记》的家国情怀，培养学生文言文阅读能力与人文素养。
                  </p>
                </div>
              </div>

              {/* 高中 */}
              <div className={`relative transition-all duration-600 ${contentVisible.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} style={{ transitionDelay: '0.4s' }}>
                <div className="absolute -left-5 top-1.5 w-3 h-3 rounded-full bg-primary/40 border-2 border-background shadow-sm" />
                <div className="verse-highlight">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">高中</span>
                    <span className="text-xs text-muted-foreground">{stats.high} 篇</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    选篇更为精深，从《离骚》的楚辞瑰丽到《赤壁赋》的哲思妙境，引领学生深入体会中华文化的厚重与深远。
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/20">
              <p className="leading-relaxed text-sm">
                每篇诗文均配备完整的原文、注释、赏析与可视化数据。<strong className="text-foreground">叙事类</strong>作品提供故事梗概与时间轴，
                <strong className="text-foreground">写景类</strong>作品提供写景层次分析，<strong className="text-foreground">抒情类</strong>作品提供情感曲线，力求以多元视角呈现古诗文的丰富内涵。
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="ink-divider max-w-xs mx-auto" />

      {/* 制作者介绍 */}
      <section ref={makerVisible.ref} className={`transition-all duration-700 ${makerVisible.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center gap-2 mb-6">
          <Heart className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold poem-title brush-underline pb-1">制作者</h2>
        </div>
        <Card className="overflow-hidden breathing-glow">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* 左侧：个人名片 */}
              <div className="flex-1 p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-4">
                  {/* Avatar with animated ring */}
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20 flex items-center justify-center">
                      <Feather className="h-7 w-7 text-primary" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-primary/10 animate-ping" style={{ animationDuration: '3s' }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold poem-title">InkStain</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      毕业于著名师范大学 · 文学与技术的交汇者
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  一位非著名提示词工程师。相信技术与人文的交汇处自有风景，
                  以代码为笔、以模型为墨，在数字世界中重现古典诗文的万千气象。
                  以为古文学习不应止于纸面，而是可以交互、可视、感受的鲜活体验。
                </p>

                {/* Signature with typewriter */}
                <div className="verse-highlight">
                  <p className="text-sm text-primary/70 italic poem-text">
                    <TypewriterText text="路漫漫其修远兮，吾将上下而求索。" delay={80} trigger={makerVisible.visible} />
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="https://github.com/InkStain258"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 transition-all duration-300 text-sm font-medium group hover:scale-[1.02] hover:shadow-md"
                  >
                    <Github className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                    <span>GitHub</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                  <a
                    href="https://space.bilibili.com/510729504"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FB7299]/10 hover:bg-[#FB7299]/20 border border-[#FB7299]/20 transition-all duration-300 text-sm font-medium group hover:scale-[1.02] hover:shadow-md"
                  >
                    <svg className="h-4 w-4 text-[#FB7299] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L8.56 4.44c.071.071.134.142.187.213h5.907a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906L17.813 4.653zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773H5.333zm4 5.427c-.746 0-1.333-.6-1.333-1.334 0-.733.587-1.333 1.333-1.333s1.334.6 1.334 1.333c0 .734-.588 1.334-1.334 1.334zm5.334 0c-.747 0-1.334-.6-1.334-1.334 0-.733.587-1.333 1.334-1.333.746 0 1.333.6 1.333 1.333 0 .734-.587 1.334-1.333 1.334z"/>
                    </svg>
                    <span>哔哩哔哩</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </a>
                </div>
              </div>

              {/* 右侧：装饰 */}
              <div className="hidden md:flex w-48 items-center justify-center bg-gradient-to-br from-primary/5 to-primary/[0.02] border-l relative overflow-hidden star-twinkle">
                <img
                  src="./images/ink-crane.webp"
                  alt="水墨仙鹤"
                  className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
                />
                <div className="text-center space-y-3 relative z-10">
                  <div className="seal-stamp scale-75 animate-float" style={{ animationDuration: '4s' }}>墨</div>
                  <p className="text-xs text-muted-foreground poem-text">以墨为记</p>
                  <div className="ink-dot" style={{ left: '20%', top: '10%', animationDelay: '1s' }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="ink-divider max-w-xs mx-auto" />

      {/* 版权许可 */}
      <section ref={licenseVisible.ref} className={`transition-all duration-700 ${licenseVisible.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="flex items-center gap-2 mb-6">
          <Scale className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold poem-title brush-underline pb-1">版权许可</h2>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 breathe">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Apache License</h3>
                <p className="text-sm text-muted-foreground">Version 2.0, January 2004</p>
              </div>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground leading-relaxed space-y-2">
              <p>
                本项目基于 <strong className="text-foreground">Apache License 2.0</strong> 开源协议发布。
                您可以自由地使用、复制、修改、分发本作品，但需遵守以下条件：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>分发时必须保留版权声明、许可声明和免责声明</li>
                <li>如对代码进行修改，须在修改的文件中注明变更</li>
                <li>如以源码形式分发，须在源码中保留上述声明</li>
                <li>不得以本项目贡献者的名义为衍生作品背书</li>
              </ul>
              <p className="text-xs mt-3">
                完整许可文本请参阅：
                <a
                  href="https://www.apache.org/licenses/LICENSE-2.0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  https://www.apache.org/licenses/LICENSE-2.0
                  <ExternalLink className="h-3 w-3" />
                </a>
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              诗文原文属于公共领域作品。本站的注释、赏析、可视化等原创内容在 Apache 2.0 协议下发布。
            </p>
          </CardContent>
        </Card>
      </section>

      {/* 底部引导 */}
      <section className="text-center py-8 animate-fade-in space-y-4 relative overflow-hidden">
        <div className="petal" style={{ left: '25%', top: '10%', animationDelay: '0.5s', animationDuration: '6s' }} />
        <div className="petal" style={{ left: '75%', top: '5%', animationDelay: '2s', animationDuration: '5s' }} />
        <div className="wave-divider" />
        <p className="text-muted-foreground poem-text shimmer-glow inline-block">
          千里之行，始于足下
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/works">
            <Button className="group">
              浏览诗文
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
          <Link to="/category">
            <Button variant="outline">分类探索</Button>
          </Link>
          <Link to="/stats">
            <Button variant="outline">数据统计</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

/** 功能卡片子组件 — with hover tilt and stagger */
function FeatureCard({
  icon,
  title,
  description,
  index = 0,
  visible = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
  visible?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -6, y: x * 6 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const delay = Math.min(index * 0.06, 0.8);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className="card-modern group transition-transform duration-200 ease-out"
        style={{ transform: `perspective(600px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
      >
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="text-primary breathe">{icon}</div>
            <h3 className="font-semibold text-sm">{title}</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
}
