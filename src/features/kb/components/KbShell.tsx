import { ReactNode } from "react";
import { PageHeader } from "@/components/shared/page-header";

export function KbShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <PageHeader title={title} description={description} actions={actions} />
      {children}
    </div>
  );
}
