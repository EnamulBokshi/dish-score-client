export type ContactMessageStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

export interface ICreateContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface IContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
  respondedAt: string | null;
}

export interface IContactQueryParams {
  searchTerm?: string;
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  id?: string;
  email?: string;
  status?: ContactMessageStatus;
  createdAt?: string;
}

export interface IReplyContactPayload {
  subject: string;
  message: string;
}

export interface IUpdateContactStatusPayload {
  status: ContactMessageStatus;
}
