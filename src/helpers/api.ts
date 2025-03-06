import {
	AuthSuccessResponse,
	GenericData,
	SignupFormData,
	UserData
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