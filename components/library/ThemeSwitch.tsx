"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";

const THEMES = ["light","dark","pink","blue"] as const;
type Theme = typeof THEMES[number];

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>("dark");
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("library:theme") as Theme | null;
      if (saved && THEMES.includes(saved)) setTheme(saved);
    }
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.getElementById("library-root");
      if (root) root.setAttribute("data-theme", theme);
      localStorage.setItem("library:theme", theme);
    }
  }, [theme]);

  return (
    <Select value={theme} onValueChange={v => setTheme(v as Theme)}>
      <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent className="bg-slate-800 border-white/10">
        {THEMES.map(t => (
          <SelectItem 
            key={t} 
            value={t}
            className="text-white hover:bg-white/10"
          >
            {t[0].toUpperCase()+t.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}