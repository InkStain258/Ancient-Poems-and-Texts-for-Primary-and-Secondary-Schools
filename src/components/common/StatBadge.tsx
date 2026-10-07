import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatBadgeProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  className?: string;
}

export default function StatBadge({ icon, label, value, className }: StatBadgeProps) {
  return (
    <div className={cn('flex items-center gap-2 rounded-lg border bg-card p-3', className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
