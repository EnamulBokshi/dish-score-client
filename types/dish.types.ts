export interface ITrendingDishRestaurant {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface IDish {
  id: string;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  restaurantId: string;
  ratingAvg?: number;
  totalReviews?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITrendingDishReview {
  id: string;
  rating: number;
}

export interface ITrendingDish {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  restaurantId: string;
  ratingAvg: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  restaurant: ITrendingDishRestaurant;
  reviews: ITrendingDishReview[];
}
