import { UserRole } from "./enums";

export interface ITestimonialUser {
	id: string;
	name: string;
	email?: string;
	role?: UserRole;
	profilePhoto?: string | null;
	image?: string | null;
}

export interface ITestimonial {
	id: string;
	title?: string | null;
	feedback: string;
	rating: number;
	userId: string;
	createdAt: string;
	updatedAt: string;
	user: ITestimonialUser;
}

export interface ITestimonialQueryParams {
	page?: number | string;
	limit?: number | string;
	searchTerm?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	rating?: number | string;
	userId?: string;
	createdAt?: string;
}

export interface ICreateTestimonialPayload {
	title?: string;
	feedback: string;
	rating: number;
}