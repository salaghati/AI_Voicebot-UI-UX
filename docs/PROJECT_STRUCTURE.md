# Project Structure (Refactored)

## Mục tiêu
Cấu trúc được tách theo nghiệp vụ (`features`) để dễ đọc và dễ mở rộng.

## Cây thư mục chính

```text
src/
  app/                 # Next.js routes (chỉ giữ page/route theo URL)
  features/            # Logic + UI theo nghiệp vụ
    auth/
    dashboard/
    bot-engine/
    workflow/
    kb/
    settings/
  components/
    layout/            # Khung app (sidebar, topbar)
    shared/            # Shared blocks (pagination, async-state, header)
    ui/                # Primitive UI (button, input, table...)
  lib/                 # utils, mock db, api client, mapper, validator
  types/               # domain types
```

## Quy ước import
- Route trong `src/app/**` chỉ import từ `@/features/*`, `@/components/*`, `@/lib/*`.
- Component nội bộ trong cùng feature ưu tiên import tương đối (`./Xxx`) để tránh vòng phụ thuộc.
- Các màn hình cùng nghiệp vụ export qua `src/features/<feature>/index.ts`.

## Cách thêm màn mới
1. Tạo page route trong `src/app/(console)/.../page.tsx`.
2. Tạo component nghiệp vụ trong `src/features/<feature>/components`.
3. Export component qua `src/features/<feature>/index.ts`.
4. Page chỉ giữ wiring dữ liệu route-param + render component.

## Ghi chú
- Đã loại bỏ các file prototype cũ không dùng.
- Đã loại bỏ `src/components/modules/*` để tránh trùng lớp abstraction.
