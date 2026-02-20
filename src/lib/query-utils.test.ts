import {
  applyFilter,
  applySort,
  paginate,
  parseFilterParams,
  preserveQuery,
} from "@/lib/query-utils";

describe("query utils", () => {
  it("parses filter params from URLSearchParams", () => {
    const params = new URLSearchParams("search=abc&page=2&pageSize=5&status=Nháp");
    expect(parseFilterParams(params)).toMatchObject({
      search: "abc",
      page: 2,
      pageSize: 5,
      status: "Nháp",
    });
  });

  it("applies filter, sort and paginate", () => {
    const items = [
      { id: "1", name: "B", status: "Nháp", type: "x" },
      { id: "2", name: "A", status: "Đang chạy", type: "x" },
      { id: "3", name: "C", status: "Nháp", type: "y" },
    ];

    const filtered = applyFilter(items, { search: "a" }, ["name"]);
    expect(filtered).toHaveLength(1);

    const sorted = applySort(items, "name:asc");
    expect(sorted[0].name).toBe("A");

    const paged = paginate(sorted, 1, 2);
    expect(paged.items).toHaveLength(2);
    expect(paged.total).toBe(3);
  });

  it("preserves query while switching tabs", () => {
    const query = new URLSearchParams("search=WF&state=error");
    expect(preserveQuery("/workflow/WF_ThuNo_A/preview/session", query)).toBe(
      "/workflow/WF_ThuNo_A/preview/session?search=WF&state=error",
    );
  });
});
