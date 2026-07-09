import type { Project } from "@/types";

export const todoApp: Project = {
  id: "todo-app",
  title: "Todo App",
  description:
    "A CRUD todo app with a custom hook, localStorage persistence and filter state. Practice hooks, types and event handlers.",
  difficulty: "medium",
  accent: "✅",
  tags: ["React", "Hooks", "TypeScript"],
  files: [
    {
      id: "todo-types",
      path: "types/todo.ts",
      language: "ts",
      difficulty: "easy",
      code: `export type TodoFilter = "all" | "active" | "completed";

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}
`,
    },
    {
      id: "todo-storage",
      path: "lib/storage.ts",
      language: "ts",
      difficulty: "medium",
      code: `import type { Todo } from "@/types/todo";

const STORAGE_KEY = "todos";

export function loadTodos(): Todo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Todo[]) : [];
  } catch {
    return [];
  }
}

export function saveTodos(todos: Todo[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
`,
    },
    {
      id: "todo-add",
      path: "components/add-todo.tsx",
      language: "tsx",
      difficulty: "medium",
      code: `"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

interface AddTodoProps {
  onAdd: (title: string) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onAdd(value);
    setValue("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 rounded-lg border border-slate-200 px-4 py-2 text-sm"
      />
      <button
        type="submit"
        className="inline-flex items-center gap-1 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
      >
        <Plus size={16} />
        Add
      </button>
    </form>
  );
}
`,
    },
    {
      id: "todo-item",
      path: "components/todo-item.tsx",
      language: "tsx",
      difficulty: "medium",
      code: `"use client";

import { Check, Trash2 } from "lucide-react";
import type { Todo } from "@/types/todo";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onRemove }: TodoItemProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-slate-200 px-4 py-3">
      <button
        type="button"
        onClick={() => onToggle(todo.id)}
        className="flex h-5 w-5 items-center justify-center rounded border border-slate-300"
      >
        {todo.completed && <Check size={14} />}
      </button>

      <span
        className={
          todo.completed
            ? "flex-1 text-sm text-slate-400 line-through"
            : "flex-1 text-sm text-slate-800"
        }
      >
        {todo.title}
      </span>

      <button
        type="button"
        onClick={() => onRemove(todo.id)}
        className="text-slate-400 hover:text-red-500"
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
}
`,
    },
    {
      id: "todo-use-todos",
      path: "hooks/use-todos.ts",
      language: "ts",
      difficulty: "hard",
      code: `"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Todo, TodoFilter } from "@/types/todo";
import { loadTodos, saveTodos } from "@/lib/storage";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");

  useEffect(() => {
    setTodos(loadTodos());
  }, []);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback((title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        title: trimmed,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }, []);

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.completed);
    if (filter === "completed") return todos.filter((t) => t.completed);
    return todos;
  }, [todos, filter]);

  const remaining = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos],
  );

  return {
    todos: visibleTodos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    removeTodo,
    remaining,
  };
}
`,
    },
    {
      id: "todo-list",
      path: "components/todo-list.tsx",
      language: "tsx",
      difficulty: "hard",
      code: `"use client";

import { useTodos } from "@/hooks/use-todos";
import { AddTodo } from "./add-todo";
import { TodoItem } from "./todo-item";
import type { TodoFilter } from "@/types/todo";

const filters: TodoFilter[] = ["all", "active", "completed"];

export function TodoList() {
  const {
    todos,
    filter,
    setFilter,
    addTodo,
    toggleTodo,
    removeTodo,
    remaining,
  } = useTodos();

  return (
    <div className="mx-auto max-w-md space-y-4 p-6">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <AddTodo onAdd={addTodo} />

      <div className="flex gap-2">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={
              filter === item
                ? "rounded-md bg-slate-900 px-3 py-1 text-xs text-white"
                : "rounded-md px-3 py-1 text-xs text-slate-500"
            }
          >
            {item}
          </button>
        ))}
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onRemove={removeTodo}
          />
        ))}
      </ul>

      <p className="text-sm text-slate-500">{remaining} items left</p>
    </div>
  );
}
`,
    },
  ],
};
