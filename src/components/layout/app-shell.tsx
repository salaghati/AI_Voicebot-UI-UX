"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, UserCircle2 } from "lucide-react";
import { primaryNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_100%_0%,rgba(24,144,255,0.1),transparent_38%),#f0f2f5]">
      <div className="mx-auto flex w-full max-w-[1600px] gap-4 p-4 lg:p-6">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 flex-col overflow-hidden rounded-3xl border border-[#123f78] bg-[linear-gradient(165deg,#103a78_0%,#11539f_48%,#1673cc_100%)] p-5 text-slate-100 shadow-[0_22px_40px_rgba(10,33,74,0.3)] lg:flex lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div>
            <h1 className="text-xl font-bold">AI Voicebot Portal</h1>
          </div>

          <nav className="mt-8 min-w-0 flex-1 space-y-2 overflow-y-auto overflow-x-hidden pr-1">
            {primaryNav.map((item) => {
              const activeSelf = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const activeChild = item.children?.some(
                (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
              );
              const active = activeSelf || Boolean(activeChild);
              const Icon = item.icon;
              return (
                <div key={item.href} className="min-w-0 space-y-1">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                      active ? "bg-white/20 text-white font-semibold" : "text-slate-100 hover:bg-white/14",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate">{item.title}</span>
                  </Link>
                  {item.children?.length ? (
                    <div className="min-w-0 space-y-1 border-l border-white/20 pl-2.5">
                      {item.children.map((child) => {
                        const childActive =
                          pathname === child.href || pathname.startsWith(`${child.href}/`);
                        return (
                          <Link
                            key={child.href}
                            href={child.href}
                            className={cn(
                              "block w-full min-w-0 truncate rounded-lg px-2.5 py-1.5 text-sm transition",
                              childActive
                                ? "bg-white/16 text-white font-semibold"
                                : "text-slate-100/95 hover:bg-white/14",
                            )}
                          >
                            {child.title}
                          </Link>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="rounded-xl bg-white/14 p-3 text-xs text-slate-100">
            <p className="font-semibold">Build prototype v1</p>
            <p className="mt-1 opacity-80">Phase 1: Ops flow end-to-end</p>
          </div>
        </aside>

        <div className="flex min-h-[calc(100vh-2rem)] flex-1 flex-col gap-4 rounded-3xl border border-[#d5deea] bg-[var(--surface-1)] p-4 shadow-[0_14px_34px_rgba(14,33,57,0.08)] lg:p-6">
          <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e3e8ef] bg-[var(--surface-2)] p-3">
            <div className="relative min-w-[280px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-[var(--text-dim)]" />
              <Input className="pl-9" placeholder="Tìm campaign, workflow, số điện thoại..." />
            </div>

            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-[var(--line)] bg-white p-2 text-[var(--text-dim)]">
                <Bell className="h-4 w-4" />
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-[var(--line)] bg-white px-3 py-2 text-sm">
                <UserCircle2 className="h-4 w-4 text-[var(--accent)]" />
                admin@voicebot.vn
              </div>
            </div>
          </header>
          {children}
        </div>
      </div>
    </div>
  );
}
