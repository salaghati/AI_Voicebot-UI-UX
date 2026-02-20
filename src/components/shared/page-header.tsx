import { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-2xl font-bold text-[var(--text-main)]">{title}</h2>
        {description ? <p className="mt-1 text-sm text-[var(--text-dim)]">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
