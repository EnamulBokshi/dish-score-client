export interface IUpdateOwnerProfilePayload {
  businessName?: string;
  contactNumber?: string;
}

export interface IUpdateReviewerProfilePayload {
  bio?: string;
}

export interface IMyProfileData {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  profilePhoto?: string | null;
  role: string;
  status?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  ownerProfile?: IUpdateOwnerProfilePayload | null;
  reviewerProfile?: IUpdateReviewerProfilePayload | null;
}
