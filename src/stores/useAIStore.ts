import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  /** 思考链内容（DeepSeek-R1 等支持） */
  reasoning?: string;
  /** 工具调用记录 */
  toolCalls?: ToolCallItem[];
  /** tool_call_id（tool role 使用） */
  toolCallId?: string;
  /** 工具名称（tool role 使用） */
  toolName?: string;
  timestamp: number;
}

export interface ToolCallItem {
  id: string;
  name: string;
  arguments: string;
  /** 工具调用结果（执行完后填入） */
  result?: string;
  /** 执行状态 */
  status: 'pending' | 'running' | 'done' | 'error';
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
}

export interface AIConfig {
  apiBase: string;
  apiKey: string;
  model: string;
  /** MCP SSE endpoint URL (e.g. http://localhost:8000/sse via supergateway) */
  mcpServerUrl?: string;
  /** Whether to enable MCP tools */
  enableMCP?: boolean;
}

interface AIStore {
  // Config
  config: AIConfig;
  setConfig: (config: Partial<AIConfig>) => void;

  // MCP tools loaded from server
  mcpTools: MCPTool[];
  setMcpTools: (tools: MCPTool[]) => void;

  // MCP connection state
  mcpConnected: boolean;
  setMcpConnected: (connected: boolean) => void;

  // Chat state
  messages: AIMessage[];
  isChatOpen: boolean;
  isGenerating: boolean;
  setChatOpen: (open: boolean) => void;
  addMessage: (message: Omit<AIMessage, 'timestamp'>) => void;
  clearMessages: () => void;
  setGenerating: (generating: boolean) => void;

  // Streaming
  updateLastAssistantMessage: (content: string, reasoning?: string, toolCalls?: ToolCallItem[]) => void;
  updateLastToolCallStatus: (callId: string, status: ToolCallItem['status'], result?: string) => void;
}

const SYSTEM_PROMPT = `你是一位精通中国古典文学的AI助手，专门服务于"部编古诗文"网站。你的职责是：

1. 回答用户关于古诗文的各种问题，包括但不限于：
   - 诗词赏析和解读
   - 作者生平和创作背景
   - 文言文翻译和注释
   - 文学常识和典故
   - 诗歌鉴赏技巧

2. 回答风格：
   - 温文尔雅，体现中国文化气质
   - 引经据典，适当引用相关诗文
   - 深入浅出，既有学术深度又通俗易懂

3. 当前网站收录了部编版小学、初中、高中语文教材中的全部古诗文（共287篇），涵盖125位作者。

请用简洁准确的方式回答问题，适时引用诗句。`;

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      config: {
        apiBase: '',
        apiKey: '',
        model: '',
        mcpServerUrl: '',
        enableMCP: false,
      },
      setConfig: (partial) => {
        set((state) => ({
          config: { ...state.config, ...partial },
        }));
      },

      mcpTools: [],
      setMcpTools: (tools) => set({ mcpTools: tools }),
      mcpConnected: false,
      setMcpConnected: (connected) => set({ mcpConnected: connected }),

      messages: [],
      isChatOpen: false,
      isGenerating: false,
      setChatOpen: (open) => set({ isChatOpen: open }),
      addMessage: (message) => {
        set((state) => ({
          messages: [
            ...state.messages,
            { ...message, timestamp: Date.now() },
          ],
        }));
      },
      clearMessages: () => set({ messages: [] }),
      setGenerating: (generating) => set({ isGenerating: generating }),
      updateLastAssistantMessage: (content, reasoning, toolCalls) => {
        set((state) => {
          const messages = [...state.messages];
          const lastIdx = messages.length - 1;
          if (lastIdx >= 0 && messages[lastIdx].role === 'assistant') {
            messages[lastIdx] = {
              ...messages[lastIdx],
              content,
              ...(reasoning !== undefined ? { reasoning } : {}),
              ...(toolCalls !== undefined ? { toolCalls } : {}),
            };
          }
          return { messages };
        });
      },
      updateLastToolCallStatus: (callId, status, result) => {
        set((state) => {
          const messages = [...state.messages];
          const lastIdx = messages.length - 1;
          if (lastIdx >= 0 && messages[lastIdx].role === 'assistant') {
            const msg = { ...messages[lastIdx] };
            if (msg.toolCalls) {
              msg.toolCalls = msg.toolCalls.map((tc) =>
                tc.id === callId ? { ...tc, status, ...(result !== undefined ? { result } : {}) } : tc
              );
              messages[lastIdx] = msg;
            }
          }
          return { messages };
        });
      },
    }),
    {
      name: 'bbc_ai_config',
      partialize: (state) => ({
        config: state.config,
        messages: state.messages.slice(-20), // Keep last 20 messages
      }),
    }
  )
);

// ═══════════════════════════════════════════════
// MCP JSON-RPC over SSE Client
// ═══════════════════════════════════════════════
// Works with supergateway (or any MCP SSE transport):
//   npx -y supergateway --stdio "npx -y @agent-infra/mcp-server-browser" --port 8000 --cors
//
// Protocol:
//   GET  /sse       → SSE stream, sends "endpoint" event with message path
//   POST /message   → Send JSON-RPC request, responses come via SSE
// ═══════════════════════════════════════════════

let _rpcId = 1;
function nextRpcId(): number {
  return _rpcId++;
}

/** Active SSE connections for cleanup */
const sseConnections: EventSource[] = [];

/** Clean up all SSE connections */
export function disconnectMCP(): void {
  for (const es of sseConnections) {
    try { es.close(); } catch { /* ignore */ }
  }
  sseConnections.length = 0;
  useAIStore.getState().setMcpConnected(false);
}

/**
 * Fetch MCP tools via JSON-RPC over SSE protocol.
 *
 * Flow:
 * 1. Connect to SSE endpoint (GET /sse)
 * 2. Receive "endpoint" event containing the message POST path
 * 3. Send JSON-RPC "tools/list" request to the message endpoint
 * 4. Receive response via SSE "message" event
 * 5. Close SSE connection
 */
export async function fetchMCPTools(sseUrl: string): Promise<MCPTool[]> {
  // Clean up previous connections
  disconnectMCP();

  if (!sseUrl) return [];

  const baseUrl = sseUrl.replace(/\/+$/, '');

  return new Promise<MCPTool[]>((resolve, reject) => {
    const timeout = setTimeout(() => {
      disconnectMCP();
      reject(new Error('连接超时（10秒），请确认 MCP 服务器已启动'));
    }, 10000);

    const es = new EventSource(baseUrl);
    sseConnections.push(es);

    let messageEndpoint = '';

    es.addEventListener('endpoint', (event) => {
      // The endpoint event contains the message POST path, e.g. "/message?sessionId=xxx"
      const path = (event.data as string).trim();
      if (path) {
        // If path is relative, resolve against base URL
        if (path.startsWith('/')) {
          const urlObj = new URL(baseUrl);
          messageEndpoint = `${urlObj.origin}${path}`;
        } else {
          messageEndpoint = path;
        }
      }

      // Now send tools/list request
      if (messageEndpoint) {
        const rpcRequest = {
          jsonrpc: '2.0',
          id: nextRpcId(),
          method: 'tools/list',
          params: {},
        };

        fetch(messageEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rpcRequest),
        }).catch((err) => {
          clearTimeout(timeout);
          disconnectMCP();
          reject(new Error(`发送请求失败: ${err instanceof Error ? err.message : String(err)}`));
        });
      }
    });

    es.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data as string);

        // Check for JSON-RPC response with tools
        if (data.result && Array.isArray(data.result.tools)) {
          clearTimeout(timeout);
          disconnectMCP();

          const tools: MCPTool[] = data.result.tools.map((t: Record<string, unknown>) => ({
            name: String(t.name ?? ''),
            description: String(t.description ?? ''),
            parameters: (t.inputSchema as MCPTool['parameters']) ?? {
              type: 'object',
              properties: {},
            },
          }));
          resolve(tools);
          return;
        }

        // Check for JSON-RPC error
        if (data.error) {
          clearTimeout(timeout);
          disconnectMCP();
          reject(new Error(`MCP 错误: ${data.error.message ?? JSON.stringify(data.error)}`));
          return;
        }
      } catch {
        // Not JSON or unexpected format, ignore and wait for next message
      }
    });

    es.onerror = () => {
      // SSE connection error - don't immediately reject, might be reconnecting
      // Only reject if we never got an endpoint
      if (!messageEndpoint) {
        clearTimeout(timeout);
        disconnectMCP();
        reject(new Error('无法连接 MCP 服务器，请确认地址正确且服务器已启动'));
      }
    };
  });
}

/**
 * Execute a single MCP tool call via JSON-RPC over SSE.
 * Uses the same SSE connection pattern as fetchMCPTools.
 */
async function executeMCPTool(sseUrl: string, name: string, args: Record<string, unknown>): Promise<string> {
  const baseUrl = sseUrl.replace(/\/+$/, '');

  return new Promise<string>((resolve, reject) => {
    const timeout = setTimeout(() => {
      disconnectMCP();
      reject(new Error('工具调用超时（30秒）'));
    }, 30000);

    const es = new EventSource(baseUrl);
    sseConnections.push(es);

    let messageEndpoint = '';

    es.addEventListener('endpoint', (event) => {
      const path = (event.data as string).trim();
      if (path) {
        messageEndpoint = path.startsWith('/')
          ? `${new URL(baseUrl).origin}${path}`
          : path;
      }

      if (messageEndpoint) {
        const rpcRequest = {
          jsonrpc: '2.0',
          id: nextRpcId(),
          method: 'tools/call',
          params: {
            name,
            arguments: args,
          },
        };

        fetch(messageEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(rpcRequest),
        }).catch((err) => {
          clearTimeout(timeout);
          disconnectMCP();
          reject(new Error(`工具调用请求失败: ${err instanceof Error ? err.message : String(err)}`));
        });
      }
    });

    es.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data as string);

        if (data.result !== undefined) {
          clearTimeout(timeout);
          disconnectMCP();

          // MCP tool result format: { content: [{ type: "text", text: "..." }], isError?: boolean }
          const result = data.result;
          if (Array.isArray(result.content)) {
            const text = result.content
              .map((c: { type: string; text?: string }) => (c.type === 'text' ? c.text : JSON.stringify(c)))
              .join('\n');
            resolve(text);
          } else if (typeof result === 'string') {
            resolve(result);
          } else {
            resolve(JSON.stringify(result, null, 2));
          }
          return;
        }

        if (data.error) {
          clearTimeout(timeout);
          disconnectMCP();
          reject(new Error(`MCP 工具调用错误: ${data.error.message ?? JSON.stringify(data.error)}`));
          return;
        }
      } catch {
        // Not JSON, ignore
      }
    });

    es.onerror = () => {
      if (!messageEndpoint) {
        clearTimeout(timeout);
        disconnectMCP();
        reject(new Error('无法连接 MCP 服务器'));
      }
    };
  });
}

/**
 * Send a chat message using OpenAI-compatible API with streaming + MCP tool loop
 */
export async function sendChatMessage(userMessage: string): Promise<void> {
  const store = useAIStore.getState();
  const { config, messages, mcpTools } = store;

  if (!config.apiBase || !config.apiKey || !config.model) {
    store.addMessage({
      role: 'assistant',
      content: '⚠️ 请先配置 AI 助手。点击设置按钮填写接口地址、API Key 和模型名称。',
    });
    return;
  }

  // Add user message
  store.addMessage({ role: 'user', content: userMessage });
  store.setGenerating(true);

  // Add empty assistant message for streaming
  store.addMessage({ role: 'assistant', content: '' });

  try {
    // Build message history for API (exclude system messages in store, will add manually)
    const historyMessages = messages
      .filter((m) => m.role !== 'system')
      .map((m): Record<string, unknown> => ({
        role: m.role,
        content: m.content,
        ...(m.toolCallId ? { tool_call_id: m.toolCallId } : {}),
        ...(m.toolName ? { name: m.toolName } : {}),
      }));

    const apiMessages: Record<string, unknown>[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...historyMessages,
      { role: 'user', content: userMessage },
    ];

    // Normalize API base URL
    let apiBase = config.apiBase.replace(/\/+$/, '');
    if (!apiBase.endsWith('/chat/completions')) {
      if (!apiBase.endsWith('/v1')) {
        apiBase += '/v1';
      }
      apiBase += '/chat/completions';
    }

    // Convert MCP tools to OpenAI function format
    const openAITools = (config.enableMCP && mcpTools.length > 0)
      ? mcpTools.map((t) => ({
          type: 'function',
          function: {
            name: t.name,
            description: t.description,
            parameters: t.parameters,
          },
        }))
      : undefined;

    // Tool calling loop (max 5 rounds)
    let loopCount = 0;
    const MAX_LOOPS = 5;

    while (loopCount < MAX_LOOPS) {
      loopCount++;

      const requestBody: Record<string, unknown> = {
        model: config.model,
        messages: apiMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 4096,
        ...(openAITools ? { tools: openAITools, tool_choice: 'auto' } : {}),
      };

      const response = await fetch(apiBase, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API 请求失败 (${response.status}): ${errorText.slice(0, 200)}`);
      }

      // Stream response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法读取响应流');

      const decoder = new TextDecoder();
      let fullContent = '';
      let fullReasoning = '';
      let buffer = '';
      // Collect tool_calls from streaming delta
      const toolCallsAccumulator: Map<number, { id: string; name: string; arguments: string }> = new Map();
      let finishReason = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            const delta = json.choices?.[0]?.delta;
            const fr = json.choices?.[0]?.finish_reason;
            if (fr) finishReason = fr;
            if (!delta) continue;

            // reasoning_content (DeepSeek-R1 / thinking models)
            if (delta.reasoning_content) {
              fullReasoning += delta.reasoning_content;
              store.updateLastAssistantMessage(fullContent, fullReasoning);
            }

            // normal content
            if (delta.content) {
              fullContent += delta.content;
              store.updateLastAssistantMessage(fullContent, fullReasoning || undefined);
            }

            // tool_calls delta (streaming accumulation)
            if (delta.tool_calls) {
              for (const tcDelta of delta.tool_calls) {
                const idx: number = tcDelta.index ?? 0;
                if (!toolCallsAccumulator.has(idx)) {
                  toolCallsAccumulator.set(idx, { id: tcDelta.id ?? '', name: '', arguments: '' });
                }
                const tc = toolCallsAccumulator.get(idx)!;
                if (tcDelta.id) tc.id = tcDelta.id;
                if (tcDelta.function?.name) tc.name += tcDelta.function.name;
                if (tcDelta.function?.arguments) tc.arguments += tcDelta.function.arguments;
              }
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      // Check if we need to execute tool calls
      const pendingToolCalls = Array.from(toolCallsAccumulator.values()).filter((tc) => tc.name);

      if (pendingToolCalls.length > 0 && config.enableMCP && config.mcpServerUrl) {
        // Show tool calls in UI
        const uiToolCalls: ToolCallItem[] = pendingToolCalls.map((tc) => ({
          id: tc.id,
          name: tc.name,
          arguments: tc.arguments,
          status: 'pending' as const,
        }));
        store.updateLastAssistantMessage(fullContent, fullReasoning || undefined, uiToolCalls);

        // Add assistant message with tool_calls to API history
        apiMessages.push({
          role: 'assistant',
          content: fullContent || null,
          tool_calls: pendingToolCalls.map((tc) => ({
            id: tc.id,
            type: 'function',
            function: { name: tc.name, arguments: tc.arguments },
          })),
        });

        // Execute each tool call via MCP
        for (const tc of pendingToolCalls) {
          store.updateLastToolCallStatus(tc.id, 'running');

          let toolResult = '';
          try {
            const args = JSON.parse(tc.arguments || '{}');
            toolResult = await executeMCPTool(config.mcpServerUrl, tc.name, args);
            store.updateLastToolCallStatus(tc.id, 'done', toolResult);
          } catch (e) {
            toolResult = `工具调用出错: ${e instanceof Error ? e.message : String(e)}`;
            store.updateLastToolCallStatus(tc.id, 'error', toolResult);
          }

          // Add tool result to API history
          apiMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: toolResult,
          });
        }

        // Add a new empty assistant message for the next streaming round
        store.addMessage({ role: 'assistant', content: '' });
        continue; // Loop again to get final answer
      }

      // No tool calls — we have the final answer
      if (!fullContent && !fullReasoning && pendingToolCalls.length === 0) {
        store.updateLastAssistantMessage('（未收到有效回复，请检查配置）');
      }
      break; // Done
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : '未知错误';
    store.updateLastAssistantMessage(`❌ 请求出错：${errMsg}`);
  } finally {
    store.setGenerating(false);
  }
}
