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
  restaurant?: {
    id: string;
    name: string;
    city?: string;
    state?: string;
  };
  reviews?: {
    id: string;
    rating: number;
    comment?: string | null;
    createdAt?: string;
    user?: {
      id: string;
      name: string;
    };
  }[];
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

export interface ICreateDishPayload {
  name: string;
  description?: string;
  price: number;
  restaurantId: string;
}

export interface IUpdateDishPayload {
  name?: string;
  description?: string;
  price?: number;
}

export interface IDishDetails extends IDish {
  description: string;
  price: number;
  ratingAvg: number;
  totalReviews: number;
  image: string;
}
