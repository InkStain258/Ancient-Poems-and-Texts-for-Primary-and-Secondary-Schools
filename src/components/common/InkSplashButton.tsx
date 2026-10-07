import { useState, useCallback, useRef } from 'react';

interface InkSplashButtonProps {
  /** Button label */
  children: React.ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Visual variant */
  variant?: 'default' | 'outline' | 'ghost';
  /** Size */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

interface Splash {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function InkSplashButton({
  children,
  onClick,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
}: InkSplashButtonProps) {
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const splashIdRef = useRef(0);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDim = Math.max(rect.width, rect.height);

      const newSplash: Splash = {
        id: splashIdRef.current++,
        x,
        y,
        size: maxDim * 2.5,
      };

      setSplashes((prev) => [...prev, newSplash]);

      // Remove splash after animation
      setTimeout(() => {
        setSplashes((prev) => prev.filter((s) => s.id !== newSplash.id));
      }, 800);

      onClick?.();
    },
    [disabled, onClick]
  );

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-primary/30 bg-background hover:bg-primary/10 text-primary',
    ghost: 'bg-transparent hover:bg-primary/10 text-primary',
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-200
        active:scale-95 select-none
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {/* Ink splash effects */}
      {splashes.map((splash) => (
        <span
          key={splash.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: splash.x - splash.size / 2,
            top: splash.y - splash.size / 2,
            width: splash.size,
            height: splash.size,
            background:
              variant === 'default'
                ? 'radial-gradient(circle, hsl(0 0% 100% / 0.4) 0%, hsl(0 0% 100% / 0.1) 40%, transparent 70%)'
                : 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, hsl(var(--primary) / 0.08) 40%, transparent 70%)',
            animation: 'inkSplash 0.8s ease-out forwards',
          }}
        />
      ))}

      {/* Button content */}
      <span className="relative z-10">{children}</span>

      <style>{`
        @keyframes inkSplash {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
}
