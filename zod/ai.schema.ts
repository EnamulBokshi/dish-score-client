import z from "zod";

export const aiChatRequestSchema = z.object({
	query: z.string().trim().min(2, "Query is required").max(300, "Query is too long"),
	maxPrice: z.number().positive("Max price must be positive").optional(),
	top: z.number().int().min(1).max(5).optional(),
});

export const aiReviewDescriptionRequestSchema = z.object({
	title: z.string().trim().min(1).max(120).optional(),
	rating: z.number().int().min(1).max(5),
	tags: z.array(z.string().trim().min(1)).max(15).optional(),
	dishName: z.string().trim().min(1).max(120),
	restaurantName: z.string().trim().min(1).max(120),
	restaurantRatingAvg: z.number().min(0).max(5),
	dishRating: z.number().min(0).max(5),
});

export const aiSearchSuggestionsRequestSchema = z.object({
	query: z.string().trim().min(1, "Query is required").max(60),
	limit: z.number().int().min(1).max(10).optional(),
});