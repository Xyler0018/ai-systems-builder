"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bot, Moon, PanelLeftClose, PanelLeftOpen, Plus, Search, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { Button, Input } from "@/components/ui";
import { primaryNav } from "@/lib/module-config";
import { cn } from "@/lib/utils";

export function AppShell({ children, currentWeek }: { children: React.ReactNode; currentWeek?: number | null }) {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const matches = useMemo(
    () =>
      primaryNav.filter((item) => item.label.toLowerCase().includes(query.toLowerCase())).slice(0, 6),
    [query]
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[auto_1fr]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r bg-background/95 backdrop-blur lg:block",
          collapsed ? "w-20" : "w-72"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className={cn("flex items-center gap-3", collapsed && "mx-auto")}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-primary/30 bg-primary/15 text-primary">
              <Bot className="h-5 w-5" aria-hidden="true" />
            </div>
            {!collapsed && (
              <div>
                <div className="text-sm font-semibold tracking-wide">AI Systems Builder</div>
                <div className="text-xs text-muted-foreground">Learning OS</div>
              </div>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed((value) => !value)} aria-label="Toggle sidebar">
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="space-y-1 p-3">
          {primaryNav.map((item) => {
            const active = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition",
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
                title={item.label}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className={cn("min-w-0", collapsed ? "lg:pl-20" : "lg:pl-72")}>
        <header className="sticky top-0 z-30 border-b bg-background/86 backdrop-blur">
          <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
            <div className="relative max-w-xl flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && matches[0]) router.push(matches[0].path);
                }}
                placeholder="Search modules..."
                className="pl-9"
                aria-label="Global search"
              />
              {query && (
                <div className="absolute mt-2 w-full rounded-md border bg-card p-2 shadow-command">
                  {matches.map((match) => (
                    <Link
                      key={match.path}
                      href={match.path}
                      className="block rounded px-3 py-2 text-sm hover:bg-muted"
                      onClick={() => setQuery("")}
                    >
                      {match.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <span className="hidden rounded border px-3 py-2 text-sm text-muted-foreground sm:inline-flex">
              Current week: {currentWeek ?? "Unset"}
            </span>
            <Button asChild variant="secondary">
              <Link href="/tasks">
                <Plus className="h-4 w-4" />
                Quick add
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {mounted ? (
                <>
                  <Sun className="hidden h-4 w-4 dark:block" />
                  <Moon className="h-4 w-4 dark:hidden" />
                </>
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
