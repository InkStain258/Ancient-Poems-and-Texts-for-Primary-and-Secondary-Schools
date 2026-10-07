import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useAIStore, sendChatMessage, fetchMCPTools, disconnectMCP, type ToolCallItem, type MCPTool, type AIConfig } from '@/stores/useAIStore';
import {
  MessageSquare,
  Settings,
  X,
  Send,
  Trash2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Brain,
  Sparkles,
  Wrench,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

// ─────────────────────────────────────────────
// Lightweight Markdown renderer (no deps)
// ─────────────────────────────────────────────
function renderMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;
  let keyCounter = 0;
  const k = () => keyCounter++;

  const renderInline = (raw: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|__[^_]+__|_[^_]+_)/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(raw)) !== null) {
      if (m.index > last) parts.push(raw.slice(last, m.index));
      const tok = m[0];
      if (tok.startsWith('`')) {
        parts.push(
          <code key={k()} className="px-1 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary">
            {tok.slice(1, -1)}
          </code>
        );
      } else if (tok.startsWith('**') || tok.startsWith('__')) {
        parts.push(<strong key={k()}>{tok.slice(2, -2)}</strong>);
      } else {
        parts.push(<em key={k()}>{tok.slice(1, -1)}</em>);
      }
      last = m.index + tok.length;
    }
    if (last < raw.length) parts.push(raw.slice(last));
    return parts;
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;
      nodes.push(
        <div key={k()} className="my-2 rounded-xl overflow-hidden border border-primary/20 shadow-sm">
          {lang && (
            <div className="px-3 py-1 text-[10px] bg-primary/10 text-primary font-mono border-b border-primary/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              {lang}
            </div>
          )}
          <pre className="px-3 py-2 text-xs font-mono overflow-x-auto bg-muted/50 leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      continue;
    }

    const hMatch = line.match(/^(#{1,4})\s+(.+)/);
    if (hMatch) {
      const level = hMatch[1].length;
      const content = renderInline(hMatch[2]);
      const sizes = ['text-base', 'text-sm', 'text-xs', 'text-xs'];
      const Tag = (['h1', 'h2', 'h3', 'h4'] as const)[level - 1];
      nodes.push(
        <Tag key={k()} className={`${sizes[level - 1]} font-bold mt-3 mb-1 text-foreground`}>
          {content}
        </Tag>
      );
      i++;
      continue;
    }

    if (/^[-*_]{3,}$/.test(line.trim())) {
      nodes.push(<hr key={k()} className="my-2 border-primary/20" />);
      i++;
      continue;
    }

    if (line.startsWith('>')) {
      const qLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('>')) {
        qLines.push(lines[i].slice(1).trim());
        i++;
      }
      nodes.push(
        <blockquote key={k()} className="border-l-2 border-primary/50 pl-3 py-0.5 my-1.5 italic text-muted-foreground bg-primary/5 rounded-r">
          {qLines.map((ql, qi) => <p key={qi} className="leading-relaxed">{renderInline(ql)}</p>)}
        </blockquote>
      );
      continue;
    }

    if (/^[-*+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={k()} className="list-disc list-inside space-y-0.5 my-1.5 pl-1">
          {items.map((item, ii) => <li key={ii} className="text-sm leading-relaxed">{renderInline(item)}</li>)}
        </ul>
      );
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ''));
        i++;
      }
      nodes.push(
        <ol key={k()} className="list-decimal list-inside space-y-0.5 my-1.5 pl-1">
          {items.map((item, ii) => <li key={ii} className="text-sm leading-relaxed">{renderInline(item)}</li>)}
        </ol>
      );
      continue;
    }

    if (!line.trim()) {
      nodes.push(<div key={k()} className="h-1.5" />);
      i++;
      continue;
    }

    nodes.push(
      <p key={k()} className="text-sm leading-relaxed">{renderInline(line)}</p>
    );
    i++;
  }

  return <>{nodes}</>;
}

// ─────────────────────────────────────────────
// Thinking Block Component
// ─────────────────────────────────────────────
function ThinkingBlock({ reasoning }: { reasoning: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-2 rounded-xl overflow-hidden border border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-purple-500/10 shadow-sm">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-1.5 px-3 py-2 text-left hover:bg-purple-500/10 transition-all duration-200"
      >
        <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" style={{ animation: expanded ? undefined : 'gentlePulse 2s ease-in-out infinite' }} />
        <span className="text-xs font-medium text-purple-400 flex-1">思考过程</span>
        <span className="text-[10px] text-purple-400/60 mr-1 font-mono">{reasoning.length} 字</span>
        <span className={`transition-transform duration-200 text-purple-400/60 ${expanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-3 h-3" />
        </span>
      </button>
      {expanded && (
        <div className="px-3 pb-3 border-t border-purple-500/20 ai-fade-in">
          <div className="text-xs text-purple-300/70 leading-relaxed font-mono whitespace-pre-wrap max-h-48 overflow-y-auto mt-2 scrollbar-thin">
            {reasoning}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MCP Tool Call Block Component
// ─────────────────────────────────────────────
function ToolCallBlock({ calls }: { calls: ToolCallItem[] }) {
  const [expanded, setExpanded] = useState(true);

  const allDone = calls.every((c) => c.status === 'done' || c.status === 'error');
  const hasError = calls.some((c) => c.status === 'error');

  return (
    <div className="mb-2 rounded-xl overflow-hidden border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/10 shadow-sm">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-1.5 px-3 py-2 text-left hover:bg-amber-500/10 transition-all duration-200"
      >
        <Wrench className={`w-3.5 h-3.5 shrink-0 ${hasError ? 'text-red-400' : 'text-amber-400'}`}
          style={{ animation: allDone ? undefined : 'gentlePulse 1.5s ease-in-out infinite' }}
        />
        <span className={`text-xs font-medium flex-1 ${hasError ? 'text-red-400' : 'text-amber-400'}`}>
          工具调用 ({calls.length})
        </span>
        {!allDone && (
          <span className="flex gap-0.5 mr-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-1 h-1 rounded-full bg-amber-400 animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </span>
        )}
        {allDone && !hasError && <CheckCircle2 className="w-3.5 h-3.5 text-green-400 mr-1" />}
        {hasError && <AlertCircle className="w-3.5 h-3.5 text-red-400 mr-1" />}
        <span className={`transition-transform duration-200 text-amber-400/60 ${expanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-3 h-3" />
        </span>
      </button>
      {expanded && (
        <div className="px-3 pb-3 border-t border-amber-500/20 ai-fade-in space-y-2 mt-2">
          {calls.map((call) => (
            <div key={call.id} className="rounded-lg border border-amber-500/20 bg-background/50 overflow-hidden">
              <div className="px-2.5 py-1.5 flex items-center gap-2 bg-amber-500/5">
                {call.status === 'pending' && <span className="w-2 h-2 rounded-full bg-amber-400/50" />}
                {call.status === 'running' && <Loader2 className="w-3 h-3 text-amber-400 animate-spin" />}
                {call.status === 'done' && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                {call.status === 'error' && <AlertCircle className="w-3 h-3 text-red-400" />}
                <code className="text-xs font-mono text-amber-300 flex-1 truncate">{call.name}</code>
              </div>
              <div className="px-2.5 py-1.5 text-xs font-mono text-muted-foreground/70 max-h-20 overflow-y-auto scrollbar-thin">
                <div className="text-[10px] text-muted-foreground/50 mb-0.5">参数:</div>
                <pre className="whitespace-pre-wrap break-all">{call.arguments}</pre>
                {call.result && (
                  <>
                    <div className="text-[10px] text-muted-foreground/50 mt-1.5 mb-0.5">结果:</div>
                    <pre className="whitespace-pre-wrap break-all text-foreground/70">{call.result.slice(0, 500)}{call.result.length > 500 ? '…' : ''}</pre>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Streaming cursor
// ─────────────────────────────────────────────
function StreamingCursor() {
  return (
    <span
      className="inline-block w-0.5 h-3.5 bg-current ml-0.5 align-middle rounded-full"
      style={{ animation: 'blink 0.8s step-end infinite' }}
    />
  );
}

// ─────────────────────────────────────────────
// Floating particles around the ball
// ─────────────────────────────────────────────
function BallParticles({ active }: { active: boolean }) {
  if (!active) return null;
  const particles = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="absolute inset-0 rounded-full pointer-events-none overflow-visible">
      {particles.map((i) => (
        <span
          key={i}
          className="absolute rounded-full bg-primary/60"
          style={{
            width: `${3 + (i % 3)}px`,
            height: `${3 + (i % 3)}px`,
            top: '50%',
            left: '50%',
            transformOrigin: '0 0',
            animation: `orbit-particle-${i} ${2.5 + i * 0.4}s linear infinite`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Message bubble
// ─────────────────────────────────────────────
interface MessageBubbleProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  toolCalls?: ToolCallItem[];
  isLast: boolean;
  isGenerating: boolean;
  index: number;
}

function MessageBubble({ role, content, reasoning, toolCalls, isLast, isGenerating, index }: MessageBubbleProps) {
  const isUser = role === 'user';
  const showCursor = !isUser && isLast && isGenerating;
  const isEmpty = !content && !reasoning && (!toolCalls || toolCalls.length === 0);

  return (
    <div
      className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'} ai-msg-enter`}
      style={{ animationDelay: `${Math.min(index * 30, 200)}ms` }}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full shrink-0 mt-0.5 flex items-center justify-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)',
            boxShadow: '0 0 12px hsl(var(--primary) / 0.4)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5 text-primary-foreground relative z-10" />
          {/* Inner glow ring */}
          <span className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 60%)' }}
          />
        </div>
      )}

      <div className={`max-w-[88%] flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        {reasoning && <ThinkingBlock reasoning={reasoning} />}
        {toolCalls && toolCalls.length > 0 && <ToolCallBlock calls={toolCalls} />}

        {/* Main content bubble */}
        <div
          className={`px-3 py-2.5 text-sm leading-relaxed relative overflow-hidden ${
            isUser
              ? 'rounded-2xl rounded-tr-sm text-primary-foreground'
              : 'rounded-2xl rounded-tl-sm border shadow-sm'
          }`}
          style={isUser ? {
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.85) 100%)',
            boxShadow: '0 4px 16px hsl(var(--primary) / 0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
          } : {
            background: 'hsl(var(--muted) / 0.6)',
            borderColor: 'hsl(var(--border) / 0.5)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* User bubble shimmer */}
          {isUser && (
            <span className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)' }}
            />
          )}

          {isEmpty ? (
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="flex gap-0.5">
                {[0, 150, 300].map((delay) => (
                  <span key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </span>
              <span className="text-xs">思考中…</span>
            </span>
          ) : isUser ? (
            <span className="whitespace-pre-wrap relative z-10">{content}</span>
          ) : (
            <div className="ai-markdown">
              {renderMarkdown(content)}
              {showCursor && <StreamingCursor />}
            </div>
          )}
        </div>
      </div>

      {/* User avatar */}
      {isUser && (
        <div className="w-7 h-7 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-white text-[10px] font-bold relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            boxShadow: '0 0 10px rgba(245,158,11,0.35)',
          }}
        >
          我
          <span className="absolute inset-0 rounded-full"
            style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)' }}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Draggable Ball hook
// ─────────────────────────────────────────────
function useDraggable(defaultRight = 24, defaultBottom = typeof window !== 'undefined' && window.innerWidth < 768 ? 100 : 24) {
  const [pos, setPos] = useState({ right: defaultRight, bottom: defaultBottom });
  const [isDragging, setIsDragging] = useState(false);
  const [didDrag, setDidDrag] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, startRight: defaultRight, startBottom: defaultBottom });

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startRight: pos.right,
      startBottom: pos.bottom,
    };
    setIsDragging(true);
    setDidDrag(false);
  }, [pos]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) + Math.abs(dy) > 4) setDidDrag(true);
    const newRight = Math.max(8, Math.min(window.innerWidth - 64, dragRef.current.startRight - dx));
    const newBottom = Math.max(8, Math.min(window.innerHeight - 64, dragRef.current.startBottom - dy));
    setPos({ right: newRight, bottom: newBottom });
  }, [isDragging]);

  const onPointerUp = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setDidDrag(false), 50);
  }, []);

  return { pos, isDragging, didDrag, onPointerDown, onPointerMove, onPointerUp };
}

// ─────────────────────────────────────────────
// MCP Settings Panel
// ─────────────────────────────────────────────
interface MCPSettingsProps {
  config: AIConfig;
  setConfig: (c: Partial<AIConfig>) => void;
  mcpTools: MCPTool[];
  setMcpTools: (t: MCPTool[]) => void;
}

function MCPSettings({ config, setConfig, mcpTools, setMcpTools }: MCPSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const mcpConnected = useAIStore((s) => s.mcpConnected);

  const handleFetch = async () => {
    if (!config.mcpServerUrl) return;
    setLoading(true);
    setError('');
    try {
      const tools = await fetchMCPTools(config.mcpServerUrl);
      setMcpTools(tools);
      useAIStore.getState().setMcpConnected(true);
      if (tools.length === 0) setError('已连接但未发现任何工具');
    } catch (e) {
      useAIStore.getState().setMcpConnected(false);
      setError(e instanceof Error ? e.message : '连接失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    disconnectMCP();
    setMcpTools([]);
    useAIStore.getState().setMcpConnected(false);
    setError('');
  };

  return (
    <div className="space-y-3 pt-3 border-t border-amber-500/20 mt-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-amber-500 flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5" />
          MCP 工具调用
          {mcpConnected && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ boxShadow: '0 0 4px rgba(74,222,128,0.7)' }} />
          )}
        </span>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <div
            onClick={() => {
              const newVal = !config.enableMCP;
              setConfig({ enableMCP: newVal });
              if (!newVal) handleDisconnect();
            }}
            className={`relative w-9 h-5 rounded-full transition-colors duration-200 cursor-pointer ${
              config.enableMCP ? 'bg-amber-500' : 'bg-muted-foreground/30'
            }`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
              config.enableMCP ? 'translate-x-[18px]' : 'translate-x-0.5'
            }`} />
          </div>
          <span className="text-[10px] text-muted-foreground">{config.enableMCP ? '已启用' : '已禁用'}</span>
        </label>
      </div>

      {config.enableMCP && (
        <div className="space-y-2.5 ai-fade-in">
          {/* Help toggle */}
          <button
            onClick={() => setShowHelp((v) => !v)}
            className="text-[10px] text-amber-400/70 hover:text-amber-400 flex items-center gap-1 transition-colors"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${showHelp ? 'rotate-180' : ''}`} />
            如何启动 MCP 服务器？
          </button>

          {showHelp && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2.5 ai-fade-in">
              <p className="text-[10px] text-amber-400/80 leading-relaxed mb-2">
                MCP 服务器使用 stdio 传输，需要通过 <code className="px-1 py-0.5 rounded bg-amber-500/10 text-amber-300">supergateway</code> 桥接为 HTTP SSE 才能在浏览器中使用。
              </p>
              <div className="rounded bg-black/30 p-2 overflow-x-auto">
                <code className="text-[9px] text-green-400/90 font-mono whitespace-pre leading-relaxed">{`npx -y supergateway \\
  --stdio "npx -y @agent-infra/mcp-server-browser" \\
  --port 8000 --cors`}</code>
              </div>
              <p className="text-[9px] text-muted-foreground/60 mt-1.5">启动后，在下方填写 SSE 地址即可连接</p>
            </div>
          )}

          {/* SSE URL input */}
          <div>
            <label className="text-[11px] font-medium text-muted-foreground">MCP SSE 端点地址</label>
            <div className="flex gap-1.5 mt-1">
              <input
                type="url"
                value={config.mcpServerUrl ?? ''}
                onChange={(e) => {
                  setConfig({ mcpServerUrl: e.target.value });
                  // Clear tools when URL changes
                  if (e.target.value !== config.mcpServerUrl) {
                    setMcpTools([]);
                    useAIStore.getState().setMcpConnected(false);
                    setError('');
                  }
                }}
                placeholder="http://localhost:8000/sse"
                className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-shadow font-mono"
              />
              <button
                onClick={handleFetch}
                disabled={loading || !config.mcpServerUrl}
                className="px-2.5 py-1.5 text-xs rounded-lg bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border border-amber-500/30 disabled:opacity-40 transition-all"
                title="连接并加载工具列表"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
              </button>
              {mcpConnected && (
                <button
                  onClick={handleDisconnect}
                  className="px-2.5 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-all"
                  title="断开连接"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5">
              <p className="text-[10px] text-red-400 flex items-start gap-1">
                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                {error}
              </p>
            </div>
          )}

          {mcpTools.length > 0 && (
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-2">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] text-amber-500 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                  已加载 {mcpTools.length} 个工具
                </p>
                <span className="text-[9px] text-green-400/60">连接正常</span>
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto scrollbar-thin">
                {mcpTools.map((t: MCPTool) => (
                  <div key={t.name} className="flex items-start gap-1.5">
                    <Wrench className="w-2.5 h-2.5 text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <code className="text-[10px] text-amber-300 font-mono">{t.name}</code>
                      <p className="text-[9px] text-muted-foreground/70 leading-tight">{t.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export default function AIFloatingBall() {
  const { isChatOpen, setChatOpen, config, setConfig, messages, isGenerating, clearMessages, mcpTools, setMcpTools, mcpConnected } =
    useAIStore();
  const [showSettings, setShowSettings] = useState(!config.apiBase);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { pos, isDragging, didDrag, onPointerDown, onPointerMove, onPointerUp } = useDraggable();

  const visibleMessages = useMemo(
    () => messages.filter((m) => m.role !== 'system'),
    [messages]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isChatOpen && !showSettings) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isChatOpen, showSettings]);

  const handleSend = useCallback(async () => {
    const msg = inputValue.trim();
    if (!msg || isGenerating) return;
    setInputValue('');
    await sendChatMessage(msg);
  }, [inputValue, isGenerating]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const isConfigured = !!(config.apiBase && config.apiKey && config.model);

  // ── Floating Ball ──
  const ball = (
    <div
      style={{ right: pos.right, bottom: pos.bottom, position: 'fixed', zIndex: 50 }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <button
        onPointerDown={onPointerDown}
        onClick={() => {
          if (didDrag) return;
          setChatOpen(true);
          if (!isConfigured) setShowSettings(true);
        }}
        className={`
          w-14 h-14 rounded-full relative
          flex items-center justify-center select-none
          transition-all duration-300
          ${isDragging ? 'scale-110' : 'hover:scale-110 active:scale-95'}
          text-white
        `}
        title="AI 诗文助手（可拖动）"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          background: isConfigured
            ? 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.75) 100%)'
            : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          boxShadow: isConfigured
            ? `0 8px 32px hsl(var(--primary) / 0.4), 0 2px 8px hsl(var(--primary) / 0.2), inset 0 1px 0 rgba(255,255,255,0.2)`
            : `0 8px 32px rgba(245,158,11,0.4), 0 2px 8px rgba(245,158,11,0.2), inset 0 1px 0 rgba(255,255,255,0.2)`,
        }}
      >
        {/* Outer glow pulse ring */}
        <span className="absolute -inset-2 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: isConfigured
              ? 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)',
            animation: 'ai-glow-ring 2.5s ease-in-out infinite',
          }}
        />
        {/* Animated ring */}
        <span className="absolute inset-0 rounded-full border-2 opacity-40"
          style={{
            borderColor: 'currentColor',
            animation: 'ai-ring-expand 2.5s ease-out infinite',
          }}
        />
        {/* Highlight gloss */}
        <span className="absolute inset-0 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.35) 0%, transparent 55%)' }}
        />
        {/* Icon */}
        <Sparkles className="w-6 h-6 relative z-10 drop-shadow-sm" />
        {/* Status dot */}
        {isConfigured && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-background flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #4ade80, #16a34a)', boxShadow: '0 0 6px rgba(74,222,128,0.6)' }}
          >
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
          </span>
        )}
        {/* Particles */}
        <BallParticles active={isGenerating} />
      </button>
    </div>
  );

  // ── Chat Panel ──
  const panel = isChatOpen ? (
    <div
      className="fixed z-50 flex flex-col rounded-2xl overflow-hidden"
      style={{
        bottom: pos.bottom + 72,
        right: pos.right,
        width: 'clamp(320px, 400px, calc(100vw - 32px))',
        height: 'clamp(400px, 580px, calc(100vh - 140px))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        background: 'hsl(var(--background) / 0.97)',
        border: '1px solid hsl(var(--border) / 0.5)',
        boxShadow: '0 25px 60px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.08)',
        animation: 'ai-panel-enter 0.28s cubic-bezier(0.34, 1.56, 0.64, 1) both',
      }}
    >
      {/* Top glow accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.6), transparent)' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 shrink-0 relative"
        style={{ background: 'linear-gradient(135deg, hsl(var(--primary) / 0.06) 0%, transparent 100%)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.7) 100%)',
              boxShadow: '0 4px 12px hsl(var(--primary) / 0.3)',
            }}
          >
            <Sparkles className="w-4.5 h-4.5 text-primary-foreground relative z-10" style={{ width: '18px', height: '18px' }} />
            <span className="absolute inset-0"
              style={{ background: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.3) 0%, transparent 60%)' }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight" style={{ fontFamily: 'var(--font-classical, serif)' }}>诗文 AI 助手</h3>
            <p className="text-[10px] text-muted-foreground leading-tight flex items-center gap-1">
              {isConfigured ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" style={{ boxShadow: '0 0 4px rgba(74,222,128,0.7)' }} />
                  {config.model}
                  {config.enableMCP && (
                    <span className={`px-1 py-0.5 rounded text-[9px] ml-1 border ${
                      mcpConnected && mcpTools.length > 0
                        ? 'bg-green-500/15 text-green-400 border-green-500/20'
                        : 'bg-amber-500/15 text-amber-500 border-amber-500/20'
                    }`}>
                      MCP·{mcpTools.length > 0 ? mcpTools.length : '未连接'}
                    </span>
                  )}
                </>
              ) : '未配置接口'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings((v) => !v)}
            className={`p-1.5 rounded-lg transition-all ${showSettings ? 'bg-primary/10 text-primary shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            title="设置"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChatOpen(false)}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="px-4 py-3 border-b border-border/40 shrink-0 ai-fade-in space-y-3 overflow-y-auto max-h-72 scrollbar-thin"
          style={{ background: 'hsl(var(--muted) / 0.2)' }}
        >
          <p className="text-xs text-muted-foreground leading-relaxed">
            配置 OpenAI 兼容接口（OpenAI、DeepSeek、Kimi、通义千问等均可）。支持流式输出、思考链与 MCP 工具调用。
          </p>
          <div className="space-y-2.5">
            {[
              { label: '接口地址 (Base URL)', key: 'apiBase', type: 'url', placeholder: 'https://api.openai.com/v1' },
              { label: 'API Key', key: 'apiKey', type: 'password', placeholder: 'sk-...' },
              { label: '模型名称', key: 'model', type: 'text', placeholder: 'gpt-4o-mini / deepseek-chat / ...' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="text-[11px] font-medium text-muted-foreground">{label}</label>
                <input
                  type={type}
                  value={config[key as keyof typeof config] as string}
                  onChange={(e) => setConfig({ [key]: e.target.value })}
                  placeholder={placeholder}
                  className="w-full mt-1 px-3 py-1.5 text-xs rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
              </div>
            ))}
          </div>

          <MCPSettings config={config} setConfig={setConfig} mcpTools={mcpTools} setMcpTools={setMcpTools} />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-muted-foreground">配置保存在本地，不会上传</span>
            {isConfigured && (
              <button
                onClick={() => setShowSettings(false)}
                className="text-xs text-primary hover:underline font-medium"
              >
                开始对话 →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Messages area */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin"
        style={{ display: showSettings ? 'none' : 'flex', flexDirection: 'column' }}
      >
        {visibleMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center gap-3 select-none ai-fade-in">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary) / 0.04) 100%)',
                boxShadow: '0 0 32px hsl(var(--primary) / 0.12), inset 0 1px 0 hsl(var(--primary) / 0.1)',
              }}
            >
              <MessageSquare className="w-7 h-7 relative z-10"
                style={{ color: 'hsl(var(--primary) / 0.7)' }}
              />
              {/* Rotating ring */}
              <span className="absolute inset-0 rounded-2xl border border-primary/20"
                style={{ animation: 'ai-ring-spin 8s linear infinite' }}
              />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ fontFamily: 'var(--font-classical, serif)' }}>向我提问古诗文</p>
              <p className="text-xs text-muted-foreground mt-1">赏析、注释、翻译、典故…</p>
            </div>
            <div className="flex flex-wrap gap-1.5 justify-center max-w-[280px] mt-1">
              {['赏析《静夜思》', '文言文如何翻译', '什么是借景抒情', '杜甫的代表作', '《鸿门宴》背景'].map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    setInputValue(q);
                    setTimeout(() => inputRef.current?.focus(), 50);
                  }}
                  className="px-2.5 py-1 text-xs rounded-full border transition-all hover:scale-105 active:scale-95"
                  style={{
                    borderColor: 'hsl(var(--primary) / 0.3)',
                    color: 'hsl(var(--primary) / 0.85)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'hsl(var(--primary) / 0.1)';
                    (e.currentTarget as HTMLElement).style.boxShadow = '0 0 8px hsl(var(--primary) / 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = '';
                    (e.currentTarget as HTMLElement).style.boxShadow = '';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          visibleMessages.map((msg, i) => (
            <MessageBubble
              key={i}
              role={msg.role as 'user' | 'assistant'}
              content={msg.content}
              reasoning={msg.reasoning}
              toolCalls={msg.toolCalls}
              isLast={i === visibleMessages.length - 1}
              isGenerating={isGenerating}
              index={i}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!showSettings && (
        <div className="border-t border-border/40 px-3 py-2.5 shrink-0 relative"
          style={{ background: 'hsl(var(--background) / 0.85)', backdropFilter: 'blur(8px)' }}
        >
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary) / 0.2), transparent)' }}
          />
          <div className="flex items-end gap-2">
            <button
              onClick={clearMessages}
              className="p-1.5 rounded-lg hover:bg-muted transition-all text-muted-foreground hover:text-foreground mb-0.5 shrink-0 hover:scale-110 active:scale-95"
              title="清空对话"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                rows={1}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder={isConfigured ? '输入问题… (Enter 发送，Shift+Enter 换行)' : '请先配置 AI 接口…'}
                disabled={!isConfigured || isGenerating}
                className="w-full px-3 py-2 text-sm rounded-xl border bg-background focus:outline-none resize-none overflow-hidden disabled:opacity-50 leading-relaxed transition-all"
                style={{
                  minHeight: '36px',
                  maxHeight: '96px',
                  boxShadow: inputValue ? '0 0 0 2px hsl(var(--primary) / 0.25), 0 2px 8px hsl(var(--primary) / 0.1)' : undefined,
                  borderColor: inputValue ? 'hsl(var(--primary) / 0.4)' : undefined,
                }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!isConfigured || !inputValue.trim() || isGenerating}
              className="p-2 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 mb-0.5 shrink-0"
              style={{
                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
                boxShadow: (!isConfigured || !inputValue.trim() || isGenerating) ? undefined : '0 4px 12px hsl(var(--primary) / 0.35)',
              }}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground/40 mt-1.5 text-center">
            流式输出 · Markdown 渲染 · 思考链
            {config.enableMCP && (
              mcpConnected && mcpTools.length > 0
                ? ` · MCP工具×${mcpTools.length}`
                : ' · MCP未连接'
            )}
          </p>
        </div>
      )}
    </div>
  ) : null;

  return createPortal(
    <>
      {ball}
      {panel}
    </>,
    document.body
  );
}
