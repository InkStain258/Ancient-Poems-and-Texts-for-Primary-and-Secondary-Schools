import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, BarChart3, Grid3X3, Info, Clock, CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: '首页', icon: Home },
  { path: '/works', label: '诗文', icon: BookOpen },
  { path: '/timeline', label: '长卷', icon: Clock },
  { path: '/calendar', label: '日历', icon: CalendarDays },
  { path: '/about', label: '关于', icon: Info },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="glass-nav fixed bottom-0 left-0 right-0 z-40 border-t md:hidden">
      {/* Top ink gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 text-xs transition-all relative',
                isActive ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5 transition-transform', isActive && 'scale-110')} />
              <span>{item.label}</span>
              {isActive && (
                <span className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
