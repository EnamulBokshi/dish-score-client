import axios from "axios";

import { IUpdateOwnerProfilePayload, IUpdateReviewerProfilePayload } from "@/types/profile.types";
import { IUpdateUserPayload } from "@/types/user.types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function updateMyProfile(userId: string, payload: IUpdateUserPayload) {
  const response = await axios.patch(`${baseUrl}/users/${encodeURIComponent(userId)}`, payload, {
    withCredentials: true,
  });

  return response.data;
}

export async function updateMyOwnerProfile(payload: IUpdateOwnerProfilePayload) {
  const response = await axios.patch(`${baseUrl}/profile/me/owner`, payload, {
    withCredentials: true,
  });

  return response.data;
}

export async function updateMyReviewerProfile(payload: IUpdateReviewerProfilePayload) {
  const response = await axios.patch(`${baseUrl}/profile/me/reviewer`, payload, {
    withCredentials: true,
  });

  return response.data;
}
