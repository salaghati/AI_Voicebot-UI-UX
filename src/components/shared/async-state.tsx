import { Ban, Database, Loader2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function AsyncState({
  state,
  message,
  onRetry,
}: {
  state: "loading" | "empty" | "error" | "forbidden";
  message?: string;
  onRetry?: () => void;
}) {
  const meta = {
    loading: {
      icon: <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />,
      title: "Đang tải dữ liệu",
      desc: "Hệ thống đang lấy dữ liệu mới nhất.",
    },
    empty: {
      icon: <Database className="h-8 w-8 text-[var(--text-dim)]" />,
      title: "Chưa có dữ liệu",
      desc: "Bạn có thể tạo mới hoặc đổi bộ lọc để xem kết quả.",
    },
    error: {
      icon: <TriangleAlert className="h-8 w-8 text-red-500" />,
      title: "Đã xảy ra lỗi",
      desc: message || "Không thể tải dữ liệu từ mock API.",
    },
    forbidden: {
      icon: <Ban className="h-8 w-8 text-amber-500" />,
      title: "Không có quyền truy cập",
      desc: message || "Tài khoản hiện tại chưa được cấp quyền cho màn hình này.",
    },
  }[state];

  return (
    <Card className="flex min-h-72 flex-col items-center justify-center gap-4 text-center">
      {meta.icon}
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-main)]">{meta.title}</h3>
        <p className="mt-1 text-sm text-[var(--text-dim)]">{meta.desc}</p>
      </div>
      {onRetry && state !== "loading" ? <Button onClick={onRetry}>Thử lại</Button> : null}
    </Card>
  );
}
