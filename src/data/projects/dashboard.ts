import type { Project } from "@/types";

export const dashboard: Project = {
  id: "admin-dashboard",
  title: "Admin Dashboard",
  description:
    "A data-heavy admin panel: sidebar navigation, stat cards, a customers table, a chart, a modal and a typed fetch layer.",
  difficulty: "hard",
  accent: "📊",
  tags: ["Next.js", "Data Table", "Charts"],
  files: [
    {
      id: "dash-types",
      path: "types/dashboard.ts",
      language: "ts",
      difficulty: "easy",
      code: `export interface Metric {
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  status: "active" | "churned" | "trial";
  revenue: number;
}
`,
    },
    {
      id: "dash-sidebar",
      path: "components/sidebar.tsx",
      language: "tsx",
      difficulty: "medium",
      code: `"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Settings, BarChart3 } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-slate-200 p-4">
      <p className="px-3 text-lg font-bold">Acme Inc</p>

      <nav className="mt-6 space-y-1">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              data-active={active}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 data-[active=true]:bg-slate-100 data-[active=true]:text-slate-900"
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
`,
    },
    {
      id: "dash-stat-card",
      path: "components/stat-card.tsx",
      language: "tsx",
      difficulty: "medium",
      code: `import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Metric } from "@/types/dashboard";

export function StatCard({ metric }: { metric: Metric }) {
  const positive = metric.trend === "up";

  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <p className="text-sm text-slate-500">{metric.label}</p>
      <p className="mt-2 text-2xl font-semibold">{metric.value}</p>

      <div className="mt-2 flex items-center gap-1 text-sm">
        {positive ? (
          <ArrowUpRight size={16} className="text-emerald-500" />
        ) : (
          <ArrowDownRight size={16} className="text-red-500" />
        )}
        <span className={positive ? "text-emerald-600" : "text-red-600"}>
          {metric.change}%
        </span>
        <span className="text-slate-400">vs last month</span>
      </div>
    </div>
  );
}
`,
    },
    {
      id: "dash-modal",
      path: "components/modal.tsx",
      language: "tsx",
      difficulty: "medium",
      code: `"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="text-slate-400">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
`,
    },
    {
      id: "dash-chart",
      path: "components/revenue-chart.tsx",
      language: "tsx",
      difficulty: "hard",
      code: `"use client";

const data = [
  { month: "Jan", value: 42 },
  { month: "Feb", value: 55 },
  { month: "Mar", value: 48 },
  { month: "Apr", value: 71 },
  { month: "May", value: 66 },
  { month: "Jun", value: 88 },
];

export function RevenueChart() {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="rounded-xl border border-slate-200 p-6">
      <h3 className="text-sm font-semibold text-slate-700">Revenue</h3>

      <div className="mt-6 flex h-48 items-end gap-3">
        {data.map((point) => (
          <div
            key={point.month}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <div
              className="w-full rounded-t bg-slate-900"
              style={{ height: (point.value / max) * 100 + "%" }}
            />
            <span className="text-xs text-slate-400">{point.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
`,
    },
    {
      id: "dash-table",
      path: "components/data-table.tsx",
      language: "tsx",
      difficulty: "hard",
      code: `import type { Customer } from "@/types/dashboard";

const statusStyles: Record<Customer["status"], string> = {
  active: "bg-emerald-100 text-emerald-700",
  churned: "bg-red-100 text-red-700",
  trial: "bg-amber-100 text-amber-700",
};

export function DataTable({ customers }: { customers: Customer[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-left text-slate-500">
          <tr>
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-t border-slate-100">
              <td className="px-4 py-3 font-medium">{customer.name}</td>
              <td className="px-4 py-3 text-slate-500">{customer.email}</td>
              <td className="px-4 py-3">
                <span
                  className={"rounded-full px-2 py-0.5 text-xs " + statusStyles[customer.status]}
                >
                  {customer.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">\${customer.revenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`,
    },
    {
      id: "dash-api",
      path: "services/api.ts",
      language: "ts",
      difficulty: "hard",
      code: `const API_BASE = "/api";

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, signal } = options;

  const response = await fetch(API_BASE + path, {
    method,
    signal,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new ApiError("Request failed", response.status);
  }

  return (await response.json()) as T;
}

export const api = {
  get: <T>(path: string, signal?: AbortSignal) => request<T>(path, { signal }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body }),
};
`,
    },
  ],
};
