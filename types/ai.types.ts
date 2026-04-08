export interface IAIChatPayload {
	query: string;
	maxPrice?: number;
	top?: number;
}

export interface IAIChatRecommendation {
	dishName: string;
	restaurantName: string;
	price: number | null;
	rating: number;
	reason: string;
}

export interface IAIChatResult {
	allowed: boolean;
	answer: string;
	recommendations: IAIChatRecommendation[];
	confidence: "high" | "medium" | "low";
}

export interface IAIReviewDescriptionPayload {
	title?: string;
	rating: number;
	tags?: string[];
	dishName: string;
	restaurantName: string;
	restaurantRatingAvg: number;
	dishRating: number;
}

export interface IAIReviewDescriptionResult {
	description: string;
	tone: "positive" | "balanced" | "critical";
	highlights: string[];
}

export interface IAISearchSuggestionsPayload {
	query: string;
	limit?: number;
}

export interface IAISearchSuggestionsResult {
	suggestions: string[];
	source?: "database" | "hybrid";
}