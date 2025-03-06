import { z } from "zod";

export interface GenericData<T> {
	data: T;
}

export interface AuthSuccessResponse {
	accessToken: string;
	refreshToken: string;
}

export const signupSchema = z.object({
	firstName: z.string().min(1, "First name is required"),
	lastName: z.string().min(1, "Last name is required"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignupFormData = z.infer<typeof signupSchema>;


export interface UserData {
	firstName: string;
	lastName: string;
	email: string;
}