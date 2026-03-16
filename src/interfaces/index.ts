import { z } from "zod";

export interface GenericData<T> {
	data: T;
	success: boolean;
	message: string;
}

export interface AuthSuccessResponse {
	token: string;
	admin: {
		id: number;
		name: string;
		email: string;
	};
}

export interface LoginResponse {
	success: boolean;
	message: string;
	data: {
		token: string;
		admin: {
			id: number;
			name: string;
			email: string;
		};
	};
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

export interface Login {
	email: string
	password: string
}

export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export enum QuestionType {
	FREE_TEXT = "FREE_TEXT",
	RADIO = "RADIO",
	RANGE = "RANGE",
}

export interface Question {
	id?: string;
	type: QuestionType;
	text: string;
	options: { label: string }[];
}

export interface Questionnaire {
	id: string;
	title: string;
	questions: Question[];
	createdAt: string;
	adminId: number;
}

export const questionSchema = z.object({
	type: z.nativeEnum(QuestionType),
	text: z.string().min(1, "Question text is required"),
	options: z.array(z.object({ label: z.string() })),
});

export const questionnaireSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().optional(),
	questions: z.array(questionSchema).min(1, "At least one question is required"),
});

export type QuestionnaireFormData = z.infer<typeof questionnaireSchema>;

export interface AdminQuestionnaire {
	id: number;
	title: string;
	description: string;
	slug: string;
	questionCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface AdminQuestionnairesResponse {
	success: boolean;
	data: AdminQuestionnaire[];
	count: number;
}

export interface AnswerResponse {
	questionId: number;
	value: string;
}

export interface SubmitResponsePayload {
	email: string;
	answers: AnswerResponse[];
}