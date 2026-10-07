import { Link, useLocation } from 'react-router-dom';
import { BookOpen, BarChart3, Grid3X3, Home, Info, Clock, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import ThemeToggle from '../common/ThemeToggle';
import SearchBar from '../common/SearchBar';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/works', label: '诗文', icon: BookOpen },
  { path: '/category', label: '分类', icon: Grid3X3 },
  { path: '/timeline', label: '长卷', icon: Clock },
  { path: '/calendar', label: '日历', icon: CalendarDays },
  { path: '/stats', label: '统计', icon: BarChart3 },
  { path: '/about', label: '关于', icon: Info },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="glass-nav sticky top-0 z-40 w-full border-b">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Logo */}
        <Link to="/" className="mr-6 flex items-center space-x-2 group">
          <span className="seal-stamp scale-50 origin-center group-hover:rotate-0 transition-transform duration-300" style={{ width: '32px', height: '32px', fontSize: '14px', borderWidth: '1.5px' }}>诗</span>
          <span className="text-xl font-bold text-primary poem-title">部编古诗文</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'transition-all hover:text-primary flex items-center gap-1.5 relative',
                  isActive ? 'text-primary font-semibold' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-[9px] left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Search bar (desktop) */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <SearchBar />
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-2 ml-auto md:ml-0">
          <ThemeToggle />
        </div>
      </div>
      {/* Bottom ink-gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </header>
  );
}
