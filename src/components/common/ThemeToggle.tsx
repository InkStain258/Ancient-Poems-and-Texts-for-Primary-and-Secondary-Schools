import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/useThemeStore';
import type { ThemeMode } from '@/stores/useThemeStore';

export default function ThemeToggle() {
  const { mode, setMode } = useThemeStore();

  const modes: { value: ThemeMode; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: '亮色' },
    { value: 'dark', icon: Moon, label: '暗色' },
    { value: 'system', icon: Monitor, label: '跟随系统' },
  ];

  const cycleMode = () => {
    const currentIndex = modes.findIndex((m) => m.value === mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setMode(modes[nextIndex].value);
  };

  const CurrentIcon = modes.find((m) => m.value === mode)?.icon || Sun;

  return (
    <Button variant="ghost" size="icon" onClick={cycleMode} title={`当前：${modes.find((m) => m.value === mode)?.label}`}>
      <CurrentIcon className="h-5 w-5" />
    </Button>
  );
}
