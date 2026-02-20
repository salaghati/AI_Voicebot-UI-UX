"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Pagination({ total, page, pageSize }: { total: number; page: number; pageSize: number }) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const setPage = (nextPage: number) => {
    const q = new URLSearchParams(params.toString());
    q.set("page", String(nextPage));
    router.push(`${pathname}?${q.toString()}`);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-[var(--text-dim)]">
        Trang {page}/{totalPages} • Tổng {total} bản ghi
      </p>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
          Trước
        </Button>
        <Button variant="secondary" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
          Sau
        </Button>
      </div>
    </div>
  );
}
