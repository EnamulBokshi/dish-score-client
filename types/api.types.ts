export interface ApiResponse<TData = unknown> {
  success: boolean;
  data: TData;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}


export interface ApiErrorResponse {
    success: boolean;
    message: string;
}