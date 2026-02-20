"use client";

import { useMemo, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";

const script = [
  { speaker: "Bot", content: "Xin chào, em là AI Voicebot hỗ trợ thanh toán.", log: "node:start -> intent_greeting" },
  { speaker: "Khách", content: "Tôi muốn tra số tiền còn nợ.", log: "stt: intent=payment_check confidence=0.96" },
  { speaker: "Bot", content: "Dạ, hệ thống ghi nhận 1.200.000đ cần thanh toán trước 28/02.", log: "api:getDebt -> 200 (42ms)" },
  { speaker: "Khách", content: "Cho tôi phương thức thanh toán nhanh.", log: "kb:match id=KB-100 score=0.91" },
  { speaker: "Bot", content: "Anh/chị có thể chuyển khoản hoặc thanh toán qua ví điện tử.", log: "node:end -> success" },
];

export default function PlaygroundPage() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const transcript = useMemo(() => script.slice(0, index), [index]);

  const next = () => setIndex((value) => Math.min(value + 1, script.length));

  return (
    <div className="space-y-4">
      <PageHeader
        title="Preview/Test - Playground"
        description="Transcript hội thoại, log luồng hoạt động và thông tin kỹ thuật"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => {
                setPlaying(!playing);
                if (!playing) {
                  next();
                }
              }}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {playing ? "Pause" : "Play"}
            </Button>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={() => {
                setIndex(0);
                setPlaying(false);
              }}
            >
              <Square className="h-4 w-4" /> Kết thúc cuộc gọi Preview
            </Button>
          </div>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="space-y-3 lg:col-span-2">
          <h3 className="text-lg font-semibold">Transcript hội thoại</h3>
          <div className="space-y-2">
            {transcript.map((line, i) => (
              <div key={`${line.speaker}-${i}`} className="rounded-xl border border-[var(--line)] bg-white p-3">
                <p className="text-xs text-[var(--text-dim)]">{line.speaker}</p>
                <p className="text-sm">{line.content}</p>
              </div>
            ))}
            {index < script.length ? (
              <Button onClick={next} variant="ghost">
                Hiển thị câu tiếp theo
              </Button>
            ) : null}
          </div>
        </Card>

        <Card className="space-y-3">
          <h3 className="text-lg font-semibold">Log luồng hoạt động</h3>
          <div className="space-y-2">
            {transcript.map((line, i) => (
              <div key={`log-${i}`} className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text-dim)]">
                {line.log}
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-white p-3 text-xs">
            <p>Latency STT: 118ms</p>
            <p>Latency LLM: 522ms</p>
            <p>Latency TTS: 194ms</p>
          </div>
        </Card>
      </section>
    </div>
  );
}
