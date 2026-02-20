import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  trend,
  up = true,
}: {
  title: string;
  value: string;
  trend?: string;
  up?: boolean;
}) {
  return (
    <Card>
      <p className="text-xs uppercase tracking-wide text-[var(--text-dim)]">{title}</p>
      <p className="mt-2 text-2xl font-bold text-[var(--text-main)]">{value}</p>
      {trend ? (
        <p className={cn("mt-3 inline-flex items-center gap-1 text-xs", up ? "text-emerald-600" : "text-red-600")}>
          {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />} {trend}
        </p>
      ) : null}
    </Card>
  );
}
