import {
  ApiResponse,
  LoginResponse,
  Questionnaire,
  QuestionnaireInput,
  CheckEmailRequest,
  SubmitResponseRequest,
} from "@/interfaces";
import { apiRequest } from "./apiRequest";

// ─── Auth ─────────────────────────────────────────────────────

export const login = async (email: string, password: string) => {
  return apiRequest<ApiResponse<LoginResponse>>({
    method: "POST",
    url: "/api/auth/login",
    data: { email, password },
  });
};

// ─── Admin - Questionnaires ────────────────────────────────────

export const listQuestionnaires = async () => {
  const res = await apiRequest<ApiResponse<Questionnaire[]>>({
    method: "GET",
    url: "/api/admin/questionnaires",
  });
  return res;
};

export const createQuestionnaire = async (data: QuestionnaireInput) => {
  return apiRequest<ApiResponse<Questionnaire>>({
    method: "POST",
    url: "/api/admin/questionnaires",
    data,
  });
};

// ─── Public - Questionnaire ────────────────────────────────────

export const getQuestionnaireBySlug = async (slug: string) => {
  return apiRequest<ApiResponse<Questionnaire>>({
    method: "GET",
    url: `/api/questionnaires/${slug}`,
  });
};

export const checkEmail = async (slug: string, email: string) => {
  return apiRequest<ApiResponse<{ exists: boolean }>>({
    method: "POST",
    url: `/api/questionnaires/${slug}/check-email`,
    data: { email } as CheckEmailRequest,
  });
};

export const submitResponse = async (
  slug: string,
  data: SubmitResponseRequest
) => {
  return apiRequest<ApiResponse<{ id?: number }>>({
    method: "POST",
    url: `/api/questionnaires/${slug}/responses`,
    data,
  });
};
