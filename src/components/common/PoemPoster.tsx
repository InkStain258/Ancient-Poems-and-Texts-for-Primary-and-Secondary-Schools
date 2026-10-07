import { useRef, useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Share2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ClassicalWork } from '@/types';
import { cn } from '@/lib/utils';

interface PoemPosterModalProps {
  work: ClassicalWork;
  reason: string;
  open: boolean;
  onClose: () => void;
}

/**
 * 每日一诗海报分享弹窗
 * 使用 Canvas 绘制精美海报，支持下载 PNG
 */
export default function PoemPosterModal({ work, reason, open, onClose }: PoemPosterModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // 绘制海报
  const drawPoster = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setGenerating(true);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 540;
    const H = 960;
    canvas.width = W;
    canvas.height = H;

    // ─── 背景：渐变宣纸色 ───
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#fdf6e3');
    bgGrad.addColorStop(0.5, '#fef9ef');
    bgGrad.addColorStop(1, '#f5ecd7');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // ─── 水墨纹理装饰（随机墨点）──
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
    drawInkSplash(80, 120, 90, 0.04);
    drawInkSplash(W - 60, H - 180, 70, 0.03);
    drawInkSplash(W / 2, 80, 50, 0.025);

    // ─── 装饰线框 ───
    ctx.strokeStyle = 'rgba(180, 160, 120, 0.5)';
    ctx.lineWidth = 1.5;
    // 外框
    ctx.strokeRect(20, 20, W - 40, H - 40);
    // 内框
    ctx.strokeStyle = 'rgba(180, 160, 120, 0.25)';
    ctx.strokeRect(32, 32, W - 64, H - 64);

    // ─── 顶部署名 ───
    ctx.fillStyle = '#8b7355';
    ctx.font = '14px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.fillText('— 部编古诗文 —', W / 2, 62);

    // ─── 分隔线（上方）──
    ctx.strokeStyle = 'rgba(180, 160, 120, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 80, 76);
    ctx.lineTo(W / 2 + 80, 76);
    ctx.stroke();

    // ─── 诗题 ───
    ctx.fillStyle = '#2c2420';
    ctx.font = 'bold 32px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = 'center';
    // 自动缩小过长标题
    const titleText = work.title;
    let titleSize = 32;
    while (ctx.measureText(titleText).width > W - 100 && titleSize > 18) {
      titleSize -= 1;
      ctx.font = `bold ${titleSize}px "Noto Serif SC", "SimSun", serif`;
    }
    ctx.fillText(titleText, W / 2, 148);

    // ─── 作者/朝代 ───
    ctx.fillStyle = '#7a6a52';
    ctx.font = '16px "Noto Serif SC", "SimSun", serif';
    ctx.fillText(`${work.dynasty} · ${work.author}`, W / 2, 186);

    // ─── 分隔线 ───
    ctx.strokeStyle = 'rgba(180, 160, 120, 0.35)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 100, 208);
    ctx.lineTo(W / 2 + 100, 208);
    ctx.stroke();

    // ─── 诗文正文 ───
    ctx.fillStyle = '#3a3228';
    const sentences = work.text.sentences.length > 0 ? work.text.sentences : [work.text.original];
    const fontSize = sentences.length > 8 ? 15 : sentences.length > 4 ? 17 : 20;
    ctx.font = `${fontSize}px "Noto Serif SC", "SimSun", serif`;
    ctx.textAlign = 'center';
    const lineHeight = fontSize * 1.9;
    const startY = 248;

    sentences.slice(0, 12).forEach((sentence, i) => {
      const y = startY + i * lineHeight;
      // 逐句居中
      ctx.fillText(sentence, W / 2, y);
    });

    // ─── 底部注释片段 ───
    if (work.annotations.length > 0) {
      const noteY = startY + Math.min(sentences.length, 12) * lineHeight + 24;
      if (noteY < H - 180) {
        ctx.fillStyle = '#8b7355';
        ctx.font = '12px "Noto Serif SC", "SimSun", serif';
        ctx.textAlign = 'left';
        const note = work.annotations[0];
        const noteText = `「${note.term}」${note.note.slice(0, 28)}${note.note.length > 28 ? '…' : ''}`;
        // 自动换行
        const maxWidth = W - 120;
        let line = '';
        let noteY2 = noteY;
        for (const ch of noteText) {
          const testLine = line + ch;
          if (ctx.measureText(testLine).width > maxWidth) {
            ctx.fillText(line, 60, noteY2);
            line = ch;
            noteY2 += 18;
          } else {
            line = testLine;
          }
        }
        if (line) ctx.fillText(line, 60, noteY2);
      }
    }

    // ─── 推荐语 ───
    ctx.fillStyle = '#a08060';
    ctx.font = 'italic 13px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = 'center';
    const displayReason = reason.length > 40 ? reason.slice(0, 40) + '…' : reason;
    ctx.fillText(displayReason, W / 2, H - 128);

    // ─── 底部分隔线 ───
    ctx.strokeStyle = 'rgba(180, 160, 120, 0.35)';
    ctx.lineWidth = 0.6;
    ctx.beginPath();
    ctx.moveTo(60, H - 108);
    ctx.lineTo(W - 60, H - 108);
    ctx.stroke();

    // ─── 底部 Logo / 水印 ───
    ctx.fillStyle = '#b8a888';
    ctx.font = '12px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = 'center';
    ctx.fillText('部编古诗文  |  每日一诗', W / 2, H - 82);

    // ─── 小程序/网址提示 ───
    ctx.fillStyle = '#c8b898';
    ctx.font = '10px sans-serif';
    ctx.fillText('扫描二维码访问', W / 2, H - 56);

    // ─── 生成预览 ───
    const dataUrl = canvas.toDataURL('image/png');
    setPreviewUrl(dataUrl);
    setGenerating(false);
  }, [work, reason]);

  // 打开时绘制
  useEffect(() => {
    if (open) {
      // 延迟一帧确保 canvas 已渲染
      const timer = setTimeout(drawPoster, 50);
      return () => clearTimeout(timer);
    } else {
      setPreviewUrl(null);
    }
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

  // 分享（Web Share API / 剪贴板）
  const handleShare = useCallback(async () => {
    if (!previewUrl) return;
    try {
      // 转成 blob
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      const file = new File([blob], `每日一诗_${work.title}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: `每日一诗 · ${work.title}`, text: reason });
        return;
      }
    } catch { /* 降级 */ }
    // 降级：复制图片到剪贴板
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      alert('海报已复制到剪贴板，可粘贴分享！');
    } catch {
      // 最终降级：下载
      handleDownload();
    }
  }, [previewUrl, work.title, reason, handleDownload]);

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
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
          {!generating && previewUrl && (
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
