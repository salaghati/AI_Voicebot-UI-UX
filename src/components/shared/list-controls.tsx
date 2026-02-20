"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function ListControls({
  statuses,
  types,
}: {
  statuses?: string[];
  types?: string[];
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();

  const model = useMemo(
    () => ({
      search: params.get("search") || "",
      status: params.get("status") || "",
      type: params.get("type") || "",
      sort: params.get("sort") || "",
    }),
    [params],
  );

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (!value) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    if (["search", "status", "type", "sort"].includes(key)) {
      next.set("page", "1");
    }
    router.push(`${pathname}?${next.toString()}`);
  };

  return (
    <div className="grid gap-2 md:grid-cols-4">
      <Input
        placeholder="Tìm kiếm"
        value={model.search}
        onChange={(event) => update("search", event.target.value)}
      />
      <Select value={model.status} onChange={(event) => update("status", event.target.value)}>
        <option value="">Tất cả trạng thái</option>
        {statuses?.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Select>
      <Select value={model.type} onChange={(event) => update("type", event.target.value)}>
        <option value="">Tất cả loại</option>
        {types?.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
      <Select value={model.sort} onChange={(event) => update("sort", event.target.value)}>
        <option value="">Sắp xếp mặc định</option>
        <option value="updatedAt:desc">Mới nhất</option>
        <option value="updatedAt:asc">Cũ nhất</option>
        <option value="name:asc">Tên A-Z</option>
        <option value="name:desc">Tên Z-A</option>
      </Select>
    </div>
  );
}
