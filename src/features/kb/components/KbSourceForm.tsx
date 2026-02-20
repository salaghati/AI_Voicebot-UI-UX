"use client";

import { useEffect, useMemo, useState } from "react";
import type { KbDocument, KbSourceType } from "@/types/domain";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type KbSourceFormProps = {
  sourceType: KbSourceType;
  initialDoc?: KbDocument | null;
  mode: "create" | "edit";
  layout?: "modal" | "inline";
  submitting?: boolean;
  onCancel: () => void;
  onSubmit: (payload: Record<string, unknown>) => void;
};

type FormState = {
  url: string;
  displayName: string;
  crawlMode: "Single Page" | "Entire Site";
  pageLimit: string;
  patterns: string;
  articleTitle: string;
  articleContent: string;
  articleTags: string;
  fileName: string;
  fileTypes: string;
  chunkingMode: "Auto (Recommended)" | "Small chunk" | "Large chunk";
};

function getMeta(sourceType: KbSourceType, mode: "create" | "edit") {
  const action = mode === "create" ? "Add" : "Edit";
  return {
    url: { title: `${action} URL Source`, submitLabel: mode === "create" ? "Add" : "Save" },
    article: { title: `${action} Article Source`, submitLabel: "Save" },
    file: { title: `${action} File Source`, submitLabel: mode === "create" ? "Add" : "Save" },
  }[sourceType];
}

function buildState(sourceType: KbSourceType, initialDoc?: KbDocument | null): FormState {
  return {
    url: initialDoc?.url || "",
    displayName: initialDoc?.displayName || (sourceType === "article" ? "" : initialDoc?.title || ""),
    crawlMode: initialDoc?.crawlMode || "Single Page",
    pageLimit: String(initialDoc?.pageLimit || 100),
    patterns: initialDoc?.patterns || "",
    articleTitle: initialDoc?.articleTitle || (sourceType === "article" ? initialDoc?.title || "" : ""),
    articleContent: initialDoc?.articleContent || "",
    articleTags: initialDoc?.articleTags?.join(", ") || "",
    fileName: initialDoc?.fileName || "",
    fileTypes: initialDoc?.fileTypes || "PDF, DOCX, TXT",
    chunkingMode: initialDoc?.chunkingMode || "Auto (Recommended)",
  };
}

export function KbSourceForm({
  sourceType,
  initialDoc,
  mode,
  layout = "inline",
  submitting = false,
  onCancel,
  onSubmit,
}: KbSourceFormProps) {
  const meta = useMemo(() => getMeta(sourceType, mode), [mode, sourceType]);
  const [values, setValues] = useState<FormState>(() => buildState(sourceType, initialDoc));

  useEffect(() => {
    setValues(buildState(sourceType, initialDoc));
  }, [initialDoc, sourceType]);

  const containerClass =
    layout === "modal"
      ? "fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4"
      : "";

  const cardClass =
    layout === "modal"
      ? "w-full max-w-2xl rounded-[28px] border border-white bg-white p-8 shadow-[0_22px_50px_rgba(15,23,42,0.24)]"
      : "max-w-4xl rounded-3xl border border-[var(--line)] bg-white p-8 shadow-[0_14px_34px_rgba(15,35,70,0.08)]";

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setValues((current) => ({ ...current, [key]: value }));

  const submit = () => {
    const payload =
      sourceType === "url"
        ? {
            sourceType,
            title: values.displayName || values.url || "URL KB mới",
            displayName: values.displayName,
            url: values.url,
            crawlMode: values.crawlMode,
            pageLimit: Number(values.pageLimit || 100),
            patterns: values.patterns,
          }
        : sourceType === "article"
          ? {
              sourceType,
              title: values.articleTitle || "Bài viết mới",
              articleTitle: values.articleTitle,
              articleContent: values.articleContent,
              articleTags: values.articleTags,
            }
          : {
              sourceType,
              title: values.displayName || values.fileName || "File KB mới",
              displayName: values.displayName,
              fileName: values.fileName,
              fileTypes: values.fileTypes,
              chunkingMode: values.chunkingMode,
            };

    onSubmit(payload);
  };

  const content = (
    <Card className={cardClass}>
      <div className="space-y-6">
        <div>
          <h3 className="text-[2rem] font-semibold leading-none text-[#111827]">{meta.title}</h3>
        </div>

        {sourceType === "url" ? (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">URL Source</label>
              <Input
                value={values.url}
                onChange={(event) => update("url", event.target.value)}
                placeholder="https://example.com"
                className="h-12 rounded-xl text-base"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Tên hiển thị</label>
              <Input
                value={values.displayName}
                onChange={(event) => update("displayName", event.target.value)}
                placeholder="Nhập tên hiển thị"
                className="h-12 rounded-xl text-base"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Crawl mode</label>
              <div className="flex flex-wrap gap-5 pt-1">
                {(["Single Page", "Entire Site"] as const).map((modeOption) => (
                  <label key={modeOption} className="flex items-center gap-2 text-base text-[#344054]">
                    <input
                      type="radio"
                      name="crawl-mode"
                      checked={values.crawlMode === modeOption}
                      onChange={() => update("crawlMode", modeOption)}
                      className="h-4 w-4 accent-[var(--accent)]"
                    />
                    {modeOption}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Page limit</label>
              <Input
                type="number"
                min={1}
                value={values.pageLimit}
                onChange={(event) => update("pageLimit", event.target.value)}
                placeholder="100"
                className="h-12 rounded-xl text-base"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Patterns</label>
              <Input
                value={values.patterns}
                onChange={(event) => update("patterns", event.target.value)}
                placeholder="Include/Exclude patterns (comma separated)"
                className="h-12 rounded-xl text-base"
              />
            </div>
          </div>
        ) : null}

        {sourceType === "article" ? (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Tiêu đề *</label>
              <Input
                value={values.articleTitle}
                onChange={(event) => update("articleTitle", event.target.value)}
                placeholder="Nhập tiêu đề bài viết"
                className="h-12 rounded-xl text-base"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Nội dung *</label>
              <Textarea
                value={values.articleContent}
                onChange={(event) => update("articleContent", event.target.value)}
                placeholder="Nhập nội dung chi tiết..."
                className="min-h-44 rounded-xl px-4 py-3 text-base"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Tags</label>
              <Input
                value={values.articleTags}
                onChange={(event) => update("articleTags", event.target.value)}
                placeholder="Nhập tags (cách nhau bởi dấu phẩy)"
                className="h-12 rounded-xl text-base"
              />
            </div>
          </div>
        ) : null}

        {sourceType === "file" ? (
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Upload Document</label>
              <button
                type="button"
                onClick={() => {
                  if (!values.fileName) {
                    update("fileName", "customer-handbook.pdf");
                  }
                }}
                className="flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-[#cdd5df] bg-[#fbfcfe] px-4 text-center transition hover:border-[var(--accent)]"
              >
                <span className="text-lg font-semibold text-[var(--accent)]">Click to upload</span>
                <span className="mt-2 text-sm text-[#667085]">or drag and drop</span>
                <span className="mt-2 text-sm text-[#98a2b3]">{values.fileTypes} up to 25MB</span>
                {values.fileName ? (
                  <span className="mt-3 rounded-full bg-[#e9f5ff] px-3 py-1 text-sm font-medium text-[var(--accent)]">
                    {values.fileName}
                  </span>
                ) : null}
              </button>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Tên hiển thị</label>
              <Input
                value={values.displayName}
                onChange={(event) => update("displayName", event.target.value)}
                placeholder="Nhập tên hiển thị"
                className="h-12 rounded-xl text-base"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#344054]">Chunking mode</label>
              <Select
                value={values.chunkingMode}
                onChange={(event) => update("chunkingMode", event.target.value as FormState["chunkingMode"])}
                className="h-12 rounded-xl text-base"
              >
                <option value="Auto (Recommended)">Auto (Recommended)</option>
                <option value="Small chunk">Small chunk</option>
                <option value="Large chunk">Large chunk</option>
              </Select>
            </div>
          </div>
        ) : null}

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="lg" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" size="lg" onClick={submit} disabled={submitting}>
            {submitting ? "Đang lưu..." : meta.submitLabel}
          </Button>
        </div>
      </div>
    </Card>
  );

  if (layout === "modal") {
    return <div className={containerClass}>{content}</div>;
  }

  return content;
}
