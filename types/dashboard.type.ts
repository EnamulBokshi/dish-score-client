export interface NavItem {
    label: string;
    href: string;
    icon: string;
}


export interface NavSection {
    title?: string;
    items: NavItem[];
    
}

export interface PieChartData {
    status: string;
    count: number;
}

export interface BarChartData{
    month: Date;
    count: number;
}

export interface IRatingBucket {
    rating: number;
    count: number;
}

export interface IMonthlyCountItem {
    month: string;
    count: number;
}

export interface IConsumerLikeWiseReviewItem {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    likeCount: number;
}

export interface IConsumerDashboardStats {
    totalReviewsWritten: number;
    totalLikes: number;
    totalDishes: number;
    totalRestaurants: number;
    likeWiseReviews: IConsumerLikeWiseReviewItem[];
}

export interface IUserStatsSummary {
    totalAdmin: number;
    totalConsumer: number;
    totalOwner: number;
    totalSuperAdmin: number;
}

export interface IAdminDashboardStats {
    userStats: IUserStatsSummary;
    totalReviews: number;
    totalRestaurants: number;
    ratingWiseRestaurantBarChart: IRatingBucket[];
    ratingWiseDishBarChart: IRatingBucket[];
    monthlyReviewCreations: IMonthlyCountItem[];
    monthlyUserRegistration: IMonthlyCountItem[];
}

export interface IOwnerDashboardStats {
    totalDishes: number;
    avgRating: number;
    ratingWiseDishesBarChart: IRatingBucket[];
}

export type DashboardStatsResponse =
    | IConsumerDashboardStats
    | IAdminDashboardStats
    | IOwnerDashboardStats;