import z from "zod";

export const createTestimonialZodSchema = z.object({
	title: z.string().trim().max(120, "Title must be at most 120 characters").optional(),
	feedback: z.string().trim().min(10, "Feedback must be at least 10 characters"),
	rating: z
		.number()
		.int("Rating must be a whole number")
		.min(1, "Rating must be at least 1")
		.max(5, "Rating must be at most 5"),
});

export type ICreateTestimonialForm = z.infer<typeof createTestimonialZodSchema>;