export type Post = {
  _id: string;
  restaurantName: string;
  description: string;
  photosUrl?: string[];
  rating: number;
  googleApiRating: number;
};

export type PostToCreate = Omit<Post, "_id">;
