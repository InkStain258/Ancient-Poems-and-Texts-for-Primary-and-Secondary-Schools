/**
 * 意象色彩提取 - 根据诗文意象关键词映射到色彩
 *
 * 每个"意象词"对应一个 HSL 色彩和情绪标签
 * 提取函数会扫描原文，匹配意象词并生成配色卡
 */

export interface ImageryColor {
  /** 意象关键词 */
  keyword: string;
  /** HSL 色值 */
  hsl: { h: number; s: number; l: number };
  /** 情绪标签 */
  mood: string;
}

/** 意象-色彩映射表（50+ 意象词） */
export const IMAGERY_COLOR_MAP: ImageryColor[] = [
  // 天象
  { keyword: '月', hsl: { h: 220, s: 15, l: 85 }, mood: '清冷' },
  { keyword: '日', hsl: { h: 40, s: 85, l: 60 }, mood: '温暖' },
  { keyword: '星', hsl: { h: 250, s: 50, l: 75 }, mood: '深邃' },
  { keyword: '云', hsl: { h: 210, s: 10, l: 88 }, mood: '飘逸' },
  { keyword: '天', hsl: { h: 210, s: 40, l: 75 }, mood: '辽阔' },
  { keyword: '霜', hsl: { h: 200, s: 20, l: 90 }, mood: '肃杀' },
  { keyword: '露', hsl: { h: 180, s: 30, l: 82 }, mood: '晶莹' },
  { keyword: '雪', hsl: { h: 205, s: 25, l: 92 }, mood: '洁白' },
  { keyword: '雨', hsl: { h: 210, s: 30, l: 70 }, mood: '缠绵' },
  { keyword: '雷', hsl: { h: 270, s: 40, l: 50 }, mood: '威严' },

  // 植物
  { keyword: '花', hsl: { h: 340, s: 65, l: 72 }, mood: '绚烂' },
  { keyword: '梅', hsl: { h: 350, s: 70, l: 60 }, mood: '坚毅' },
  { keyword: '兰', hsl: { h: 160, s: 35, l: 70 }, mood: '幽雅' },
  { keyword: '竹', hsl: { h: 130, s: 40, l: 45 }, mood: '刚直' },
  { keyword: '菊', hsl: { h: 45, s: 75, l: 60 }, mood: '淡泊' },
  { keyword: '柳', hsl: { h: 100, s: 45, l: 60 }, mood: '离别' },
  { keyword: '松', hsl: { h: 140, s: 35, l: 35 }, mood: '苍劲' },
  { keyword: '枫', hsl: { h: 15, s: 75, l: 50 }, mood: '热烈' },
  { keyword: '桃', hsl: { h: 350, s: 70, l: 72 }, mood: '春意' },
  { keyword: '莲', hsl: { h: 320, s: 40, l: 78 }, mood: '高洁' },
  { keyword: '荷', hsl: { h: 155, s: 40, l: 65 }, mood: '清雅' },
  { keyword: '草', hsl: { h: 110, s: 40, l: 55 }, mood: '生机' },
  { keyword: '叶', hsl: { h: 95, s: 35, l: 50 }, mood: '萧瑟' },

  // 山水
  { keyword: '山', hsl: { h: 150, s: 25, l: 40 }, mood: '巍峨' },
  { keyword: '水', hsl: { h: 205, s: 55, l: 60 }, mood: '灵动' },
  { keyword: '江', hsl: { h: 210, s: 50, l: 55 }, mood: '壮阔' },
  { keyword: '河', hsl: { h: 200, s: 45, l: 50 }, mood: '奔腾' },
  { keyword: '湖', hsl: { h: 195, s: 50, l: 65 }, mood: '宁静' },
  { keyword: '海', hsl: { h: 215, s: 60, l: 50 }, mood: '浩渺' },
  { keyword: '溪', hsl: { h: 185, s: 45, l: 65 }, mood: '幽静' },
  { keyword: '泉', hsl: { h: 190, s: 40, l: 70 }, mood: '清澈' },
  { keyword: '川', hsl: { h: 205, s: 45, l: 55 }, mood: '奔流' },
  { keyword: '峰', hsl: { h: 155, s: 30, l: 45 }, mood: '险峻' },

  // 飞禽走兽
  { keyword: '雁', hsl: { h: 30, s: 35, l: 55 }, mood: '思归' },
  { keyword: '鹤', hsl: { h: 45, s: 20, l: 85 }, mood: '仙逸' },
  { keyword: '鹰', hsl: { h: 25, s: 50, l: 40 }, mood: '凌厉' },
  { keyword: '鸟', hsl: { h: 50, s: 40, l: 65 }, mood: '自由' },
  { keyword: '马', hsl: { h: 20, s: 40, l: 45 }, mood: '驰骋' },
  { keyword: '龙', hsl: { h: 260, s: 55, l: 45 }, mood: '威严' },
  { keyword: '鱼', hsl: { h: 195, s: 45, l: 60 }, mood: '自在' },

  // 器物
  { keyword: '剑', hsl: { h: 215, s: 40, l: 50 }, mood: '锋芒' },
  { keyword: '琴', hsl: { h: 30, s: 50, l: 55 }, mood: '雅韵' },
  { keyword: '酒', hsl: { h: 35, s: 70, l: 55 }, mood: '豪情' },
  { keyword: '笛', hsl: { h: 25, s: 40, l: 60 }, mood: '悠远' },
  { keyword: '灯', hsl: { h: 40, s: 80, l: 60 }, mood: '温暖' },
  { keyword: '镜', hsl: { h: 200, s: 20, l: 80 }, mood: '自省' },
  { keyword: '舟', hsl: { h: 25, s: 35, l: 55 }, mood: '漂泊' },
  { keyword: '楼', hsl: { h: 30, s: 25, l: 50 }, mood: '登临' },

  // 季节
  { keyword: '春', hsl: { h: 120, s: 50, l: 60 }, mood: '生机' },
  { keyword: '夏', hsl: { h: 40, s: 70, l: 55 }, mood: '热烈' },
  { keyword: '秋', hsl: { h: 30, s: 65, l: 55 }, mood: '萧瑟' },
  { keyword: '冬', hsl: { h: 210, s: 20, l: 75 }, mood: '寂静' },

  // 情感
  { keyword: '泪', hsl: { h: 210, s: 50, l: 70 }, mood: '悲伤' },
  { keyword: '愁', hsl: { h: 230, s: 30, l: 55 }, mood: '忧郁' },
  { keyword: '梦', hsl: { h: 280, s: 40, l: 70 }, mood: '迷离' },
  { keyword: '恨', hsl: { h: 0, s: 60, l: 45 }, mood: '愤慨' },
  { keyword: '喜', hsl: { h: 45, s: 80, l: 60 }, mood: '欢愉' },
  { keyword: '思', hsl: { h: 240, s: 25, l: 60 }, mood: '思念' },

  // 其他
  { keyword: '烟', hsl: { h: 200, s: 10, l: 78 }, mood: '朦胧' },
  { keyword: '尘', hsl: { h: 30, s: 25, l: 65 }, mood: '沧桑' },
  { keyword: '血', hsl: { h: 0, s: 70, l: 40 }, mood: '壮烈' },
  { keyword: '玉', hsl: { h: 165, s: 25, l: 78 }, mood: '温润' },
  { keyword: '金', hsl: { h: 45, s: 80, l: 55 }, mood: '辉煌' },
  { keyword: '夜', hsl: { h: 240, s: 35, l: 25 }, mood: '沉静' },
  { keyword: '风', hsl: { h: 195, s: 25, l: 70 }, mood: '流转' },
];

/** 从文本中提取意象色彩 */
export function extractImageryColors(text: string): ImageryColor[] {
  const found: ImageryColor[] = [];
  const seen = new Set<string>();

  for (const item of IMAGERY_COLOR_MAP) {
    if (text.includes(item.keyword) && !seen.has(item.keyword)) {
      found.push(item);
      seen.add(item.keyword);
    }
  }

  return found;
}

/** 将 HSL 转为 CSS 字符串 */
export function hslToString(hsl: { h: number; s: number; l: number }, alpha = 1): string {
  return `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%${alpha < 1 ? ` / ${alpha}` : ''})`;
}

/** 生成意象调色板的渐变 CSS */
export function imageryGradient(colors: ImageryColor[]): string {
  if (colors.length === 0) return 'linear-gradient(135deg, hsl(30 10% 85%), hsl(24 80% 55%))';
  if (colors.length === 1) {
    const c = colors[0].hsl;
    return `linear-gradient(135deg, hsl(${c.h} ${c.s}% ${c.l + 15}%), hsl(${c.h} ${c.s}% ${c.l}%))`;
  }
  const stops = colors.slice(0, 5).map((c, i) => {
    const pct = Math.round((i / Math.max(colors.slice(0, 5).length - 1, 1)) * 100);
    return `hsl(${c.hsl.h} ${c.hsl.s}% ${c.hsl.l}%) ${pct}%`;
  });
  return `linear-gradient(135deg, ${stops.join(', ')})`;
}
