import axios from "axios";

import { ICreateTestimonialPayload, ITestimonial } from "@/types/testimonial.types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!baseUrl) {
	throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
}

export async function createTestimonial(payload: ICreateTestimonialPayload): Promise<ITestimonial> {
	try {
		const response = await axios.post(`${baseUrl}/testimonials`, payload, {
			withCredentials: true,
		});

		const result = response.data;

		if (!result?.success) {
			throw new Error(result?.message || "Failed to create testimonial");
		}

		return result.data as ITestimonial;
	} catch (error: any) {
		const message = error?.response?.data?.message || error?.message || "Failed to create testimonial";
		throw new Error(String(message));
	}
}