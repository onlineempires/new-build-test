import { CheckCircle, Clock } from "lucide-react";
import type { LessonProgress } from "./types";

interface CompleteToggleProps {
  progress: LessonProgress;
  onToggle: (next: boolean) => void;
}

export function CompleteToggle({ progress, onToggle }: CompleteToggleProps) {
  const canComplete = progress.watchedPct >= 90;
  
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2">
        {progress.completed ? (
          <CheckCircle className="h-5 w-5 text-emerald-400" />
        ) : (
          <Clock className="h-5 w-5 text-blue-400" />
        )}
        <span className="text-white/90">
          {progress.completed 
            ? "Completed" 
            : canComplete 
            ? "Ready to complete" 
            : "Watch to 90% to unlock"}
        </span>
      </div>
      <button
        disabled={!canComplete}
        onClick={() => onToggle(!progress.completed)}
        className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        {progress.completed ? "Undo" : "Mark as Complete"}
      </button>
    </div>
  );
}