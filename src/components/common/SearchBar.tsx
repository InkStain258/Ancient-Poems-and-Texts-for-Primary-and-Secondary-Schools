import { useState, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWorkStore } from '@/stores/useWorkStore';
import { useSearchHistoryStore } from '@/stores/useSearchHistoryStore';

export default function SearchBar() {
  const [focused, setFocused] = useState(false);
  const { keyword, setKeyword } = useWorkStore();
  const { history, addHistory, removeHistory, clearHistory } = useSearchHistoryStore();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const handleSearch = useCallback(() => {
    if (keyword.trim()) {
      addHistory(keyword);
      navigate('/works');
    }
  }, [keyword, addHistory, navigate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleSelectHistory = useCallback(
    (kw: string) => {
      setKeyword(kw);
      setFocused(false);
      navigate('/works');
    },
    [setKeyword, navigate]
  );

  // Update dropdown position when focused or on scroll/resize
  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  useEffect(() => {
    if (focused) {
      updatePosition();
    }
  }, [focused, updatePosition]);

  useEffect(() => {
    if (!focused) return;

    const handleScroll = () => {
      // Close dropdown on scroll to avoid stale positioning
      setFocused(false);
    };
    const handleResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [focused, updatePosition]);

  const showDropdown = focused && history.length > 0;

  return (
    <>
      <div ref={containerRef} className="relative w-full max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索诗文标题、作者、内容..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            onKeyDown={handleKeyDown}
            className="pl-9 pr-9"
          />
          {keyword && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => setKeyword('')}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Search history dropdown — rendered via portal to avoid overflow clipping */}
      {showDropdown && createPortal(
        <div
          className="fixed z-[9999] rounded-md border bg-popover p-2 shadow-lg animate-fade-in"
          style={{
            top: dropdownPos.top,
            left: dropdownPos.left,
            width: dropdownPos.width,
          }}
          onMouseDown={(e) => e.preventDefault()} // Prevent blur on click
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">搜索历史</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={clearHistory}>
              清空
            </Button>
          </div>
          {history.slice(0, 5).map((item) => (
            <div
              key={item.keyword}
              className="flex items-center justify-between rounded-sm px-2 py-1 hover:bg-accent cursor-pointer text-sm"
              onClick={() => handleSelectHistory(item.keyword)}
            >
              <span>{item.keyword}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={(e) => {
                  e.stopPropagation();
                  removeHistory(item.keyword);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
