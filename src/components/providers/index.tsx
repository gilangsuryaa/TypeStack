"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </QueryProvider>
    </ThemeProvider>
  );
}
