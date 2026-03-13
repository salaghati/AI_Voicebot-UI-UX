import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_8%_10%,rgba(24,144,255,0.16),transparent_36%),radial-gradient(circle_at_88%_22%,rgba(24,144,255,0.12),transparent_42%),#f0f2f5] p-6">
      <div className="grid w-full max-w-6xl gap-6 overflow-hidden rounded-3xl border border-[#c7d5e2] bg-white shadow-[0_22px_60px_rgba(14,32,63,0.18)] lg:grid-cols-[1.15fr_1fr]">
        <section className="relative flex min-h-[480px] items-center justify-center overflow-hidden bg-[linear-gradient(155deg,#0a2f63_0%,#10448a_38%,#1b79df_100%)] p-8 text-white lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_82%,rgba(255,255,255,0.16),transparent_0%,transparent_30%),radial-gradient(circle_at_84%_18%,rgba(255,255,255,0.2),transparent_0%,transparent_34%)]" />
          <div className="pointer-events-none absolute inset-y-10 left-10 w-px bg-white/18" />
          <div className="pointer-events-none absolute inset-x-10 top-10 h-px bg-white/14" />
          <div className="pointer-events-none absolute right-[-64px] top-[-44px] h-72 w-72 rounded-full border border-white/14" />
          <div className="pointer-events-none absolute right-10 bottom-10 h-32 w-32 rounded-full border border-white/12" />
          <div className="pointer-events-none absolute left-[-72px] bottom-[-72px] h-56 w-56 rounded-full bg-cyan-300/18 blur-3xl" />
          <div className="pointer-events-none absolute right-[-40px] top-1/3 h-56 w-56 rounded-full bg-white/12 blur-3xl" />

          <div className="relative z-10 flex w-full items-center justify-center">
            <div className="max-w-[520px] text-center">
              <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-white lg:text-6xl">
                AI Voicebot
              </h1>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-[#f8fbfd] p-6 lg:p-10">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
