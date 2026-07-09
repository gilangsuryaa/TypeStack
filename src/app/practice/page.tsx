"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSessionStore } from "@/stores/session-store";
import { TypingSession } from "@/features/typing";

export default function PracticePage() {
  const router = useRouter();
  const project = useSessionStore((s) => s.project);
  const file = useSessionStore((s) => s.file);

  useEffect(() => {
    if (!project || !file) {
      router.replace("/projects");
    }
  }, [project, file, router]);

  if (!project || !file) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <TypingSession key={file.id} project={project} file={file} />
    </div>
  );
}
