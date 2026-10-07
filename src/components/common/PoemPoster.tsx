import { useRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Share2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ClassicalWork } from '@/types';
import { useThemeStore } from '@/stores/useThemeStore';

interface PoemPosterModalProps {
  work: ClassicalWork;
  reason: string;
  open: boolean;
  onClose: () => void;
}

const W = 540;
/** 正文最大行数：超出则截断并在页脚提示完整版 */
const BODY_MAX_LINES = 26;

/**
 * 逐字换行（中文排版）：
 * - 收尾标点悬挂到当前行行尾，避免下一行行首出现标点
 * - 超过 maxLines 返回 truncated 标记
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): { lines: string[]; truncated: boolean } {
  const lines: string[] = [];
  let line = '';
  const closing = '，。、；：？！）》」』"…';
  for (const ch of text) {
    if (ctx.measureText(line + ch).width > maxWidth && line) {
      if (closing.includes(ch)) {
        // 标点悬挂：允许略微超出行宽，保持行首无标点
        line += ch;
        continue;
      }
      lines.push(line);
      line = ch;
      if (lines.length >= maxLines) {
        return { lines, truncated: true };
      }
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  return { lines: lines.slice(0, maxLines), truncated: lines.length > maxLines };
}

/** 圆角矩形路径 */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** 排版结果：一次测量，多处绘制，保证两遍一致 */
interface PosterLayout {
  H: number;
  bodyFontSize: number;
  bodyLineHeight: number;
  bodyLines: string[];
  bodyTruncated: boolean;
  sentenceCount: number;
  noteBlocks: string[][];
  reasonLines: string[];
}

/**
 * 每日一诗海报分享弹窗
 *
 * v1.3 重构：
 * - 画布高度随内容动态计算，长文（数百句）不再溢出或重叠
 * - 正文逐字换行 + 行首避标点，超长句安全折行
 * - 深色「墨夜极光」/ 亮色「宣纸雅致」双主题，跟随站点主题
 * - 绘制全程 try/catch，异常时给出重试入口而非静默失败
 */
export default function PoemPosterModal({ work, reason, open, onClose }: PoemPosterModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const { effectiveTheme } = useThemeStore();
  const isDark = effectiveTheme === 'dark';

  const drawPoster = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGenerating(true);
    setError(false);
    try {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setGenerating(false);
        return;
      }

      const FONT = '"Noto Serif SC", "STSong", "SimSun", serif';

      /* ═══════════ 第一遍：测量排版 ═══════════ */
      canvas.width = W;
      canvas.height = 960; // 临时高度，仅供测量

      const sentences =
        work.text.sentences.length > 0 ? work.text.sentences : [work.text.original];
      const totalChars = sentences.join('').length;
      // 字号随篇幅自适应：短诗疏朗、长文紧凑
      const bodyFontSize = totalChars > 700 ? 15 : totalChars > 350 ? 17 : totalChars > 140 ? 19 : 21;
      const bodyLineHeight = Math.round(bodyFontSize * 1.85);
      const bodyMaxWidth = W - 110;
      const bodyStartY = 248;

      ctx.font = `${bodyFontSize}px ${FONT}`;
      // 全文换行（受最大行数约束）
      const allBodyLines: string[] = [];
      let bodyTruncated = false;
      for (const s of sentences) {
        const r = wrapText(ctx, s, bodyMaxWidth, BODY_MAX_LINES - allBodyLines.length);
        allBodyLines.push(...r.lines);
        if (r.truncated) {
          bodyTruncated = true;
          break;
        }
      }
      const bodyLines = allBodyLines.slice(0, BODY_MAX_LINES);

      // 注释：最多 2 条，各最多 2 行
      const noteBlocks: string[][] = [];
      if (!bodyTruncated) {
        ctx.font = `12px ${FONT}`;
        for (const a of work.annotations.slice(0, 2)) {
          const t = `「${a.term}」${a.note}`;
          const r = wrapText(ctx, t, W - 120, 2);
          noteBlocks.push(r.lines);
        }
      }

      // 推荐语：最多 2 行
      ctx.font = `italic 13px ${FONT}`;
      const reasonLines = reason ? wrapText(ctx, reason, W - 140, 2).lines : [];

      // 高度合成：正文 + 注释 + 推荐语 + 页脚，最小 960
      const bodyEndY = bodyStartY + bodyLines.length * bodyLineHeight;
      let cursorY = bodyEndY;
      const noteLinesTotal = noteBlocks.reduce((s, b) => s + b.length, 0);
      if (noteBlocks.length) cursorY += 26 + noteLinesTotal * 17 + 8;
      if (reasonLines.length) cursorY += 30 + reasonLines.length * 20;
      const H = Math.max(960, cursorY + 128);

      /* ═══════════ 第二遍：正式绘制 ═══════════ */
      canvas.height = H;

      // 背景
      const bg = ctx.createLinearGradient(0, 0, W, H);
      if (isDark) {
        bg.addColorStop(0, '#0a0d16');
        bg.addColorStop(0.55, '#101828');
        bg.addColorStop(1, '#0c1220');
      } else {
        bg.addColorStop(0, '#fdf8ee');
        bg.addColorStop(0.5, '#fefbf4');
        bg.addColorStop(1, '#f4ead2');
      }
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // 极光色斑
      const orb = (x: number, y: number, r: number, color: string, alpha: number) => {
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, color);
        g.addColorStop(1, 'transparent');
        ctx.globalAlpha = alpha;
        ctx.fillStyle = g;
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
        ctx.globalAlpha = 1;
      };
      if (isDark) {
        orb(70, 150, 230, '#22d3ee', 0.1);
        orb(W - 40, H * 0.42, 260, '#a78bfa', 0.09);
        orb(W / 2, H - 170, 240, '#fb923c', 0.07);
      } else {
        orb(70, 150, 210, '#fbbf24', 0.07);
        orb(W - 40, H * 0.4, 230, '#c4b5fd', 0.05);
      }
      // 亮色：淡墨点纹理
      if (!isDark) {
        const drawInkSplash = (x: number, y: number, r: number, alpha: number) => {
          ctx.beginPath();
          for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8 + Math.random() * 0.5;
            const r2 = r * (0.6 + Math.random() * 0.6);
            const px = x + Math.cos(angle) * r2;
            const py = y + Math.sin(angle) * r2;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = `rgba(60, 56, 54, ${alpha})`;
          ctx.fill();
        };
        drawInkSplash(80, 130, 90, 0.035);
        drawInkSplash(W - 60, H - 200, 70, 0.03);
      }

      // 边框
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.28)' : 'rgba(180,160,120,0.5)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(18, 18, W - 36, H - 36);
      ctx.strokeStyle = isDark ? 'rgba(148,163,184,0.12)' : 'rgba(180,160,120,0.25)';
      ctx.strokeRect(26, 26, W - 52, H - 52);

      // 极光分隔线
      const auroraLine = (y: number, halfWidth: number, alpha = 1) => {
        const g = ctx.createLinearGradient(W / 2 - halfWidth, 0, W / 2 + halfWidth, 0);
        if (isDark) {
          g.addColorStop(0, 'transparent');
          g.addColorStop(0.45, `rgba(251,146,60,${0.6 * alpha})`);
          g.addColorStop(0.72, `rgba(167,139,250,${0.5 * alpha})`);
          g.addColorStop(1, 'transparent');
        } else {
          g.addColorStop(0, 'transparent');
          g.addColorStop(0.5, `rgba(180,120,40,${0.55 * alpha})`);
          g.addColorStop(1, 'transparent');
        }
        ctx.strokeStyle = g;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(W / 2 - halfWidth, y);
        ctx.lineTo(W / 2 + halfWidth, y);
        ctx.stroke();
      };

      // 顶部署名
      ctx.fillStyle = isDark ? '#a8a29e' : '#8b7355';
      ctx.font = `14px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText('— 部编古诗文 —', W / 2, 62);
      auroraLine(78, 90, 0.8);

      // 诗题（自适应缩号）
      ctx.fillStyle = isDark ? '#f5f0e8' : '#2c2420';
      let titleSize = 34;
      ctx.font = `bold ${titleSize}px ${FONT}`;
      while (ctx.measureText(work.title).width > W - 100 && titleSize > 18) {
        titleSize -= 1;
        ctx.font = `bold ${titleSize}px ${FONT}`;
      }
      ctx.fillText(work.title, W / 2, 150);

      // 作者 / 朝代
      ctx.fillStyle = isDark ? '#fbbf24' : '#7a6a52';
      ctx.font = `16px ${FONT}`;
      ctx.fillText(`${work.dynasty} · ${work.author}`, W / 2, 188);
      auroraLine(210, 110, 0.7);

      // 诗文正文
      ctx.fillStyle = isDark ? '#d6d3d1' : '#3a3228';
      ctx.font = `${bodyFontSize}px ${FONT}`;
      ctx.textAlign = 'center';
      bodyLines.forEach((line, i) => {
        ctx.fillText(line, W / 2, bodyStartY + i * bodyLineHeight);
      });

      // 注释
      let ny = bodyEndY + 26;
      ctx.textAlign = 'left';
      ctx.font = `12px ${FONT}`;
      for (const lines of noteBlocks) {
        ctx.fillStyle = isDark ? '#8f8a81' : '#8b7355';
        lines.forEach((l, i) => ctx.fillText(l, 60, ny + i * 17));
        ny += lines.length * 17 + 8;
      }

      // 推荐语
      if (reasonLines.length) {
        ctx.fillStyle = isDark ? '#e7c98a' : '#a08060';
        ctx.font = `italic 13px ${FONT}`;
        ctx.textAlign = 'center';
        reasonLines.forEach((l, i) => ctx.fillText(l, W / 2, ny + 30 + i * 20));
      }

      // 底部分隔 + 品牌
      const footerY = H - 96;
      auroraLine(footerY - 14, 150, 0.55);
      ctx.fillStyle = isDark ? '#78716c' : '#b8a888';
      ctx.font = `12px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText('部编古诗文  |  每日一诗', W / 2, footerY + 14);

      // 印章
      ctx.save();
      ctx.translate(W - 76, footerY - 34);
      ctx.rotate(-0.12);
      ctx.strokeStyle = isDark ? 'rgba(248,113,113,0.85)' : 'rgba(220,38,38,0.8)';
      ctx.lineWidth = 2;
      roundRectPath(ctx, -19, -19, 38, 38, 5);
      ctx.stroke();
      ctx.fillStyle = isDark ? 'rgba(248,113,113,0.92)' : 'rgba(220,38,38,0.85)';
      ctx.font = `bold 19px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('诗', 0, 1);
      ctx.restore();
      ctx.textBaseline = 'alphabetic';

      // 页脚提示（长文截断时提示完整版）
      ctx.fillStyle = isDark ? '#57534e' : '#c8b898';
      ctx.font = '10px sans-serif';
      if (bodyTruncated) {
        ctx.fillText(
          `全文共 ${sentences.length} 句，完整版请访问网站阅读`,
          W / 2,
          footerY + 40,
        );
      } else {
        ctx.fillText('扫码或访问仓库阅读全文', W / 2, footerY + 40);
      }

      const dataUrl = canvas.toDataURL('image/png');
      setPreviewUrl(dataUrl);
      setGenerating(false);
    } catch {
      // 绘制异常：给出可见的失败状态，而非静默报错
      setPreviewUrl(null);
      setError(true);
      setGenerating(false);
    }
  }, [work, reason, isDark]);

  // 打开时绘制
  useEffect(() => {
    if (open) {
      const timer = setTimeout(drawPoster, 50);
      return () => clearTimeout(timer);
    }
    setPreviewUrl(null);
    setError(false);
  }, [open, drawPoster]);

  // 下载海报
  const handleDownload = useCallback(() => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `每日一诗_${work.title.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [previewUrl, work.title]);

  // 分享（Web Share API / 剪贴板 / 下载三级降级）
  const handleShare = useCallback(async () => {
    if (!previewUrl) return;
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      const file = new File([blob], `每日一诗_${work.title}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `每日一诗 · ${work.title}`, text: reason });
        return;
      }
    } catch {
      /* 降级 */
    }
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      alert('海报已复制到剪贴板，可粘贴分享！');
    } catch {
      handleDownload();
    }
  }, [previewUrl, work.title, reason, handleDownload]);

  if (!open) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-zinc-900 rounded-xl shadow-2xl max-h-[92vh] overflow-y-auto w-[380px] max-w-[95vw] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
          <h3 className="font-semibold text-lg poem-title flex items-center gap-1.5">
            <Share2 className="h-4 w-4 text-primary" />
            分享海报
          </h3>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-accent transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Canvas（隐藏，仅用于绘制） */}
        <canvas ref={canvasRef} className="hidden" />

        {/* 预览区 */}
        <div className="px-4 py-4 flex justify-center">
          {generating && (
            <div className="flex flex-col items-center gap-3 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">正在生成海报...</span>
            </div>
          )}
          {error && !generating && (
            <div className="flex flex-col items-center gap-3 py-12">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <span className="text-sm text-muted-foreground">海报生成失败，请重试</span>
              <Button size="sm" variant="outline" onClick={drawPoster}>
                重新生成
              </Button>
            </div>
          )}
          {!generating && !error && previewUrl && (
            <img
              src={previewUrl}
              alt="诗歌海报预览"
              className="rounded-lg shadow-md max-w-full h-auto"
              style={{ maxHeight: '65vh' }}
            />
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-3 px-4 py-3 border-t border-border/30">
          <Button variant="outline" className="flex-1 gap-1.5" onClick={handleDownload}>
            <Download className="h-4 w-4" />
            保存图片
          </Button>
          <Button className="flex-1 gap-1.5" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            分享
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

/** 触发海报分享的按钮（用于每日一诗卡片） */
export function PosterShareButton({ work, reason }: { work: ClassicalWork; reason: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs text-muted-foreground hover:text-primary"
        onClick={() => setOpen(true)}
      >
        <Share2 className="h-3.5 w-3.5" />
        分享海报
      </Button>
      <PoemPosterModal work={work} reason={reason} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
