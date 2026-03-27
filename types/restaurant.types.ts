export interface ITopRatedRestaurantLocation {
  lat: string;
  lng: string;
}

export interface ITopRatedRestaurantDish {
  id: string;
  name: string;
  image: string;
}

export interface ITopRatedRestaurantReview {
  id: string;
  rating: number;
}

export interface ITopRatedRestaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  road: string;
  location: ITopRatedRestaurantLocation;
  createdByUserId: string;
  contact: string | null;
  images: string[];
  ratingAvg: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  dishes: ITopRatedRestaurantDish[];
  reviews: ITopRatedRestaurantReview[];
}