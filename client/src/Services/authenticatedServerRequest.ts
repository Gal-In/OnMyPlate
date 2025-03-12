import { useAuthApi } from "../Context/useAuthApi";
import { Post, PostToCreate } from "../Types/postTypes";

export const useAuthenticatedServerRequest = () => {
  const axios = useAuthApi();

  const addNewPost = async (newPost: PostToCreate): Promise<Post | unknown> => {
    try {
      const { data } = await axios.post<Post>("/posts", newPost);

      return data;
    } catch (error) {
      return error;
    }
  };

  const updatePost = async (postId: string, newPostData: Partial<Post>) => {
    try {
      const { data } = await axios.put<Post>(`/posts/${postId}`, newPostData);

      return data;
    } catch (error) {
      return error;
    }
  };

  return { addNewPost, updatePost };
};
