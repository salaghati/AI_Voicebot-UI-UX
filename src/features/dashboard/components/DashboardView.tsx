"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, BarChart3, Bot, Clock3, Phone, RefreshCw, X } from "lucide-react";
import { toast } from "sonner";
import { fetchCampaigns, fetchInbounds, fetchReportOverview } from "@/lib/api-client";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { AsyncState } from "@/components/shared/async-state";
import { cn } from "@/lib/utils";

type WidgetId =
  | "queue-hour"
  | "queue-week"
  | "outbound-hour"
  | "inbound-ext"
  | "intent-top"
  | "handover"
  | "campaign-success"
  | "stt-accuracy"
  | "api-latency";

function Widget({
  title,
  icon: Icon,
  onHide,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onHide: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#d6dce5] bg-white">
      <div className="flex items-center justify-between border-b border-[#d6dce5] bg-[#f8fafc] px-3 py-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-[#4a5568]" />
          <h3 className="text-sm font-semibold text-[#283648]">{title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded p-1 text-[#5a6572] hover:bg-[#eef3f9]"
            onClick={() => toast.success(`Đã làm mới widget: ${title}`)}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded p-1 text-[#5a6572] hover:bg-[#eef3f9]"
            onClick={onHide}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div className="h-[250px] p-3">{children}</div>
    </div>
  );
}

function LineChart({
  values,
  color,
  labels,
}: {
  values: number[];
  color: string;
  labels: string[];
}) {
  const max = Math.max(...values, 1);
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 100;
      const y = 90 - (value / max) * 72;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="flex h-full flex-col">
      <div className="relative h-[190px] rounded-md border border-[#e5eaf2] bg-white p-2">
        <svg viewBox="0 0 100 100" className="h-full w-full">
          <line x1="0" y1="90" x2="100" y2="90" stroke="#d5dde8" strokeWidth="0.6" />
          <line x1="0" y1="60" x2="100" y2="60" stroke="#edf1f7" strokeWidth="0.4" />
          <line x1="0" y1="30" x2="100" y2="30" stroke="#edf1f7" strokeWidth="0.4" />
          <polyline fill="none" stroke={color} strokeWidth="2.2" points={points} />
          {values.map((value, index) => {
            const cx = (index / Math.max(values.length - 1, 1)) * 100;
            const cy = 90 - (value / max) * 72;
            return <circle key={`${index}-${value}`} cx={cx} cy={cy} r="1.4" fill={color} />;
          })}
        </svg>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center text-[11px] text-[var(--text-dim)]">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function GroupedBars({
  labels,
  inbound,
  outbound,
}: {
  labels: string[];
  inbound: number[];
  outbound: number[];
}) {
  const max = Math.max(...inbound, ...outbound, 1);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 rounded-md border border-[#e5eaf2] bg-white p-3">
        <div className="flex h-full items-end gap-2">
          {labels.map((label, index) => (
            <div key={label} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-[170px] items-end gap-1">
                <div
                  className="w-2 rounded-t bg-[#3b82f6]"
                  style={{ height: `${Math.max(8, (inbound[index] / max) * 160)}px` }}
                />
                <div
                  className="w-2 rounded-t bg-[#10b981]"
                  style={{ height: `${Math.max(8, (outbound[index] / max) * 160)}px` }}
                />
              </div>
              <span className="text-[10px] text-[var(--text-dim)]">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1 text-[var(--text-dim)]">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#3b82f6]" /> Inbound
        </span>
        <span className="flex items-center gap-1 text-[var(--text-dim)]">
          <span className="inline-block h-2.5 w-2.5 rounded-sm bg-[#10b981]" /> Outbound
        </span>
      </div>
    </div>
  );
}

function HorizontalBars({ data }: { data: Array<{ label: string; value: number; color: string }> }) {
  const max = Math.max(...data.map((item) => item.value), 1);
  return (
    <div className="space-y-3 rounded-md border border-[#e5eaf2] bg-white p-3">
      {data.map((item) => (
        <div key={item.label} className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--text-main)]">{item.label}</span>
            <span className="font-semibold text-[var(--text-dim)]">{item.value}</span>
          </div>
          <div className="h-2 rounded bg-[#edf1f7]">
            <div
              className="h-2 rounded"
              style={{ width: `${Math.max(5, (item.value / max) * 100)}%`, background: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({
  data,
}: {
  data: Array<{ label: string; value: number; color: string }>;
}) {
  const total = Math.max(
    1,
    data.reduce((sum, item) => sum + item.value, 0),
  );
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const chartSegments = data.map((segment, index) => {
    const ratio = segment.value / total;
    const dash = circumference * ratio;
    const previousDash = data
      .slice(0, index)
      .reduce((sum, item) => sum + (item.value / total) * circumference, 0);
    return {
      ...segment,
      strokeDasharray: `${dash} ${circumference - dash}`,
      strokeDashoffset: -previousDash,
    };
  });

  return (
    <div className="flex h-full items-center gap-4 rounded-md border border-[#e5eaf2] bg-white p-3">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} stroke="#edf1f7" strokeWidth="14" fill="none" />
        {chartSegments.map((segment) => {
          return (
            <circle
              key={segment.label}
              cx="70"
              cy="70"
              r={radius}
              stroke={segment.color}
              strokeWidth="14"
              fill="none"
              strokeDasharray={segment.strokeDasharray}
              strokeDashoffset={segment.strokeDashoffset}
              transform="rotate(-90 70 70)"
            />
          );
        })}
        <text x="70" y="66" textAnchor="middle" className="fill-[#253447] text-[10px] font-semibold">
          Tỷ lệ
        </text>
        <text x="70" y="82" textAnchor="middle" className="fill-[#253447] text-[14px] font-bold">
          {Math.round((data[0]?.value / total) * 100)}%
        </text>
      </svg>

      <div className="space-y-2 text-xs">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: item.color }} />
              {item.label}
            </span>
            <span className="font-semibold">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardView() {
  const [hiddenWidgets, setHiddenWidgets] = useState<WidgetId[]>([]);
  const overview = useQuery({ queryKey: ["overview"], queryFn: () => fetchReportOverview() });
  const campaigns = useQuery({
    queryKey: ["dashboard-campaigns"],
    queryFn: () => fetchCampaigns({ page: 1, pageSize: 6 }),
  });
  const inbounds = useQuery({
    queryKey: ["dashboard-inbounds"],
    queryFn: () => fetchInbounds({ page: 1, pageSize: 6 }),
  });

  const callsByHour = [42, 38, 51, 66, 72, 78, 69];
  const outboundByHour = [35, 33, 39, 55, 61, 58, 52];
  const weeklyInbound = [430, 472, 505, 489, 528, 560, 544];
  const weeklyOutbound = [388, 417, 451, 430, 466, 489, 503];
  const sttAccuracy = [89.1, 89.8, 90.4, 91.2, 90.6, 91.8, 92.1];
  const apiLatency = [380, 420, 395, 448, 405, 372, 360];

  const intentData = useMemo(
    () => [
      { label: "tra_cuoc", value: 342, color: "#3b82f6" },
      { label: "khieu_nai", value: 196, color: "#f59e0b" },
      { label: "thanh_toan", value: 174, color: "#10b981" },
      { label: "handover", value: 128, color: "#8b5cf6" },
    ],
    [],
  );

  const handoverData = useMemo(
    () => [
      { label: "Khách yêu cầu gặp người thật", value: 83, color: "#ef4444" },
      { label: "API timeout / lỗi nghiệp vụ", value: 47, color: "#f59e0b" },
      { label: "Không nhận diện intent", value: 33, color: "#3b82f6" },
      { label: "STT confidence thấp", value: 19, color: "#8b5cf6" },
    ],
    [],
  );

  const campaignSuccess = useMemo(
    () =>
      (campaigns.data?.data.items ?? []).slice(0, 4).map((item) => ({
        label: item.name.length > 18 ? `${item.name.slice(0, 18)}...` : item.name,
        value: Math.round(item.successRate),
        color: "#10b981",
      })),
    [campaigns.data?.data.items],
  );

  const extensionLoad = useMemo(
    () =>
      (inbounds.data?.data.items ?? []).map((item, index) => ({
        label: `Ext ${item.extension}`,
        value: 50 + index * 11,
        color: index % 2 === 0 ? "#3b82f6" : "#06b6d4",
      })),
    [inbounds.data?.data.items],
  );

  const outcomeData = useMemo(() => {
    const success = overview.data?.data.successCalls ?? 0;
    const failed = overview.data?.data.failedCalls ?? 0;
    const transferred = Math.max(0, (overview.data?.data.totalCalls ?? 0) - success - failed);
    return [
      { label: "Thành công", value: success, color: "#10b981" },
      { label: "Thất bại", value: failed, color: "#ef4444" },
      { label: "Chuyển agent", value: transferred, color: "#3b82f6" },
    ];
  }, [overview.data?.data.failedCalls, overview.data?.data.successCalls, overview.data?.data.totalCalls]);

  if (overview.isLoading || campaigns.isLoading || inbounds.isLoading) {
    return <AsyncState state="loading" />;
  }

  if (overview.isError || campaigns.isError || inbounds.isError) {
    return <AsyncState state="error" onRetry={() => window.location.reload()} />;
  }

  const hideWidget = (id: WidgetId, label: string) => {
    setHiddenWidgets((prev) => [...prev, id]);
    toast.success(`Đã ẩn widget "${label}"`);
  };

  const widgetHidden = (id: WidgetId) => hiddenWidgets.includes(id);

  return (
    <div className="space-y-4">
      <PageHeader
        title="Dashboard"
        description="Bảng widget theo dõi vận hành AI Voicebot theo thời gian thực: cuộc gọi, intent, API, STT và handover."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              setHiddenWidgets([]);
              toast.success("Đã hiển thị lại toàn bộ widget");
            }}
          >
            Hiển thị lại widget
          </Button>
        }
      />

      <section className="grid gap-3 xl:grid-cols-3">
        {!widgetHidden("queue-hour") ? (
          <Widget
            title="Cuộc gọi vào hàng đợi (7 giờ gần nhất)"
            icon={Phone}
            onHide={() => hideWidget("queue-hour", "Cuộc gọi vào hàng đợi")}
          >
            <LineChart
              values={callsByHour}
              color="#3b82f6"
              labels={["08h", "09h", "10h", "11h", "12h", "13h", "14h"]}
            />
          </Widget>
        ) : null}

        {!widgetHidden("queue-week") ? (
          <Widget
            title="Inbound/Outbound theo tuần"
            icon={BarChart3}
            onHide={() => hideWidget("queue-week", "Inbound/Outbound theo tuần")}
          >
            <GroupedBars
              labels={["T2", "T3", "T4", "T5", "T6", "T7", "CN"]}
              inbound={weeklyInbound}
              outbound={weeklyOutbound}
            />
          </Widget>
        ) : null}

        {!widgetHidden("outbound-hour") ? (
          <Widget
            title="Cuộc gọi ra (7 giờ gần nhất)"
            icon={Phone}
            onHide={() => hideWidget("outbound-hour", "Cuộc gọi ra")}
          >
            <LineChart
              values={outboundByHour}
              color="#10b981"
              labels={["08h", "09h", "10h", "11h", "12h", "13h", "14h"]}
            />
          </Widget>
        ) : null}

        {!widgetHidden("inbound-ext") ? (
          <Widget
            title="Tải cuộc gọi theo máy nhánh"
            icon={Clock3}
            onHide={() => hideWidget("inbound-ext", "Tải cuộc gọi theo máy nhánh")}
          >
            <HorizontalBars
              data={extensionLoad.length ? extensionLoad : [{ label: "Ext 801", value: 64, color: "#3b82f6" }]}
            />
          </Widget>
        ) : null}

        {!widgetHidden("intent-top") ? (
          <Widget
            title="Top intent được nhận diện"
            icon={Bot}
            onHide={() => hideWidget("intent-top", "Top intent")}
          >
            <HorizontalBars data={intentData} />
          </Widget>
        ) : null}

        {!widgetHidden("handover") ? (
          <Widget
            title="Handover sang agent (theo lý do)"
            icon={AlertTriangle}
            onHide={() => hideWidget("handover", "Handover sang agent")}
          >
            <HorizontalBars data={handoverData} />
          </Widget>
        ) : null}

        {!widgetHidden("campaign-success") ? (
          <Widget
            title="Hiệu suất chiến dịch outbound"
            icon={BarChart3}
            onHide={() => hideWidget("campaign-success", "Hiệu suất chiến dịch outbound")}
          >
            <HorizontalBars
              data={
                campaignSuccess.length
                  ? campaignSuccess
                  : [{ label: "Campaign mẫu", value: 67, color: "#10b981" }]
              }
            />
          </Widget>
        ) : null}

        {!widgetHidden("stt-accuracy") ? (
          <Widget
            title="Độ chính xác STT theo ngày"
            icon={Bot}
            onHide={() => hideWidget("stt-accuracy", "Độ chính xác STT")}
          >
            <LineChart
              values={sttAccuracy}
              color="#8b5cf6"
              labels={["T2", "T3", "T4", "T5", "T6", "T7", "CN"]}
            />
          </Widget>
        ) : null}

        {!widgetHidden("api-latency") ? (
          <Widget
            title="Sức khỏe API và outcome cuộc gọi"
            icon={BarChart3}
            onHide={() => hideWidget("api-latency", "Sức khỏe API")}
          >
            <div className="grid h-full gap-3 lg:grid-rows-[1fr_auto]">
              <div className="rounded-md border border-[#e5eaf2] bg-white p-2">
                <LineChart
                  values={apiLatency}
                  color="#f59e0b"
                  labels={["T2", "T3", "T4", "T5", "T6", "T7", "CN"]}
                />
              </div>
              <div className={cn("rounded-md border border-[#e5eaf2] bg-white p-2")}>
                <DonutChart data={outcomeData} />
              </div>
            </div>
          </Widget>
        ) : null}
      </section>

      {hiddenWidgets.length > 0 ? (
        <Card className="flex items-center justify-between">
          <p className="text-sm text-[var(--text-dim)]">
            Đang ẩn {hiddenWidgets.length} widget. Bấm &quot;Hiển thị lại widget&quot; để khôi phục.
          </p>
          <Button variant="secondary" onClick={() => setHiddenWidgets([])}>
            Khôi phục tất cả
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
