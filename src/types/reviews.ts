export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  user: {
    id: string;
    handle?: string;
    displayName?: string;
    image?: string;
    verified?: boolean;
    moderator?: boolean;
  };
}