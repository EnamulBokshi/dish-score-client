"use server";

import { httpClient } from "@/lib/httpClient";
import { ApiResponse } from "@/types/api.types";
import {
  IContactMessage,
  IContactQueryParams,
  IReplyContactPayload,
  IUpdateContactStatusPayload,
} from "@/types/contact.types";

function parseQueryString(queryString?: string): Record<string, unknown> | undefined {
  if (!queryString) {
    return undefined;
  }

  const params = new URLSearchParams(queryString);
  const parsed: Record<string, unknown> = {};

  params.forEach((value, key) => {
    parsed[key] = value;
  });

  return Object.keys(parsed).length > 0 ? parsed : undefined;
}

export async function getContacts(
  query?: IContactQueryParams | string,
): Promise<ApiResponse<IContactMessage[]>> {
  try {
    const params =
      typeof query === "string"
        ? parseQueryString(query)
        : (query as Record<string, unknown> | undefined);

    const response = await httpClient.get<IContactMessage[]>("/contact-us", {
      params,
    });

    return {
      success: response.success,
      data: Array.isArray(response.data) ? response.data : [],
      message: response.message,
      meta: response.meta,
    };
  } catch (error) {
    console.error("Failed to fetch contact requests:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch contact requests",
    };
  }
}

export async function replyContact(
  contactId: string,
  payload: IReplyContactPayload,
): Promise<IContactMessage> {
  const response = await httpClient.post<IContactMessage>(
    `/contact-us/${encodeURIComponent(contactId)}/reply`,
    payload,
  );
  return response.data;
}

export async function updateContactStatus(
  contactId: string,
  payload: IUpdateContactStatusPayload,
): Promise<IContactMessage> {
  const response = await httpClient.patch<IContactMessage>(
    `/contact-us/${encodeURIComponent(contactId)}/status`,
    payload,
  );
  return response.data;
}

export async function deleteContact(contactId: string): Promise<IContactMessage> {
  const response = await httpClient.delete<IContactMessage>(
    `/contact-us/${encodeURIComponent(contactId)}`,
  );
  return response.data;
}
