import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import type { LessonState } from "./types";

interface SidebarItemProps {
  href: string;
  index: number;
  title: string;
  duration: string;
  state: LessonState;
  isActive?: boolean;
}

export function SidebarItem({ href, index, title, duration, state, isActive = false }: SidebarItemProps) {
  return (
    <Link href={href.toLowerCase()} className="block">
      <span className={`flex items-center justify-between gap-3 rounded-lg px-4 py-3 hover:bg-white/5 transition-colors ${
        isActive ? 'bg-blue-600/10 border-l-2 border-blue-500/60 text-white' : 'text-white/80'
      }`}>
        <span className="flex items-center gap-3 min-w-0">
          <span className={`h-6 w-6 shrink-0 rounded-full text-white/80 text-xs grid place-items-center ${
            state === "completed" 
              ? 'bg-emerald-500 text-white' 
              : isActive 
              ? 'bg-blue-600 text-white'
              : state === "ready"
              ? 'bg-white/10'
              : 'bg-white/10 opacity-50'
          }`}>
            {state === "completed" ? (
              <CheckCircle className="h-3 w-3" />
            ) : state === "locked" ? (
              <span className="h-2 w-2 rounded-full bg-white/20" />
            ) : (
              index
            )}
          </span>
          <span className={`truncate ${isActive ? 'font-medium' : ''}`}>{title}</span>
        </span>
        <span className="flex items-center gap-2 text-xs text-white/60">
          {state === "completed" ? (
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          ) : state === "ready" ? (
            <Clock className="h-4 w-4 text-blue-400" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-white/20" />
          )}
          {duration}
        </span>
      </span>
    </Link>
  );
}