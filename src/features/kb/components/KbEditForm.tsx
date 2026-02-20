"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { fetchKbDoc, updateKbDoc } from "@/lib/api-client";
import { KbShell } from "./KbShell";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";
import { KbSourceForm } from "./KbSourceForm";

export function KbEditForm({ kbId }: { kbId: string }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["kb-doc", kbId], queryFn: () => fetchKbDoc(kbId) });
  const item = query.data?.data ?? null;

  const mutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => updateKbDoc(kbId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["kb-list"] }),
        queryClient.invalidateQueries({ queryKey: ["kb-doc", kbId] }),
      ]);
      toast.success(`Đã cập nhật ${kbId}`);
      router.push(`/kb/list/${kbId}`);
    },
    onError: () => toast.error("Không thể cập nhật KB"),
  });

  if (query.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (query.isError) {
    return <AsyncState state="error" onRetry={() => query.refetch()} />;
  }

  if (!item) {
    return <AsyncState state="empty" message="Không tìm thấy KB để chỉnh sửa." />;
  }

  return (
    <KbShell
      title={`Chỉnh sửa ${item.title}`}
      description="Biểu mẫu chỉnh sửa sẽ bám theo đúng loại nguồn đã dùng để tạo KB."
      actions={
        <Link href={`/kb/list/${kbId}`}>
          <Button variant="secondary" className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Về chi tiết
          </Button>
        </Link>
      }
    >
      <KbSourceForm
        sourceType={item.sourceType}
        initialDoc={item}
        mode="edit"
        submitting={mutation.isPending}
        onCancel={() => router.push(`/kb/list/${kbId}`)}
        onSubmit={(payload) => mutation.mutate(payload)}
      />
    </KbShell>
  );
}
