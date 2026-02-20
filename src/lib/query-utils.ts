import type { FilterParams } from "@/types/domain";

export function parseFilterParams(searchParams: URLSearchParams): FilterParams {
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");
  return {
    search: searchParams.get("search") || undefined,
    status: searchParams.get("status") || undefined,
    type: searchParams.get("type") || undefined,
    sort: searchParams.get("sort") || undefined,
    page: Number.isNaN(page) ? 1 : page,
    pageSize: Number.isNaN(pageSize) ? 10 : pageSize,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    state: searchParams.get("state") || undefined,
  };
}

export function applyFilter<T extends object>(
  items: T[],
  params: FilterParams,
  searchFields: Array<keyof T>,
): T[] {
  let result = items;

  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter((item) =>
      searchFields.some((field) =>
        String((item as Record<string, unknown>)[String(field)] ?? "")
          .toLowerCase()
          .includes(q),
      ),
    );
  }

  if (params.status) {
    result = result.filter(
      (item) => String((item as Record<string, unknown>).status ?? "") === params.status,
    );
  }

  if (params.type) {
    result = result.filter(
      (item) => String((item as Record<string, unknown>).type ?? "") === params.type,
    );
  }

  return result;
}

export function applySort<T extends object>(items: T[], sort?: string): T[] {
  if (!sort) {
    return items;
  }

  const [field, direction] = sort.split(":");
  return [...items].sort((a, b) => {
    const left = String((a as Record<string, unknown>)[field] ?? "");
    const right = String((b as Record<string, unknown>)[field] ?? "");
    if (left < right) {
      return direction === "desc" ? 1 : -1;
    }
    if (left > right) {
      return direction === "desc" ? -1 : 1;
    }
    return 0;
  });
}

export function paginate<T>(items: T[], page = 1, pageSize = 10) {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const start = (safePage - 1) * safePageSize;
  return {
    items: items.slice(start, start + safePageSize),
    total: items.length,
    page: safePage,
    pageSize: safePageSize,
  };
}

export function preserveQuery(basePath: string, query: URLSearchParams) {
  const q = query.toString();
  return q ? `${basePath}?${q}` : basePath;
}
