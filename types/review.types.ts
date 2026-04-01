export interface IReviewUser {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

export interface IReviewRestaurant {
  id: string;
  name: string;
  city: string;
  state: string;
  image?: string;
}

export interface IReviewDish {
  id: string;
  name: string;
  restaurantId: string;
  image?: string;
}

export interface IReviewLike {
  id: string;
  userId: string;
}

export interface IReview {
  id: string;
  rating: number;
  comment: string | null;
  tags?: string[];
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

export interface IRecentReview {
  id: IReview["id"];
  rating: IReview["rating"];
  comment: IReview["comment"];
  images: IReview["images"];
  userId: IReview["userId"];
  restaurantId: IReview["restaurantId"];
  dishId: IReview["dishId"];
  createdAt: IReview["createdAt"];
  updatedAt: IReview["updatedAt"];
  user: IReview["user"];
  restaurant: IReview["restaurant"];
  dish: IReview["dish"];
  likes: IReview["likes"];
}

export type IReviews = IReview;

export interface IReviewQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  rating?: number;
  restaurantId?: string;
  dishId?: string;
  userId?: string;
  createdAt?: string;
}

export interface ICreateReviewPayload {
  rating: number;
  comment?: string;
  tags?: string[];
  images?: string[];
  restaurantId: string;
  dishId: string;
}

export interface IUpdateReviewPayload {
  rating?: number;
  comment?: string;
  tags?: string[];
  images?: string[];
}
