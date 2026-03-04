import { z } from "zod";

// ─── API Response shapes ─────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface LoginResponse {
  token: string;
  admin: Admin;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
}

// ─── Auth ─────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ─── Questionnaires (Admin) ───────────────────────────────────

export type QuestionType = "FREE_TEXT" | "RADIO" | "RANGE";

export interface QuestionOption {
  label: string;
  minValue?: number;
  maxValue?: number;
}

export interface QuestionInput {
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
}

export interface QuestionnaireInput {
  title: string;
  description: string;
  questions: QuestionInput[];
}

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
}

export interface Questionnaire {
  id: number;
  title: string;
  description: string;
  slug: string;
  questions: Question[];
  createdAt?: string;
}

// ─── Public Quiz ──────────────────────────────────────────────

export interface CheckEmailRequest {
  email: string;
}

export interface AnswerInput {
  questionId: number;
  value: string;
}

export interface SubmitResponseRequest {
  email: string;
  answers: AnswerInput[];
}
