import axios from "axios";

import { IRegisterPayload } from "@/zod/auth.schema";

type RegisterInput = Omit<IRegisterPayload, "confirmPassword">;

export async function signUpWithEmail(payload: RegisterInput, image?: File | null) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));

  if (image) {
    formData.append("image", image);
  }

  const response = await axios.post(`${baseUrl}/auth/sign-up/email`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
