export type SearchScope = "all" | "restaurants" | "dishes" | "reviews";

export interface GlobalSearchRestaurant {
  id: string;
  name: string;
  description: string | null;
  city: string;
  state: string;
  road: string;
  tags: string[];
  ratingAvg: number;
  totalReviews: number;
  createdAt: string;
}

export interface GlobalSearchDish {
  id: string;
  name: string;
  description: string | null;
  ingredients: string[];
  tags: string[];
  price: number | null;
  ratingAvg: number;
  totalReviews: number;
  createdAt: string;
  restaurant: {
    id: string;
    name: string;
  };
}

export interface GlobalSearchReview {
  id: string;
  rating: number;
  comment: string | null;
  tags: string[];
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
  restaurant: {
    id: string;
    name: string;
  };
  dish: {
    id: string;
    name: string;
  } | null;
}

export type GlobalSearchCombinedItem =
  | {
      type: "restaurant";
      createdAt: string;
      data: GlobalSearchRestaurant;
    }
  | {
      type: "dish";
      createdAt: string;
      data: GlobalSearchDish;
    }
  | {
      type: "review";
      createdAt: string;
      data: GlobalSearchReview;
    };

export interface GlobalSearchResults {
  searchTerm: string;
  restaurantId: string | null;
  scope: SearchScope;
  restaurants: {
    total: number;
    data: GlobalSearchRestaurant[];
  };
  dishes: {
    total: number;
    data: GlobalSearchDish[];
  };
  reviews: {
    total: number;
    data: GlobalSearchReview[];
  };
  combined: GlobalSearchCombinedItem[];
  summary: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface GlobalSearchQueryParams {
  searchTerm: string;
  restaurantId?: string;
  scope?: SearchScope;
  page?: number;
  limit?: number;
  sortOrder?: "asc" | "desc";
}
