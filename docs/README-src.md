<div align="center">

# 部编古诗文

**千年文脉，触手可及**

_287 篇部编版古诗文的全量数字化收录 · 多维可视化 · 水墨美学 · AI 赋能_

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://www.apache.org/licenses/LICENSE-2.0)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)

</div>

---

## 📖 项目简介

本项目完整收录现行**部编版（统编版）语文教材**全部古诗文篇目，覆盖小学、初中、高中三个学段。每篇诗文均配备原文、注释、译文、赏析与多维可视化数据，辅以丰富的交互动效与**中国传统水墨美学**设计，让古典诗文学习不再枯燥。

这不是一个简单的诗文合集——它是一个**数字化、可视化、交互化**的古诗文学习平台，用现代 Web 技术重新诠释千年文脉。

---

## 📊 核心数据一览

| 维度 | 数据 | 说明 |
|:----:|:----:|------|
| 📜 诗文总量 | **287 篇** | 小学 122 + 初中 97 + 高中 68 |
| ✍️ 历代作者 | **125 位** | 横跨先秦至清代，9 个朝代 |
| 🏷️ 主题分类 | **15 种** | 爱国/山水/友情/思乡/哲理/田园/战争/咏物/咏史/送别/边塞/闺怨/节日/人生/爱情 |
| 📖 文学常识 | **242 张卡片** | 13 大分类，翻转学习 |
| 🖌️ 水墨名句 | **360 条** | 10 大主题，一键复制 |
| 🎨 水墨画作 | **18 幅** | AI 生成，亮/暗双模式 |
| 🗺️ 行迹城市 | **30+** | 古地名坐标，离线地图 |

---

## 🌟 功能详解

### 📚 全量诗文收录

287 篇诗文完整收录，每篇配备：

- **原文** — 支持交互式注释点击，即点即查
- **详细注释** — 逐词/逐句注释，ScrollArea 滚动阅读
- **白话译文** — 信达雅的现代汉语翻译
- **作者简介** — 生平概览与创作背景
- **文学价值赏析** — 深度文学批评与审美解读
- **叙事类专属** — 故事梗概卡片 + 叙事时间轴
- **主题动态装饰** — 8 种主题对应 8 幅水墨画

### 🔍 全文智能搜索

基于 **Fuse.js** 模糊搜索引擎，支持多维度即时检索：

- 按标题、作者、朝代搜索
- 按原文内容全文搜索
- 输入即出结果，零延迟体验
- **搜索高亮** — 匹配关键词在标题/作者/摘要中金色高亮，智能上下文片段截断

### 🏷️ 五维分类筛选

五大维度自由组合，精准定位目标诗文：

| 维度 | 可选项 |
|------|--------|
| 学段 | 小学 / 初中 / 高中 |
| 朝代 | 先秦 / 汉 / 魏晋南北朝 / 唐 / 宋 / 元 / 明 / 清 |
| 主题 | 15 种主题标签，颜色区分 |
| 体裁 | 诗 / 词 / 曲 / 文 / 赋 等，含子分类 |
| 年级 | 小学 1-6 年级 / 初中 7-9 年级 / 高中 10-12 年级 |

### 📊 数据可视化

**ECharts** 驱动的统计图表，从宏观到微观洞察诗文全貌：

| 图表 | 类型 | 说明 |
|------|------|------|
| 朝代分布图 | 柱状图 | 各朝代作品数量对比，深浅配色区分 |
| 学段分布图 | 柱状图 | 小学/初中/高中三学段对比 |
| 主题分布图 | 饼图 | 15 种主题占比，环形展示 |
| 文体分布图 | 柱状图 | 8 种子文体（古体诗/近体诗/词/曲/记叙文/说理文/写景文/抒情文）数量 |
| 作者产量 TOP 10 | 横向柱状图 | 入选篇目最多的 10 位作者排名 |
| 朝代×学段热力图 | 热力图 | 发现教材选篇的时空分布规律 |
| 字数分布图 | 直方图 | 6 个字数区间的篇数分布 |
| 关系网络图 | 力导向图 | 作者—作品—主题—朝代四维关系（🟢作者 🟠作品 🟡主题 🔴朝代） |
| 文学行迹图 | 地图 | 中国地图上追踪诗人足迹 |

**核心统计指标**：诗文总数、作者数量、跨越朝代、主题分类、总字数、注释条目、最热门朝代/作者/主题、篇均字数、最长/最短篇目

**作者排行榜**：TOP 12 作者排名表格，含朝代、入选篇数、代表作链接

### 🔗 关系网络图谱

力导向布局呈现**作者—作品—主题—朝代**四维关系网络：

- **单篇聚焦模式** — 以一篇作品为中心，展现其作者、同朝代诗人、同主题作品的关联网络（最多 50 节点）
- **全局鸟瞰模式** — 纵览所有作者、作品、主题的宏观关联（最多 150 节点，每作者最多 3 首代表作）
- 支持拖拽、缩放、悬停聚焦（高亮相邻节点）
- 节点大小反映关联作品数量
- 连线类型区分：创作（实线）/ 同朝代（虚线）/ 同主题（点线）

### 🎭 深度可视化

根据作品类型**智能匹配**可视化方案：

| 作品类型 | 可视化方式 | 说明 |
|----------|------------|------|
| 叙事类 | 📜 叙事时间轴 | 按情节节点展示故事脉络 |
| 抒情类 | 📈 情感曲线图 | 逐句情感值可视化 |
| 写景类 | 🏔️ 写景层次图 | 由远及近的空间层次分析 |

### 🗺️ 作者行迹图

基于地理信息的作者行迹可视化：

- 在中国地图上追踪诗人足迹，将诗文与地理空间关联
- **地图数据内置**（`chinaGeo.json`），离线环境亦可使用
- 支持 30+ 古地名坐标映射（使用古地名如"浔阳"而非现代地名"九江"）
- 不同作者不同颜色，可拖拽缩放

### 💬 交互式注释

原文中的注释词语**可点击查看释义浮窗**，无需频繁翻查词典：

- 注释词语自动高亮标注
- 点击弹出释义卡片
- 长文本自适应，安全上限 10000 字符

### 🧩 诗词拼图

将诗句打乱顺序，用户按正确语序点击字符还原：

- 三级难度：初窥（4 字）/ 品味（5 字）/ 通览（7 字）
- 多首诗歌轮换
- Fisher-Yates 洗牌算法保证随机性
- 在趣味互动中加深记忆

### 🖌️ 水墨名句

**360 条经典名句**，10 大主题水墨按钮：

| 主题 | 意境 | 主题 | 意境 |
|:----:|------|:----:|------|
| 墨韵 | 笔墨纵横 | 春晓 | 春日生趣 |
| 丹青 | 画意诗情 | 秋思 | 秋日感怀 |
| 风雅 | 文人雅集 | 送别 | 离愁别绪 |
| 烟波 | 羁旅思乡 | 情韵 | 深情眷恋 |
| 逸兴 | 豪情壮志 | 禅意 | 空灵禅悟 |

每条名句含出处与作者，支持**一键复制**（完整名句+出处），自动记录最近 8 条品鉴历史。

### 📖 文学常识卡片

**242 张翻转卡片**，覆盖 13 大分类：

| 分类 | 数量 | 分类 | 数量 |
|:----:|:----:|:----:|:----:|
| 格律 | 16 | 典故意象 | 24 |
| 修辞 | 18 | 诗人轶事 | 20 |
| 手法 | 20 | 音韵节奏 | 14 |
| 鉴赏 | 20 | 文学理论 | 14 |
| 体裁 | 20 | 古典美学 | 14 |
| 文化常识 | 22 | 名句赏析 | 20 |
| 文学史 | 20 | | |

- 支持分类筛选，颜色区分
- 正面问题、背面详解，翻转学习
- 进度计数显示

### 🌅 每日一诗

- 每日精选推荐一篇诗文
- 支持**"换一首"**手动刷新
- **分享海报** — Canvas 绘制精美宣纸风格海报，一键下载 PNG / Web Share API 分享
- 日积月累感受诗意人生

### ⏳ 时空穿越长卷

横向可滚动的朝代时间轴，纵览千年文脉：

- **9 大朝代**节点，从先秦到近现代
- 每个朝代展示：年代、文学流派、代表作品
- 作品卡片内嵌**意象色彩**和**风格迷你条**
- 左右箭头快速切换朝代，滚动定位

### 📅 诗词日历

365 天每天一首，日历式浏览：

- **日历网格** — 点击日期查看当日推荐诗文
- **年度速览** — 12 个月缩略卡片快速跳转
- **日历海报** — Canvas 绘制精美日历海报，一键保存分享
- 算法选取确保每天固定，同日同诗

### 🎨 意象色彩提取

根据诗文意象关键词自动生成主题配色卡：

- **50+ 意象词**映射表（月→银白、枫→赤红、柳→翠绿等）
- 渐变色带展示诗文整体色调
- 色卡网格 + 意象词云标签
- 每个意象附带情绪标签（如"月→清冷"、"枫→热烈"）
- 287 篇作品全覆盖

### 🕸️ 诗词风格雷达图

ECharts 雷达图展示每首诗的 6 维风格特征：

| 维度 | 说明 |
|:----:|------|
| 写景描摹 | 景物描写的细腻程度 |
| 抒情达意 | 情感表达的浓烈程度 |
| 叙事铺陈 | 叙事成分的比重 |
| 哲思理趣 | 哲理思辨的深度 |
| 豪迈奔放 | 豪放气质的强度 |
| 婉约含蓄 | 婉约含蓄的程度 |

- 基于 themes / genre / subGenre / visualization / 文本关键词多源评分
- **同屏对比** — 选择同作者/同朝代作品叠加显示
- 6 维分数详情卡片 + 主导风格标签
- 287 篇作品全覆盖

### 🤖 AI 助手

内置 AI 悬浮球，支持 **OpenAI 兼容接口**：

- 可自由配置 API 地址、密钥与模型
- 流式对话，实时响应
- 与 AI 对话探讨诗文深意
- 支持拖拽移动，不遮挡阅读

### 🌙 暗色模式

完整的亮/暗色双主题支持：

- 水墨画作针对暗色模式提供**专属深色版本**（3 幅深色导航水墨画）
- 渐变叠加层确保文字清晰可读
- ECharts 图表自动适配暗色主题
- 关系网络节点颜色暗色模式使用更亮变体
- 所有 CSS 装饰元素均有暗色模式适配

### ⭐ 收藏功能

- 一键收藏喜欢的诗文
- 收藏状态持久化存储（localStorage）
- 收藏按钮带心跳动画反馈

---

## 🎨 视觉设计体系

### 水墨美学

全站采用**中国传统水墨画**风格，AI 生成 18 幅水墨画作为装饰素材：

| 类别 | 作品 | 用途 |
|------|------|------|
| 🌸 梅花 | ink-plum / ink-plum-dark | 首页小学导航 |
| 🌿 兰花 | ink-orchid / ink-orchid-dark | 首页初中导航 |
| 🌲 松树 | ink-pine / ink-pine-dark | 首页高中导航 |
| 🌊 山水 | ink-landscape / hero-ink-bg | 首页 Hero 背景 |
| 🎋 竹子 | ink-bamboo | 装饰 |
| 🌼 菊花 | ink-chrysanthemum | 装饰 |
| 🪷 荷花 | ink-lotus | 田园/夏季主题 |
| 🦢 仙鹤 | ink-crane | 关于页 |
| 🏯 山亭 | ink-pavilion | 分类页 Banner |
| 📜 书卷 | ink-scroll | 空状态/详情页 |
| 🌙 月夜 | ink-moon | 统计页 |
| 🎵 古琴 | ink-guqin | 关于页功能介绍 |
| 📚 书斋 | ink-study | 关于页内容介绍 |
| 🌉 石桥 | ink-bridge | 作品列表页 Banner |
| 🏛️ 月楼 | ink-moon-tower | 统计页 Banner |

所有画作格式 webp，尺寸 512×512，单张体积控制在 **16-70KB**。

### CSS 动效系统

**20+ 种原创 CSS 动画与装饰效果**：

**入场动画**
- `fadeInUp` — 上浮渐入
- `fadeIn` — 淡入
- `slideInLeft` — 左滑入场
- `scaleIn` — 缩放入场
- `scrollRevealUp` — 滚动揭示

**水墨动效**
- `inkSpread` — 水墨扩散
- `inkGlowExpand` — 墨光扩散
- `inkDrop` — 墨滴扩散
- `brushReveal` — 毛笔揭示

**呼吸与悬浮**
- `float` — 悬浮
- `gentlePulse` — 柔和脉冲
- `breathe` — 呼吸
- `petalFall` — 花瓣飘落
- `floatParticle` — 悬浮粒子

**光效**
- `shimmerGlow` — 流光文字
- `breathingGlow` — 呼吸光晕
- `starTwinkle` — 星点闪烁
- `floatingRibbon` — 飘动光带
- `hoverGlow` — 悬停发光

**交互反馈**
- `ripple` — 涟漪
- `annotationPulse` — 注释脉冲
- `typewriter` — 打字机效果
- `glowPulse` — AI 球光晕

**装饰类**
- `.seal-stamp` — 印章（朱红方印，-8° 旋转）
- `.ink-divider` — 水墨分隔线（渐变）
- `.corner-decoration` — 角框装饰
- `.brush-underline` — 毛笔下划线
- `.verse-highlight` — 诗句高亮（渐变+左边框）
- `.mountain-silhouette` — 山峦剪影
- `.paper-texture` — 宣纸纹理
- `.ink-wash-blob` — 水墨晕染
- `.elegant-card` — 优雅卡片（渐变边框）
- `.card-ink-hover` — 卡片水墨悬停
- `.hero-ink-bg` — Hero 水墨背景
- `.wave-divider` — 波浪分割线
- `.ink-dot` — 悬浮墨点
- `.watermark-bg` — 水印背景

### 主题色彩系统

**15 种主题 Badge 配色**（亮色 + 暗色模式各一套）：

爱国(红) · 山水(蓝) · 友情(绿) · 思乡(紫) · 哲理(靛) · 田园(黄绿) · 战争(橙红) · 咏物(青) · 咏史(琥珀) · 送别(玫瑰) · 边塞(棕) · 闺怨(粉) · 节日(金) · 人生(石板灰) · 爱情(品红)

### 入场动画编排

全局使用 `stagger-*` 延迟类实现交错入场，从 `stagger-1`（100ms）到 `stagger-5`（500ms），营造层次感。

---

## 🛠️ 技术栈

| 技术 | 版本 | 用途 | 说明 |
|------|:----:|------|------|
| [Vite](https://vitejs.dev) | 5 | 构建工具 | 极速 HMR，优化打包 |
| [React](https://react.dev) | 18 | UI 框架 | Hooks + 函数组件 |
| [TypeScript](https://www.typescriptlang.org) | 5 | 类型安全 | 零编译错误 |
| [Tailwind CSS](https://tailwindcss.com) | 3 | 原子化样式 | class 暗色模式 |
| [shadcn/ui](https://ui.shadcn.com) | — | UI 组件库 | 可定制、无依赖 |
| [ECharts](https://echarts.apache.org) | 5 | 数据可视化 | 图表 + 关系网络 + 地图 |
| [Fuse.js](https://www.fusejs.io) | — | 模糊搜索 | 多字段加权搜索 |
| [zustand](https://zustand-demo.pmnd.rs) | — | 状态管理 | 轻量、支持 persist |
| [react-router-dom](https://reactrouter.com) | 6 | 路由 | HashRouter + ScrollToTop |
| [lucide-react](https://lucide.dev) | — | 图标库 | Tree-shakable |

### 架构特色

- **纯前端 SPA** — 无后端依赖，构建后可直接部署到任意静态服务器
- **数据内置** — 287 篇诗文 + 125 位作者 + 地图数据全部打包到 JS，离线可用
- **Hash Router** — 兼容 GitHub Pages，`base: './'` 相对路径
- **代码分割** — Vite 自动按路由分 chunk，按需加载
- **暗色模式** — 基于 `document.documentElement.classList` 的 class 策略，所有组件适配

---

## 📁 项目结构

```
bu_bian_chinese_classics/
├── public/
│   └── images/                   # AI 生成水墨画作（18 幅 webp）
├── src/
│   ├── components/
│   │   ├── common/               # 通用业务组件
│   │   │   ├── AIFloatingBall.tsx         # AI 悬浮球（OpenAI 兼容接口）
│   │   │   ├── CategoryGrid.tsx           # 分类网格
│   │   │   ├── EmptyState.tsx             # 空状态（书卷装饰）
│   │   │   ├── FavoriteButton.tsx         # 收藏按钮（心跳动画）
│   │   │   ├── FilterBar.tsx              # 五维筛选栏
│   │   │   ├── InkSplashButton.tsx        # 水墨名句（10 主题 360 条）
│   │   │   ├── InteractivePoemText.tsx    # 交互式注释原文
│   │   │   ├── KnowledgeFlipCard.tsx      # 文学常识翻转卡（242 张/13 分类）
│   │   │   ├── PoemPoster.tsx             # 每日一诗分享海报（Canvas 绘制 + Portal）
│   │   │   ├── PoemPuzzle.tsx             # 诗词拼图（3 级难度）
│   │   │   ├── ImageryPalette.tsx         # 意象色彩提取组件
│   │   │   ├── StyleRadar.tsx             # 诗词风格雷达图（ECharts + 对比）
│   │   │   ├── ScrollRevealText.tsx       # 滚动显现文字
│   │   │   ├── SearchBar.tsx              # 全文搜索栏
│   │   │   ├── StatBadge.tsx              # 统计徽章
│   │   │   ├── ThemeToggle.tsx            # 主题切换
│   │   │   └── WorkCard.tsx               # 诗文卡片
│   │   ├── layout/               # 布局组件
│   │   │   ├── Header.tsx                 # 顶部导航（印章 Logo + 水墨渐变底线）
│   │   │   ├── Footer.tsx                 # 页脚（水墨分割线 + 诗句引言）
│   │   │   ├── Layout.tsx                 # 布局容器
│   │   │   ├── MobileNav.tsx              # 移动端底部导航（5 项 + 活跃指示器）
│   │   │   └── ScrollToTop.tsx            # 路由切换自动回顶
│   │   ├── ui/                   # shadcn/ui 基础组件
│   │   └── visualization/        # 可视化组件
│   │       ├── AuthorJourneyMap.tsx       # 作者行迹图（ECharts + 内置地图）
│   │       ├── AuthorTopChart.tsx         # 作者产量 TOP 10 横向柱状图
│   │       ├── CharCountDistChart.tsx     # 字数分布直方图
│   │       ├── DynastyDistChart.tsx       # 朝代分布图
│   │       ├── DynastyStageHeatmap.tsx    # 朝代×学段热力图
│   │       ├── EChartsBase.tsx            # ECharts 基础组件（主题适配 + 热力图/雷达图注册）
│   │       ├── EmotionCurve.tsx           # 情感曲线
│   │       ├── GenreDistChart.tsx         # 文体分布图
│   │       ├── GradeDistChart.tsx         # 学段分布图
│   │       ├── NarrativeTimeline.tsx      # 叙事时间轴
│   │       ├── RelationGraph.tsx          # 关系网络图（4 类节点着色 + 暗色适配）
│   │       ├── ScenicLayers.tsx           # 写景层次图
│   │       └── ThemeDistChart.tsx         # 主题分布图
│   ├── data/                     # 数据文件
│   │   ├── primary.ts                    # 小学诗文数据（122 篇）
│   │   ├── middle.ts                     # 初中诗文数据（97 篇）
│   │   ├── high.ts                       # 高中诗文数据（68 篇）
│   │   ├── authors.ts                    # 作者数据（125 位，含 workCount/workIds）
│   │   ├── knowledgeCards.ts             # 文学常识卡片数据（242 张/13 分类）
│   │   ├── inkQuotes.ts                  # 水墨名句数据（360 条/10 主题）
│   │   ├── categories.ts                 # 分类元数据
│   │   └── chinaGeo.json                 # 中国地理坐标数据（离线地图）
│   ├── hooks/                    # 自定义 Hooks
│   │   ├── useDailyPoem.ts               # 每日一诗（含手动刷新）
│   │   └── usePagination.ts              # 分页逻辑
│   ├── pages/                    # 页面组件
│   │   ├── HomePage.tsx                  # 首页（Hero + 学段导航 + 每日一诗 + 知识卡片 + 互动体验）
│   │   ├── WorkListPage.tsx              # 诗文列表（水墨 Banner + 搜索筛选 + 卡片网格）
│   │   ├── WorkDetailPage.tsx            # 诗文详情（7 标签页 + 多维可视化 + 拼图）
│   │   ├── CategoryPage.tsx              # 分类浏览（4 标签：文体/年级/主题/朝代）
│   │   ├── StatsPage.tsx                 # 数据统计（9 统计卡 + 7 图表 + 排行榜 + 行迹图）
│   │   ├── TimelinePage.tsx              # 时空穿越长卷（朝代时间轴 + 意象色彩 + 风格条）
│   │   ├── CalendarPage.tsx              # 诗词日历（365天 + 日历海报）
│   │   └── AboutPage.tsx                 # 关于页（功能介绍 + 内容简介 + 制作者 + 许可证）
│   ├── services/                 # 业务服务
│   │   ├── DataService.ts                # 数据查询与聚合
│   │   ├── GraphService.ts               # 关系网络图数据构建
│   │   ├── GeoService.ts                 # 地理坐标映射
│   │   └── StatsService.ts               # 统计数据计算
│   ├── stores/                   # 状态管理（zustand）
│   │   ├── useWorkStore.ts               # 诗文筛选与分页
│   │   ├── useThemeStore.ts              # 主题状态
│   │   └── useAIStore.ts                 # AI 配置与对话历史
│   ├── types/                    # TypeScript 类型定义
│   │   └── index.ts                      # 全局类型（Work, Author, GraphNode, CategoryEntry 等）
│   ├── lib/                      # 工具库
│   │   ├── utils.ts                      # cn() 等通用工具
│   │   ├── highlight.tsx                 # 搜索高亮工具函数
│   │   ├── imageryColors.ts              # 意象-色彩映射（50+ 意象词）
│   │   └── styleScorer.ts               # 诗词风格评分算法（6 维度）
│   ├── App.tsx                   # 应用入口 + 路由配置
│   ├── main.tsx                  # 渲染入口
│   └── index.css                 # 全局 CSS（1300+ 行：色彩体系 + 20+ 动画 + 15+ 装饰类）
├── dist/                         # 构建输出
├── index.html                    # HTML 入口
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md                     # 本文件
```

---

## 🚀 快速开始

### 环境要求

| 工具 | 最低版本 |
|------|:--------:|
| Node.js | ≥ 18 |
| npm | ≥ 9 |

### 安装与运行

```bash
# 克隆项目
git clone <repo-url>
cd bu_bian_chinese_classics

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### 部署

本项目使用 **GitHub Pages** 部署，采用 Hash Router + `base: './'` 配置。

构建后 `dist/` 目录可直接部署到任意静态文件服务器：

```bash
npm run build
# dist/ 即为可部署的静态文件目录
npx serve dist
```

---

## 📝 开发笔记

### 关键约定

| 约定 | 说明 |
|------|------|
| 模板字符串 | 数据文件中含中文单引号时，需使用反引号包裹 |
| Fuse.js 类型 | `IFuseOptions` 需从 `fuse.js` 独立导入，不可用 `Fuse.IFuseOptions` |
| Hash Router | GitHub Pages 部署必须使用 `HashRouter` + `base: './'` |
| Dynasty 类型 | 只含先秦至清代 9 个值，近现代人物统一用 `'清'` |
| stats 校验 | `charCount`=去标点纯汉字数，`sentenceCount`=sentences 长度，`rhymeCount`=rhymeScheme 长度 |
| GeoService | 城市引用必须使用 `ANCIENT_CITIES` 中实际存在的 key（如"浔阳"而非"九江"） |
| 批量替换风险 | 修改 `original` 字段时容易破坏相邻代码结构，修改后务必 TS 编译检查 |

### 关系网络图节点颜色

| 节点类型 | 亮色 | 暗色 | 含义 |
|----------|------|------|------|
| 作者 | `#2D8F5E` 翠绿 | `#3EC77A` 亮翠绿 | 文人风骨 |
| 作品 | `#C8922A` 琥珀金 | `#E8B84A` 亮琥珀金 | 诗篇华章 |
| 主题 | `#D4A017` 明黄 | `#F0C040` 亮明黄 | 主题意象 |
| 朝代 | `#B22222` 绛红 | `#E04040` 亮绛红 | 朝代更替 |

---

## 🤖 AI 工具使用声明

> **本项目是人工智能辅助开发的实践案例。**

本项目从需求分析、架构设计、代码编写、测试验证到视觉设计的**全流程**，均深度使用了 AI 工具。具体说明如下：

### AI 参与范围

| 阶段 | AI 参与内容 | 使用的 AI 工具 |
|------|------------|---------------|
| 📋 需求分析 | 产品需求文档（PRD）撰写、用户故事梳理 | Claude / GPT |
| 🏗️ 架构设计 | 系统架构方案、文件结构规划、依赖分析、任务分解 | Claude / GPT |
| 💻 代码编写 | 全部 61+ 源文件的代码生成与实现 | Claude / GPT (CodeBuddy) |
| 🧪 测试验证 | 测试用例编写、Bug 定位与修复 | Claude / GPT |
| 🎨 视觉设计 | 18 幅水墨画生成、CSS 动效系统设计 | AI 图像生成 + Claude |
| 📝 文档撰写 | README、代码注释、交付报告 | Claude / GPT |

### AI 生成内容说明

- **代码**：所有源代码均由 AI 生成，经人工审核与调试后确认可用
- **数据**：287 篇诗文的注释、译文、赏析、可视化数据由 AI 生成并经人工校验
- **美术素材**：18 幅水墨装饰画由 AI 图像生成模型创作
- **文学常识卡片**：242 张卡片的题目与内容由 AI 生成
- **水墨名句**：360 条名句的选取与分类由 AI 完成
- **文档**：本 README 及项目内所有文档由 AI 撰写

### 开发方法论

本项目采用了**多智能体协作**（Multi-Agent Collaboration）的开发模式：

1. **产品经理** — 负责需求分析与 PRD 撰写
2. **架构师** — 负责系统设计与任务分解
3. **工程师** — 负责代码实现
4. **QA 工程师** — 负责测试验证

每个角色由独立的 AI Agent 扮演，遵循标准作业程序（SOP），由主理人协调调度。这种方法确保了每个环节的专业性和输出的结构化质量。

### 人工参与

- 项目方向与需求的确定
- 关键设计决策的审核
- AI 输出结果的验证与调试
- 最终交付物的质量把控

---

## 📜 许可证

**Apache License 2.0** — 详见 [LICENSE](https://www.apache.org/licenses/LICENSE-2.0)

诗文原文属于**公共领域**作品。本站的注释、赏析、可视化数据等原创内容在 Apache 2.0 协议下发布。AI 生成的水墨画素材同样遵循 Apache 2.0 协议。

---

<div align="center">

**步编 · 中华经典诗文数字化学习平台**

_以现代技术，致敬千年文脉_

</div>
