import { IContactMessage, ICreateContactPayload } from "@/types/contact.types";

interface ICreateContactResponse {
	success: boolean;
	message?: string;
	data?: IContactMessage;
}

export async function createContactMessage(payload: ICreateContactPayload): Promise<IContactMessage> {
	const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

	if (!baseUrl) {
		throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
	}

	const response = await fetch(`${baseUrl}/contact-us`, {
		method: "POST",
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	});

	const result = (await response.json().catch(() => null)) as ICreateContactResponse | null;

	if (!response.ok || !result?.success || !result.data) {
		const message = result?.message || "Failed to send contact message";
		throw new Error(message);
	}

	return result.data;
}
