# 部编版语文古诗文文化网站 v1.2.0 发行说明

> **发布日期**：2026-05-27
> **项目名称**：bu-bian-chinese（部编古诗文）
> **协议**：Apache License 2.0

---

## 更新概要

v1.2.0 是一次全面的功能扩展更新，新增 **6 大功能模块**：每日一诗 Canvas 海报分享、全文搜索高亮、时空穿越长卷、诗词日历、意象色彩提取、诗词风格雷达图。从社交分享、搜索体验、宏观纵览、时间维度、视觉感知、风格量化六个维度，将古诗文的文化体验推向新的深度。全部 287 篇作品无死角覆盖，真正做到「要做就每一篇都要做」。

---

## 🆕 新功能

### 🖼️ 每日一诗分享海报

首页每日一诗卡片新增「分享海报」按钮，一键生成古风宣纸风格精美海报：

**Canvas 绘制引擎**
- 540×960 竖版海报，宣纸色渐变底色
- 随机水墨纹理装饰（墨点 splash 算法，8 顶点不规则多边形）
- 双层装饰线框（外框 + 内框），古典对称美
- 诗文排版自适应：标题过长自动缩小字号，正文根据句数动态选择字号（15/17/20px）
- 首条注释自动换行展示，推荐语截断保护

**多端分享策略**
- 优先调用 Web Share API（支持文件分享的浏览器直接弹出系统分享面板）
- 降级：剪贴板复制（`ClipboardItem` + `navigator.clipboard.write`）
- 最终降级：自动触发 PNG 下载
- 下载文件名：`每日一诗_诗题.png`

### 🔍 全文搜索高亮

搜索体验从「找到」升级为「一眼看到」：

**`highlightText()` — 关键词高亮渲染**
- 大小写不敏感匹配，关键词用 `<mark className="search-highlight">` 包裹
- 支持多次出现全部高亮
- 应用于 WorkCard 的标题、作者/朝代、摘要三处

**`getContextSnippets()` — 上下文片段提取**
- 提取包含关键词的文本片段，前后各保留 8 字符上下文
- 最多返回 2 条不重复片段，超出部分用 `...` 省略

**`smartTruncate()` — 智能截断**
- 以关键词为中心，前后各取 `maxLen/2` 字符
- 替代传统的固定头部截断，确保关键词始终可见

**CSS 样式**
- `.search-highlight` 亮色模式：金色半透明底色
- `.search-highlight` 暗色模式：主题色半透明底色
- 圆角 2px，内边距 1px 3px，不中断文字流

### 📜 时空穿越长卷

横向可滚动的朝代时间轴，穿越千年文脉：

**9 朝代时间轴**
- 先秦 → 汉 → 魏晋南北朝 → 唐 → 宋 → 元 → 明 → 清 → 近现代
- 每个朝代节点含时期、简介、文学流派标签（共 30+ 流派）
- 朝代专属主题色 + 图标标识（甲骨/竹简/竹林/牡丹/青瓷/戏台/城墙/园林/灯塔）
- CSS scroll-snap 横向滚动，支持左右箭头导航

**作品网格**
- 每个朝代展开代表性作品卡片网格
- 卡片内嵌意象色彩紧凑条（4 色）+ 风格评分迷你条
- 点击跳转作品详情页

**文学流派标签**
- 唐：初唐四杰 / 盛唐气象 / 中唐新乐府 / 晚唐婉约
- 宋：豪放词 / 婉约词 / 江西诗派 / 理学诗
- 清：浙西词派 / 常州词派 / 桐城派 / 性灵派
- 等等，全部 9 朝代 × 3-4 流派

### 📅 诗词日历

365 天每天一首，时间与诗的对话：

**日历视图**
- 12 月份网格布局，传统月历风格
- 年/月导航，前后翻页
- 当日高亮，点击任意日期查看对应诗文

**日期种子选取算法**
- `dayOfYear × 7 + 13) % 287`，确定性哈希
- 同一天所有用户看到同一首诗
- 全年 365 天无重复（循环覆盖 287 篇）

**日历海报分享**
- 选中日期可生成日历风格 Canvas 海报
- 含日期、诗文、作者、朝代完整信息
- 同样支持 Web Share API / 剪贴板 / 下载三级降级

**年度速览**
- 12 月份月历缩略，快速跳转任意月份

### 🎨 意象色彩提取

根据诗文意象自动生成主题配色卡，287 篇全覆盖：

**意象词库**
- 50+ 意象关键词，分 5 大类：
  - 天象：月(银白)、日(暖金)、星(深紫)、云(飘逸灰)、霜(肃杀白)、雪(洁白)、雨(缠绵灰)…
  - 植物：梅(赤红坚毅)、兰(幽雅绿)、竹(刚直深绿)、菊(淡泊金)、柳(离别青)、枫(赤红热烈)、荷(清雅碧)…
  - 山水：山(巍峨墨绿)、水(灵动蓝)、江(壮阔深蓝)、湖(宁静青)…
  - 飞禽走兽：雁(思归褐)、鹤(仙逸象牙)…
  - 人文意象：酒(琥珀)、剑(铁青)、楼(朱红)…

**色彩映射**
- 每个意象词 → HSL 色值 + 情绪标签
- 自动扫描诗文原文，匹配意象词生成配色卡
- 渐变色带：多意象色自动混合生成连续渐变

**展示形式**
- 完整模式（作品详情页）：渐变色带 + 色彩网格 + 意象词标签 + 情绪标签
- 紧凑模式（长卷页）：4 色缩略条 + 迷你渐变

### 🕸️ 诗词风格雷达图

用 ECharts 雷达图量化每首诗的多维风格特征，287 篇全覆盖：

**6 维评分体系**

| 维度 | 标签 | 颜色 | 说明 |
|------|------|------|------|
| 写景 | 写景描摹 | 🟢 `#4ade80` | 自然景物刻画程度 |
| 抒情 | 抒情达意 | 🩷 `#f472b6` | 情感表达强度 |
| 叙事 | 叙事铺陈 | 🔵 `#60a5fa` | 事件叙述比重 |
| 哲理 | 哲思理趣 | 🟣 `#a78bfa` | 思想深度与感悟 |
| 豪放 | 豪迈奔放 | 🟠 `#f97316` | 气势磅礴程度 |
| 婉约 | 婉约含蓄 | 🩵 `#67e8f9` | 含蓄柔美程度 |

**多源评分算法**
- 4 级权重叠加：themes 贡献 → subGenre 贡献 → visualization 贡献 → 文本关键词匹配
- 16 种主题 × 9 种子体裁 × 4 种可视化类型 × 30+ 文本特征词
- 基础分 5（确保零值不出现）→ 归一化到 0-100
- `Map` 缓存避免重复计算

**对比功能**
- 作品详情页可选择任意作品进行同屏雷达对比
- 双色区域叠加，直观展现风格差异
- StyleTag 组件显示主导风格标签

---

## 🐛 Bug 修复

| 问题 | 原因 | 修复方式 |
|------|------|----------|
| 海报弹窗与文学常识模块 UI 重叠 | PoemPosterModal 渲染在 `Card(overflow-hidden)` 内部，父级 `transform` + `overflow: hidden` 创建新的层叠上下文，导致 `position: fixed` + z-index 失效 | 使用 `createPortal(modal, document.body)` 将弹窗挂载到 body，z-index 99999 |

---

## 📁 新增/变更文件

| 文件 | 状态 | 说明 |
|------|------|------|
| `src/components/common/PoemPoster.tsx` | 🆕 新增 | 海报弹窗 + 分享按钮组件 |
| `src/lib/highlight.tsx` | 🆕 新增 | 搜索高亮工具函数（highlightText / getContextSnippets / smartTruncate） |
| `src/pages/TimelinePage.tsx` | 🆕 新增 | 时空穿越长卷页面 |
| `src/pages/CalendarPage.tsx` | 🆕 新增 | 诗词日历页面 |
| `src/lib/imageryColors.ts` | 🆕 新增 | 意象色彩映射表 + 提取函数 |
| `src/lib/styleScorer.ts` | 🆕 新增 | 风格评分算法 + 缓存 + 辅助函数 |
| `src/components/common/ImageryPalette.tsx` | 🆕 新增 | 意象色彩提取组件（完整/紧凑模式） |
| `src/components/common/StyleRadar.tsx` | 🆕 新增 | 风格雷达图组件 + StyleTag 标签组件 |
| `src/pages/HomePage.tsx` | ✏️ 修改 | 引入 PosterShareButton，接入每日一诗分享入口 |
| `src/components/common/WorkCard.tsx` | ✏️ 修改 | 新增 keyword prop，标题/作者/摘要支持高亮渲染 |
| `src/pages/WorkListPage.tsx` | ✏️ 修改 | 传递搜索关键词到 WorkCard |
| `src/pages/WorkDetailPage.tsx` | ✏️ 修改 | 新增「意象色彩」和「风格雷达」Tab + StyleRadarSection 对比组件 |
| `src/App.tsx` | ✏️ 修改 | lazy 加载 TimelinePage/CalendarPage，新增路由 |
| `src/components/layout/Header.tsx` | ✏️ 修改 | 新增「长卷」「日历」导航项 |
| `src/components/layout/MobileNav.tsx` | ✏️ 修改 | 5 项导航：首页/诗文/长卷/日历/关于 |
| `src/index.css` | ✏️ 修改 | 新增 `.search-highlight` 样式 |

---

## 🏗️ 技术细节

### 代码分割

TimelinePage 和 CalendarPage 使用 `React.lazy()` + `Suspense` 懒加载，避免增大首屏 bundle：

```tsx
const TimelinePage = lazy(() => import('./pages/TimelinePage'));
const CalendarPage = lazy(() => import('./pages/CalendarPage'));
```

### 风格评分算法流程

```
ClassicalWork 输入
  ├─ 1. themes[] → THEME_SCORES (16 主题映射)
  ├─ 2. genre.subGenre → SUBGENRE_SCORES (9 子体裁映射)
  ├─ 3. visualization.type → VIZ_SCORES (4 可视化类型映射)
  ├─ 4. text.original → TEXT_KEYWORD_SCORES (30+ 关键词扫描)
  ├─ 5. 基础分 +5（防零值）
  └─ 6. 归一化 → clamp(0, 100) → StyleScores
         ↓
     Map<workId, StyleScores> 缓存
```

### 意象色彩提取流程

```
诗文原文
  ↓ extractImageryColors()
  遍历 50+ IMAGERY_COLOR_MAP，检查 keyword 是否出现在原文中
  ↓
  匹配的意象 → ImageryColor[] (keyword + hsl + mood)
  ↓
  imageryGradient() → 多色渐变 CSS 字符串
  ↓
  ImageryPalette 组件渲染（渐变带 + 色块 + 标签）
```

### Canvas 海报绘制流程

```
用户点击分享 → open=true → useEffect 延迟 50ms → drawPoster()
  ↓
创建 540×960 Canvas → 渐变底色 → 水墨纹理 → 装饰线框
  ↓
顶部署名 → 标题（自适应字号） → 作者/朝代 → 分隔线
  ↓
正文排版（句数→字号映射，最多 12 句） → 首条注释（自动换行）
  ↓
推荐语 → 底部分隔线 → Logo 水印
  ↓
canvas.toDataURL('image/png') → setPreviewUrl → 预览图渲染
```

### 搜索高亮架构

```
WorkListPage (keyword state)
  └─→ <WorkCard work={work} keyword={keyword} />
        ├─ title: highlightText(work.title, keyword)
        ├─ author: highlightText(`${dynasty} · ${author}`, keyword)
        └─ summary: highlightText(displayText, keyword)
```

---

## 📊 数据变更

| 指标 | v1.1.0 | v1.2.0 | 变化 |
|------|--------|--------|------|
| 诗文篇目 | 287 | 287 | — |
| 注释条目 | 4,270 | 4,270 | — |
| 意象色彩覆盖 | 无 | 287 篇全覆盖 | 🆕 |
| 风格评分覆盖 | 无 | 287 篇全覆盖（6 维） | 🆕 |
| 朝代时间轴 | 无 | 9 朝代 + 30+ 流派 | 🆕 |
| 诗词日历 | 无 | 365 天 + 日历海报 | 🆕 |
| 搜索高亮 | 无 | 标题+作者+摘要全覆盖 | 🆕 |
| 海报分享 | 无 | 每日一诗 + 日历海报 | 🆕 |
| 新增页面 | — | TimelinePage / CalendarPage | +2 |
| 新增组件 | — | PoemPoster / ImageryPalette / StyleRadar / StyleTag | +4 |
| 新增工具库 | — | highlight / imageryColors / styleScorer | +3 |
| 导航结构 | 4 项 | 5 项（+长卷 +日历） | ✏️ |

---

## 构建产物

| 文件 | 说明 | 大小 |
|------|------|------|
| `dist.zip` | 部署包（可直接部署到静态服务器） | ~1.8 MB |
| `src.zip` | 源码包（含全部源码+配置+README，需构建） | ~652 KB |

---

## 部署方式

### 方式一：直接部署（dist 包）
1. 下载 `dist.zip`
2. 解压到 Web 服务器根目录
3. 访问 `index.html` 即可

> 已适配 GitHub Pages（Hash Router + `base: './'`），可直接推送到 `gh-pages` 分支。

### 方式二：源码构建（source 包）
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 生产构建
npm run build

# 输出到 dist/ 目录
```

### 方式三：GitHub Pages（Actions 自动部署）
1. 将 dist 内容推送到 main 分支
2. 在仓库 Settings → Pages 中选择 Source: GitHub Actions
3. `.github/workflows/static.yml` 会自动部署

---

## 升级指南（v1.1.0 → v1.2.0）

1. **无破坏性变更**：v1.2.0 纯增量的新功能，不影响任何已有功能
2. **搜索体验自动生效**：在诗文列表页搜索时，匹配关键词自动高亮
3. **海报分享**：首页每日一诗卡片旁新增分享按钮，无需额外配置
4. **长卷与日历**：Header 和 MobileNav 已新增导航入口，开箱即用
5. **意象色彩与风格雷达**：作品详情页自动新增 Tab，287 篇全覆盖
6. **localStorage 兼容**：zustand persist 自动处理，旧数据不受影响

---

## AI 声明

本项目的部分内容（包括但不限于注释、赏析、可视化数据、水墨画装饰图、意象色彩映射、风格评分算法等）由 AI 辅助生成，仅供学习参考。诗文原文属于公共领域作品。

## 致谢

- 数据来源：部编版（统编版）语文教材
- 中国地理数据：DataV.GeoAtlas
- MCP 协议：Model Context Protocol
- supergateway：supercorp-ai
- ECharts：Apache开源可视化库
- 所有为中华文化传承默默付出的教育工作者

---

*"读万卷书，行万里路。"*
