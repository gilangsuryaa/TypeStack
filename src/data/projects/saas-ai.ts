import type { Project } from "@/types";

export const saasAi: Project = {
  id: "saas-ai",
  title: "SaaS AI Dashboard",
  description:
    "The full stack surface: auth UI, a fetch client, TanStack Query hooks, a chat layout, a typed settings form and an app sidebar.",
  difficulty: "extreme",
  accent: "🤖",
  tags: ["TanStack Query", "Auth", "AI Chat"],
  files: [
    {
      id: "saas-types",
      path: "types/chat.ts",
      language: "ts",
      difficulty: "easy",
      code: `export type Role = "user" | "assistant" | "system";

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
}

export interface Conversation {
  id: string;
  title: string;
  model: string;
  messages: Message[];
}
`,
    },
    {
      id: "saas-sidebar",
      path: "components/app-sidebar.tsx",
      language: "tsx",
      difficulty: "medium",
      code: `"use client";

import { MessageSquare, Plus, Settings, Sparkles } from "lucide-react";
import type { Conversation } from "@/types/chat";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
}

export function AppSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-slate-50">
      <div className="flex items-center gap-2 p-4 font-semibold">
        <Sparkles size={18} className="text-indigo-500" />
        Nova AI
      </div>

      <button
        type="button"
        onClick={onCreate}
        className="mx-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <Plus size={16} />
        New chat
      </button>

      <nav className="mt-4 flex-1 space-y-1 overflow-y-auto px-2">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            type="button"
            onClick={() => onSelect(conversation.id)}
            data-active={conversation.id === activeId}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 data-[active=true]:bg-white data-[active=true]:text-slate-900"
          >
            <MessageSquare size={16} />
            <span className="truncate">{conversation.title}</span>
          </button>
        ))}
      </nav>

      <button className="m-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600">
        <Settings size={16} />
        Settings
      </button>
    </aside>
  );
}
`,
    },
    {
      id: "saas-api-client",
      path: "lib/api-client.ts",
      language: "ts",
      difficulty: "hard",
      code: `const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

async function client<T>(
  endpoint: string,
  config: RequestInit = {},
): Promise<T> {
  const token =
    typeof window !== "undefined"
      ? window.localStorage.getItem("token")
      : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {}),
  };

  const response = await fetch(BASE_URL + endpoint, {
    ...config,
    headers: { ...headers, ...config.headers },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Something went wrong");
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string) => client<T>(endpoint),
  post: <T>(endpoint: string, body: unknown) =>
    client<T>(endpoint, { method: "POST", body: JSON.stringify(body) }),
};
`,
    },
    {
      id: "saas-auth-form",
      path: "components/auth-form.tsx",
      language: "tsx",
      difficulty: "hard",
      code: `"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (email: string, password: string) => Promise<void>;
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm text-white disabled:opacity-60"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
`,
    },
    {
      id: "saas-settings-form",
      path: "components/settings-form.tsx",
      language: "tsx",
      difficulty: "hard",
      code: `"use client";

import { useState } from "react";

interface Settings {
  displayName: string;
  model: "gpt-4o" | "claude-sonnet" | "gemini-pro";
  temperature: number;
  streaming: boolean;
}

const models: Array<Settings["model"]> = [
  "gpt-4o",
  "claude-sonnet",
  "gemini-pro",
];

export function SettingsForm() {
  const [settings, setSettings] = useState<Settings>({
    displayName: "",
    model: "claude-sonnet",
    temperature: 0.7,
    streaming: true,
  });

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Display name</label>
        <input
          value={settings.displayName}
          onChange={(event) => set("displayName", event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Model</label>
        <select
          value={settings.model}
          onChange={(event) =>
            set("model", event.target.value as Settings["model"])
          }
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          Temperature: {settings.temperature}
        </label>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={settings.temperature}
          onChange={(event) => set("temperature", Number(event.target.value))}
          className="w-full"
        />
      </div>
    </div>
  );
}
`,
    },
    {
      id: "saas-use-conversations",
      path: "hooks/use-conversations.ts",
      language: "ts",
      difficulty: "extreme",
      code: `"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Conversation } from "@/types/chat";

const KEY = ["conversations"] as const;

export function useConversations() {
  return useQuery({
    queryKey: KEY,
    queryFn: () => apiClient.get<Conversation[]>("/conversations"),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (title: string) =>
      apiClient.post<Conversation>("/conversations", { title }),
    onSuccess: (created) => {
      queryClient.setQueryData<Conversation[]>(KEY, (previous) =>
        previous ? [created, ...previous] : [created],
      );
    },
  });
}
`,
    },
    {
      id: "saas-chat-layout",
      path: "components/chat-layout.tsx",
      language: "tsx",
      difficulty: "extreme",
      code: `"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { Message } from "@/types/chat";

interface ChatLayoutProps {
  messages: Message[];
  onSend: (content: string) => void;
}

export function ChatLayout({ messages, onSend }: ChatLayoutProps) {
  const [draft, setDraft] = useState("");

  function handleSend() {
    const content = draft.trim();
    if (!content) return;
    onSend(content);
    setDraft("");
  }

  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            data-role={message.role}
            className="flex gap-3 data-[role=user]:flex-row-reverse"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-medium">
              {message.role === "user" ? "You" : "AI"}
            </div>
            <div className="max-w-[70%] rounded-2xl bg-slate-100 px-4 py-2 text-sm">
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 p-4">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 p-2">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={1}
            placeholder="Message Nova AI..."
            className="flex-1 resize-none bg-transparent px-2 py-1 text-sm outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            className="rounded-lg bg-slate-900 p-2 text-white"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
`,
    },
  ],
};
