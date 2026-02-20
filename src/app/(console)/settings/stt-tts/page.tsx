"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchSttTtsSettings, updateSttTtsSettings } from "@/lib/api-client";
import { SettingsShell } from "@/features/settings";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";

export default function SttTtsSettingsPage() {
  const form = useForm({
    defaultValues: {
      sttProvider: "Google Cloud ST",
      sttLanguage: "Tiếng Việt (vi-VN)",
      sttModel: "Enhanced (Chính xác cao)",
      ttsProvider: "Google Cloud TT",
      ttsVoice: "vi-VN-Wavenet-A",
      ttsSpeed: "1.0",
      ttsPitch: "0",
      vadSilence: "500",
      vadTimeout: "1500",
      vadMinSpeech: "200",
      vad: "true",
      voice: "vi-VN-Wavenet-A",
    },
  });

  const query = useQuery({ queryKey: ["settings-stt-tts"], queryFn: fetchSttTtsSettings });
  const ttsSpeed = useWatch({ control: form.control, name: "ttsSpeed" });
  const ttsPitch = useWatch({ control: form.control, name: "ttsPitch" });

  useEffect(() => {
    if (query.data?.data) {
      const data = query.data.data;
      form.reset({
        sttProvider: data.sttProvider,
        sttLanguage: "Tiếng Việt (vi-VN)",
        sttModel: "Enhanced (Chính xác cao)",
        ttsProvider: data.ttsProvider,
        ttsVoice: data.voice,
        ttsSpeed: "1.0",
        ttsPitch: "0",
        vadSilence: "500",
        vadTimeout: "1500",
        vadMinSpeech: "200",
        vad: data.vad ? "true" : "false",
        voice: data.voice,
      });
    }
  }, [query.data?.data, form]);

  const mutation = useMutation({
    mutationFn: updateSttTtsSettings,
    onSuccess: () => toast.success("Lưu cấu hình STT/TTS/VAD thành công"),
    onError: () => toast.error("Lưu cấu hình thất bại"),
  });

  return (
    <SettingsShell
      title="STT/TTS/VAD"
      description="Cấu hình nhận diện giọng nói, tổng hợp giọng nói và ngưỡng VAD"
      section="STT/TTS/VAD"
    >
      {query.isLoading ? <AsyncState state="loading" /> : null}
      {query.isError ? <AsyncState state="error" onRetry={() => query.refetch()} /> : null}
      {!query.isLoading && !query.isError ? (
        <form
          className="grid gap-4 xl:grid-cols-3"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <Card className="space-y-4">
            <div className="border-b border-[var(--line)] pb-3">
              <h3 className="text-2xl font-bold">STT (Speech-to-Text)</h3>
              <p className="text-sm text-[var(--text-dim)]">Configure voice recognition settings</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Provider</label>
                <Select {...form.register("sttProvider")}>
                  <option>Google Cloud ST</option>
                  <option>Deepgram</option>
                  <option>Azure STT</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Ngôn ngữ</label>
                <Select {...form.register("sttLanguage")}>
                  <option>Tiếng Việt (vi-VN)</option>
                  <option>English (en-US)</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Model</label>
                <Select {...form.register("sttModel")}>
                  <option>Enhanced (Chính xác cao)</option>
                  <option>Standard</option>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="border-b border-[var(--line)] pb-3">
              <h3 className="text-2xl font-bold">TTS (Text-to-Speech)</h3>
              <p className="text-sm text-[var(--text-dim)]">Configure voice synthesis settings</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Provider</label>
                <Select {...form.register("ttsProvider")}>
                  <option>Google Cloud TT</option>
                  <option>ElevenLabs</option>
                  <option>Azure TTS</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Voice</label>
                <Select {...form.register("ttsVoice")}>
                  <option>vi-VN-Wavenet-A</option>
                  <option>vi-VN-Wavenet-B</option>
                  <option>vi-VN-Wavenet-C</option>
                </Select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tốc độ (Speed)</label>
                <Input type="range" min="0.5" max="1.5" step="0.1" {...form.register("ttsSpeed")} />
                <p className="mt-1 text-right text-sm text-[var(--accent)]">{ttsSpeed}x</p>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Pitch</label>
                <Input type="range" min="-10" max="10" step="1" {...form.register("ttsPitch")} />
                <p className="mt-1 text-right text-sm text-[var(--accent)]">{ttsPitch}</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => toast.success("Đang test voice mẫu (mock)")}
              >
                Test Voice
              </Button>
            </div>
          </Card>

          <Card className="space-y-4">
            <div className="border-b border-[var(--line)] pb-3">
              <h3 className="text-2xl font-bold">VAD (Voice Activity)</h3>
              <p className="text-sm text-[var(--text-dim)]">Configure silence detection thresholds</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Silence Threshold (ms)</label>
                <Input type="number" {...form.register("vadSilence")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">End-of-speech Timeout (ms)</label>
                <Input type="number" {...form.register("vadTimeout")} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Min Speech Duration (ms)</label>
                <Input type="number" {...form.register("vadMinSpeech")} />
              </div>
              <div className="rounded-lg border border-[#cfe3ff] bg-[#f3f8ff] p-3 text-sm text-[#3768b3]">
                Adjusting these values helps the bot better distinguish between background noise and user speech.
              </div>
            </div>
          </Card>

          <div className="xl:col-span-3 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => form.reset()}>
              Hủy bỏ
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Đang lưu..." : "Lưu cấu hình"}
            </Button>
          </div>
        </form>
      ) : null}
    </SettingsShell>
  );
}
