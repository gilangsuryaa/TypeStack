import type { CodeFile, Difficulty, Project } from "@/types";
import { landingPage } from "./landing-page";
import { todoApp } from "./todo-app";
import { dashboard } from "./dashboard";
import { ecommerce } from "./ecommerce";
import { saasAi } from "./saas-ai";

/** All projects, ordered from easiest to most complex. */
export const projects: Project[] = [
  landingPage,
  todoApp,
  dashboard,
  ecommerce,
  saasAi,
];

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getFile(
  projectId: string,
  fileId: string,
): { project: Project; file: CodeFile } | undefined {
  const project = getProject(projectId);
  const file = project?.files.find((f) => f.id === fileId);
  if (!project || !file) return undefined;
  return { project, file };
}

/** Files across every project matching a difficulty (for quick practice). */
export function filesByDifficulty(difficulty: Difficulty): Array<{
  project: Project;
  file: CodeFile;
}> {
  return projects.flatMap((project) =>
    project.files
      .filter((file) => file.difficulty === difficulty)
      .map((file) => ({ project, file })),
  );
}
