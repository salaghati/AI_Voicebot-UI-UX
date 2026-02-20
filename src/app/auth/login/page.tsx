import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_8%_10%,rgba(24,144,255,0.16),transparent_36%),radial-gradient(circle_at_88%_22%,rgba(24,144,255,0.12),transparent_42%),#f0f2f5] p-6">
      <div className="grid w-full max-w-6xl gap-6 overflow-hidden rounded-3xl border border-[#c7d5e2] bg-white shadow-[0_22px_60px_rgba(14,32,63,0.18)] lg:grid-cols-[1.15fr_1fr]">
        <section className="relative overflow-hidden bg-[linear-gradient(145deg,#0e3a78_0%,#1253a0_42%,#1677d8_100%)] p-8 text-white">
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-100">UI/UX Figma Flow</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">AI Voicebot Console</h1>
            <p className="mt-4 max-w-xl text-sm text-cyan-50/95">
              Bản tương tác theo slide: Login, Dashboard, Bot Engine, Workflow, KB, Settings, Report, Preview.
            </p>
            <div className="mt-8 grid gap-3 text-sm">
              <div className="rounded-xl border border-white/20 bg-white/12 px-4 py-3">Màu sắc và bố cục bám sát bản trình chiếu</div>
              <div className="rounded-xl border border-white/20 bg-white/12 px-4 py-3">Nút thao tác thật: tạo mới, lưu, filter, chuyển tab</div>
              <div className="rounded-xl border border-white/20 bg-white/12 px-4 py-3">Không bao gồm module research app</div>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-20 -top-16 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-14 left-8 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />
        </section>

        <section className="flex items-center justify-center bg-[#f8fbfd] p-6 lg:p-10">
          <LoginForm />
        </section>
      </div>
    </main>
  );
}
