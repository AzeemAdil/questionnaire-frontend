import {
	AuthSuccessResponse,
	GenericData,
	Login,
	LoginResponse,
	SignupFormData,
	UserData,
	AdminQuestionnairesResponse,
	QuestionnaireFormData,
	Questionnaire,
	SubmitResponsePayload
} from "@/interfaces";
import { apiRequest } from "./apiRequest";


export const register = async (data: SignupFormData & { userName: string }) => {
	return apiRequest<GenericData<AuthSuccessResponse>>({
		method: "POST",
		url: "/auth/register",
		data,
	});
};


export const getUser = async () => {
	return apiRequest<GenericData<UserData>>({
		method: "GET",
		url: "/user",
	});
};

export const login = async (data: Login) => {
	return apiRequest<LoginResponse>({
		method: "POST",
		url: "/auth/login",
		data
	})
}

export const getAdminQuestionnaires = async () => {
	return apiRequest<AdminQuestionnairesResponse>({
		method: "GET",
		url: "/admin/questionnaires",
	});
};

export const createQuestionnaire = async (data: QuestionnaireFormData) => {
	return apiRequest<AdminQuestionnairesResponse>({
		method: "POST",
		url: "/admin/questionnaires",
		data,
	});
};

export const getPublicQuestionnaire = async (slug: string) => {
	return apiRequest<GenericData<Questionnaire>>({
		method: "GET",
		url: `/questionnaires/${slug}`,
	});
};

export const checkEmailResponse = async (slug: string, email: string) => {
	return apiRequest<GenericData<{ alreadySubmitted: boolean }>>({
		method: "POST",
		url: `/questionnaires/${slug}/check-email`,
		data: { email },
	});
};

export const submitQuestionnaireResponse = async (slug: string, data: SubmitResponsePayload) => {
	return apiRequest<GenericData<any>>({
		method: "POST",
		url: `/questionnaires/${slug}/responses`,
		data,
	});
};