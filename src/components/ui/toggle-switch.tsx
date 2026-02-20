export function ToggleSwitch({ checked, onChange, disabled }: { checked: boolean; onChange: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); onChange(); }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors ${checked ? "bg-[#10b981]" : "bg-[#cbd5e1]"} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}
