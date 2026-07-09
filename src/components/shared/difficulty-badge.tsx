import type { Difficulty } from "@/types";
import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_META } from "@/constants";

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const meta = DIFFICULTY_META[difficulty];
  return <Badge className={meta.className}>{meta.label}</Badge>;
}
