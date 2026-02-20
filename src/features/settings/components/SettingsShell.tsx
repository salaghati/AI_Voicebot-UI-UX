import { ReactNode } from "react";
import { PageHeader } from "@/components/shared/page-header";

export function SettingsShell({
  title,
  description,
  section,
  actions,
  children,
}: {
  title: string;
  description: string;
  section?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-[var(--text-dim)]">
        Home / Setting / <span className="text-[var(--accent)]">{section || title}</span>
      </p>
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </div>
  );
}
