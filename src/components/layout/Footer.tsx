import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-10 mt-auto relative overflow-hidden">
      {/* Decorative ink gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Decorative divider */}
        <div className="ink-divider max-w-xs mx-auto" />

        {/* Navigation links */}
        <div className="flex justify-center gap-6 text-sm text-muted-foreground mb-4 mt-4">
          <Link to="/" className="hover:text-primary transition-colors duration-200">首页</Link>
          <Link to="/works" className="hover:text-primary transition-colors duration-200">全部诗文</Link>
          <Link to="/category" className="hover:text-primary transition-colors duration-200">分类浏览</Link>
          <Link to="/stats" className="hover:text-primary transition-colors duration-200">数据统计</Link>
          <Link to="/about" className="hover:text-primary transition-colors duration-200">关于我们</Link>
        </div>

        {/* Project info */}
        <p className="text-sm text-muted-foreground">
          部编版语文古诗文文化网站 · 探索中华经典诗文之美
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          数据来源：部编版语文教材 · 共 287 篇诗文 · 125 位作者 · Apache License 2.0
        </p>

        {/* Poetic verse with enhanced styling */}
        <div className="mt-4 verse-highlight inline-block px-4 py-1.5">
          <p className="text-xs text-muted-foreground/50 poem-text">
            熟读唐诗三百首，不会作诗也会吟
          </p>
        </div>
      </div>
    </footer>
  );
}
