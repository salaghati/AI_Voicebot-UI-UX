"use client";

import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateFallbackSettings } from "@/lib/api-client";
import { SettingsShell } from "@/features/settings";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function SettingsFallbackPage() {
  const form = useForm({
    defaultValues: {
      sttRetry: "2",
      sttAction: "Phát lỗi xin lỗi + Hỏi lại",
      sttMessage: "Xin lỗi, tôi không nghe rõ. Quý khách vui lòng nói lại ạ.",
      ttsRetry: "1",
      ttsAction: "Dùng TTS backup",
      ttsProvider: "Azure Speech (Backup)",
      llmTimeout: "5000",
      llmAction: "Fallback về KB matching",
      llmSafeMessage: "Xin lỗi quý khách, hệ thống đang bận. Tôi sẽ chuyển quý khách đến nhân viên hỗ trợ.",
      apiRetry: "2",
      apiTimeout: "3000",
      apiAction: "Thông báo lỗi theo kịch bản",
    },
  });

  const mutation = useMutation({
    mutationFn: updateFallbackSettings,
    onSuccess: () => toast.success("Lưu cấu hình Fallback thành công"),
    onError: () => toast.error("Không thể lưu cấu hình Fallback"),
  });

  return (
    <SettingsShell
      title="System / Model Fallback"
      description="Cấu hình xử lý khi STT, TTS, LLM hoặc API gặp lỗi ở tầng model và hạ tầng."
      section="System / Model Fallback"
    >
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-2xl font-bold">Lỗi STT</h3>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Số lần retry</label>
              <Input type="number" {...form.register("sttRetry")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Hành động</label>
              <Select {...form.register("sttAction")}>
                <option>Phát lỗi xin lỗi + Hỏi lại</option>
                <option>Dùng STT backup</option>
                <option>Chuyển tiếp tới Agent</option>
                <option>Kết thúc cuộc gọi</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Câu xin lỗi</label>
              <Textarea {...form.register("sttMessage")} />
            </div>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-2xl font-bold">Lỗi TTS</h3>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Số lần retry</label>
              <Input type="number" {...form.register("ttsRetry")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Hành động</label>
              <Select {...form.register("ttsAction")}>
                <option>Dùng TTS backup</option>
                <option>Phát file âm thanh có sẵn</option>
                <option>Kết thúc cuộc gọi</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">TTS Backup Provider</label>
              <Select {...form.register("ttsProvider")}>
                <option>Azure Speech (Backup)</option>
                <option>Google TTS (Backup)</option>
              </Select>
            </div>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-2xl font-bold">Lỗi LLM</h3>
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Timeout (ms)</label>
              <Input type="number" {...form.register("llmTimeout")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Hành động</label>
              <Select {...form.register("llmAction")}>
                <option>Fallback về KB matching</option>
                <option>Chuyển tiếp tới Agent</option>
                <option>Phát câu an toàn + Kết thúc cuộc gọi</option>
              </Select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Câu an toàn</label>
              <Textarea {...form.register("llmSafeMessage")} />
            </div>
          </Card>

          <Card className="space-y-3">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h3 className="text-2xl font-bold">Lỗi API</h3>
              <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Số lần retry</label>
              <Input type="number" {...form.register("apiRetry")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Timeout request (ms)</label>
              <Input type="number" {...form.register("apiTimeout")} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Hành động</label>
              <Select {...form.register("apiAction")}>
                <option>Thông báo lỗi theo kịch bản</option>
                <option>Bỏ qua và tiếp tục</option>
                <option>Chuyển tiếp tới Agent</option>
              </Select>
            </div>
          </Card>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => form.reset()}>
            Hủy bỏ
          </Button>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Đang lưu..." : "Lưu cấu hình"}
          </Button>
        </div>
      </form>
    </SettingsShell>
  );
}
