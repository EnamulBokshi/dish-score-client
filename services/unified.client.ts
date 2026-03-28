import { UserRole } from "@/types/enums";

export interface IUnifiedCreatePayload {
  restaurant: {
    data: {
      name: string;
      description?: string;
      address: string;
      city: string;
      state: string;
      road: string;
      location: {
        lat: number | string;
        lng: number | string;
      };
      contact?: string;
      tags?: string[];
    };
  };
  dish: {
    data: {
      name: string;
      description?: string;
      price?: number;
      ingredients: string[];
      tags?: string[];
      image?: string;
    };
  };
  review: {
    data: {
      rating: number;
      comment?: string;
      tags?: string[];
    };
  };
}

interface IUnifiedCreateResponse {
  success: boolean;
  message?: string;
  data?: unknown;
}

export async function createUnifiedReviewTransaction(input: {
  payload: IUnifiedCreatePayload;
  restaurantImages: File[];
  dishImages: File[];
  reviewImages: File[];
  userRole?: UserRole;
}) {
  if (input.userRole && input.userRole !== UserRole.CONSUMER) {
    throw new Error("Only consumers can create a unified review.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  }

  const formData = new FormData();
  formData.append("data", JSON.stringify(input.payload));

  for (const image of input.restaurantImages) {
    formData.append("restaurantImages", image);
  }

  for (const image of input.dishImages) {
    formData.append("dishImages", image);
  }

  for (const image of input.reviewImages) {
    formData.append("reviewImages", image);
  }

  const response = await fetch(`${baseUrl}/unified/create-all`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = (await response.json().catch(() => null)) as IUnifiedCreateResponse | null;

  if (!response.ok || !result?.success) {
    const message = result?.message || "Failed to create unified review";
    throw new Error(message);
  }

  return result.data;
}
