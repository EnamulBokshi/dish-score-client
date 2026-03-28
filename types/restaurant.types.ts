export interface ITopRatedRestaurantLocation {
  lat: string;
  lng: string;
}

export interface IRestaurant {
  id: string;
  name: string;
  description: string;
  tags?: string[];
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
  dishes?: {
    id: string;
    name: string;
    tags?: string[];
    ingredients?: string[];
    description?: string;
    price?: number;
    image?: string;
  }[];
  reviews?: {
    id: string;
    rating: number;
    comment: string | null;
    user: {
      id: string;
      name: string;
    };
  }[];
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
  tags?: string[];
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

export interface IRestaurantQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  city?: string;
  state?: string;
  ratingAvg?: number;
  name?: string;
}

export interface ICreateRestaurantPayload {
  name: string;
  description?: string;
  tags?: string[];
  address: string;
  city: string;
  state: string;
  road: string;
  location: {
    lat: string;
    lng: string;
  };
  contact?: string;
}

export interface IUpdateRestaurantPayload {
  name?: string;
  description?: string;
  tags?: string[];
  address?: string;
  city?: string;
  state?: string;
  road?: string;
  location?: {
    lat: string;
    lng: string;
  };
  contact?: string;
}