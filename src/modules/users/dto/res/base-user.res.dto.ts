export class BaseUserResDto {
  id: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
  birthdate?: string;
  city?: string;
  gender?: string;
  instagram?: string;
  interests?: string;
  role?: string[];
  createdAt: Date;
  updatedAt: Date;
  isFollowed: boolean;
  isCritic: boolean;
}
