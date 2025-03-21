export type Post = {
  _id: string;
  restaurantName: string;
  description: string;
  photosUrl: string[];
  rating: number;
  googleApiRating: number;
  senderId: string;
};

export type PostToCreate = Omit<Omit<Post, "senderId">, "_id">;
