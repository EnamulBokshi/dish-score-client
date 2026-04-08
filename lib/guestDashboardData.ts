import { UserRole } from "@/types/enums";
import { NavSection } from "@/types/dashboard.type";
import { IConsumerDashboardStats, IConsumerLikeWiseReviewItem } from "@/types/dashboard.type";
import { UserInfo } from "@/types/user.types";

export const guestDashboardUserInfo: UserInfo = {
	id: "guest-user",
	name: "Guest Explorer",
	email: "guest@dishscore.app",
	role: UserRole.CONSUMER,
	image: null,
	profilePhoto: null,
};

export const guestDashboardNavSections: NavSection[] = [
	{
		items: [
			{ label: "Overview", href: "/guest-dashboard", icon: "LayoutDashboard" },
			{ label: "Restaurants", href: "/guest-dashboard/restaurants", icon: "Store" },
			{ label: "Dishes", href: "/guest-dashboard/dishes", icon: "Pizza" },
			{ label: "My Reviews", href: "/guest-dashboard/my-reviews", icon: "MessageSquareText" },
			{ label: "Review Stats", href: "/guest-dashboard/review-stats", icon: "BarChart3" },
		],
	},
];

const guestLikeWiseReviews: IConsumerLikeWiseReviewItem[] = [
	{ id: "guest-like-1", rating: 4.8, comment: "Savory and balanced", createdAt: "2026-03-29T10:00:00.000Z", likeCount: 12 },
	{ id: "guest-like-2", rating: 4.5, comment: "Friendly service", createdAt: "2026-04-01T12:10:00.000Z", likeCount: 9 },
	{ id: "guest-like-3", rating: 4.9, comment: "Worth the visit", createdAt: "2026-04-03T14:20:00.000Z", likeCount: 16 },
	{ id: "guest-like-4", rating: 4.2, comment: "Great value", createdAt: "2026-04-05T09:15:00.000Z", likeCount: 5 },
	{ id: "guest-like-5", rating: 4.7, comment: "Will order again", createdAt: "2026-04-06T18:45:00.000Z", likeCount: 11 },
];

export const guestDashboardStats: IConsumerDashboardStats = {
	totalReviewsWritten: 18,
	totalLikes: 42,
	totalDishes: 84,
	totalRestaurants: 29,
	likeWiseReviews: guestLikeWiseReviews,
};

export const guestRestaurants = [
	{
		id: "guest-restaurant-1",
		name: "Golden Spoon Bistro",
		description: "Cozy bistro plates with bright flavors and consistently strong ratings.",
		city: "Austin",
		state: "TX",
		ratingAvg: 4.8,
		totalReviews: 128,
		tags: ["cozy", "brunch", "bistro"],
	},
	{
		id: "guest-restaurant-2",
		name: "Urban Grill House",
		description: "A lively spot known for its smoky mains and crowd-favorite sides.",
		city: "Denver",
		state: "CO",
		ratingAvg: 4.6,
		totalReviews: 96,
		tags: ["grill", "family", "favorites"],
	},
	{
		id: "guest-restaurant-3",
		name: "Coastline Kitchen",
		description: "Light, fresh, and seasonal dishes inspired by coastal comfort food.",
		city: "San Diego",
		state: "CA",
		ratingAvg: 4.7,
		totalReviews: 141,
		tags: ["seafood", "fresh", "seasonal"],
	},
];

export const guestDishes = [
	{
		id: "guest-dish-1",
		name: "Citrus Herb Chicken",
		restaurantName: "Golden Spoon Bistro",
		description: "A bright, balanced plate that keeps diners coming back.",
		price: 18.5,
		ratingAvg: 4.9,
		totalReviews: 42,
		tags: ["popular", "house-special"],
	},
	{
		id: "guest-dish-2",
		name: "Smoked Brisket Bowl",
		restaurantName: "Urban Grill House",
		description: "Hearty and rich, with a standout smoky finish.",
		price: 21,
		ratingAvg: 4.7,
		totalReviews: 37,
		tags: ["comfort", "grilled"],
	},
	{
		id: "guest-dish-3",
		name: "Sea Salt Shrimp Tacos",
		restaurantName: "Coastline Kitchen",
		description: "A fresh and breezy favorite with a little kick.",
		price: 16.25,
		ratingAvg: 4.8,
		totalReviews: 55,
		tags: ["seafood", "fresh"],
	},
];

export const guestReviews = [
	{
		id: "guest-review-1",
		userName: "Taylor M.",
		restaurantName: "Golden Spoon Bistro",
		dishName: "Citrus Herb Chicken",
		rating: 5,
		comment: "Fresh, satisfying, and plated beautifully.",
		createdAt: "2026-04-06T11:30:00.000Z",
		likes: 15,
	},
	{
		id: "guest-review-2",
		userName: "Jordan K.",
		restaurantName: "Urban Grill House",
		dishName: "Smoked Brisket Bowl",
		rating: 4,
		comment: "Big portions and great flavor balance.",
		createdAt: "2026-04-05T16:45:00.000Z",
		likes: 9,
	},
	{
		id: "guest-review-3",
		userName: "Mina S.",
		restaurantName: "Coastline Kitchen",
		dishName: "Sea Salt Shrimp Tacos",
		rating: 5,
		comment: "Light, fresh, and instantly memorable.",
		createdAt: "2026-04-04T19:10:00.000Z",
		likes: 18,
	},
];