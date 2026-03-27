export interface IReviewUser {
  id: string;
  name: string;
  email: string;
}

export interface IReviewRestaurant {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface IReviewDish {
  id: string;
  name: string;
  restaurantId: string;
}

export interface IReviewLike {
  id: string;
  userId: string;
}

export interface IRecentReview {
  id: string;
  rating: number;
  comment: string | null;
  images: string[];
  userId: string;
  restaurantId: string;
  dishId: string;
  createdAt: string;
  updatedAt: string;
  user: IReviewUser;
  restaurant: IReviewRestaurant;
  dish: IReviewDish;
  likes: IReviewLike[];
}