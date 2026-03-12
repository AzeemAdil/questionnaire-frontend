import {
	AuthSuccessResponse,
	GenericData,
	Login,
	LoginResponse,
	SignupFormData,
	UserData,
	AdminQuestionnairesResponse,
	QuestionnaireFormData
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