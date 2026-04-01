import { UserRole } from "./enums";
import { UserStatus } from "./enums";
import { IReview } from "./review.types";
import { IRestaurant } from "./restaurant.types";

export interface UserInfo{
    id: string | number;
    name: string;
    email: string;
    role: UserRole;
    profilePhoto?: string | null;
}

export interface IUser {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    profilePhoto?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserQueryParams {
    searchTerm?: string;
    page?: number | string;
    limit?: number | string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    role?: UserRole;
    status?: UserStatus;
}

export interface IUpdateUserPayload {
    name?: string;
    email?: string;
    role?: UserRole;
    status?: UserStatus;
}

export interface IUserAdminProfile {
    id: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
}

export interface IUserReviewerProfile {
    id: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
}

export interface IUserOwnerProfile {
    id: string;
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
}

export interface IUserLike {
    id: string;
    userId?: string;
    reviewId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IUserDetails extends IUser {
    admin?: IUserAdminProfile | null;
    reviews?: IReview[];
    likes?: IUserLike[];
    restaurants?: IRestaurant[];
    reviewerProfile?: IUserReviewerProfile | null;
    ownerProfile?: IUserOwnerProfile | null;
}