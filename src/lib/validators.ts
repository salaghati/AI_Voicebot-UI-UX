import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Email không hợp lệ"),
});

export const campaignStep1Schema = z.object({
  name: z.string().min(3, "Tên chiến dịch tối thiểu 3 ký tự"),
  source: z.string().min(1, "Vui lòng chọn nguồn dữ liệu"),
});

export const campaignStep2Schema = z.object({
  workflow: z.string().min(1, "Vui lòng chọn workflow"),
});

export const campaignStep3Schema = z.object({
  schedule: z.string().min(1, "Vui lòng chọn lịch gọi"),
  callerId: z.string().min(1, "Vui lòng chọn caller ID"),
  retryRule: z.string().min(1, "Vui lòng chọn quy tắc gọi lại"),
  note: z.string().optional(),
});

export const inboundStep1Schema = z.object({
  name: z.string().min(3, "Tên inbound tối thiểu 3 ký tự"),
  queue: z.string().min(1, "Vui lòng chọn hàng chờ"),
  extension: z.string().min(1, "Vui lòng chọn extension"),
});

export const inboundStep2Schema = z.object({
  workflow: z.string().min(1, "Vui lòng chọn workflow"),
});

export const inboundStep3Schema = z.object({
  handoverTo: z.string().min(1, "Vui lòng chọn agent hoặc hàng chờ"),
  fallback: z.string().min(1, "Vui lòng chọn fallback"),
  note: z.string().optional(),
});
