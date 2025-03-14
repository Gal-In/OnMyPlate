/* eslint-disable react-hooks/rules-of-hooks */
import { useAuthApi } from "../Context/useAuthApi";
import { Post, PostToCreate } from "../Types/postTypes";
import { User } from "../Types/userTypes";

export const useAuthenticatedServerRequest = () => {
  const addNewPost = async (newPost: PostToCreate): Promise<Post | unknown> => {
    try {
      const { data } = await useAuthApi().post<Post>("/posts", newPost);

      return data;
    } catch (error) {
      return error;
    }
  };

  const updatePost = async (postId: string, newPostData: Partial<Post>) => {
    try {
      const { data } = await useAuthApi().put<Post>(
        `/posts/${postId}`,
        newPostData
      );

      return data;
    } catch (error) {
      return error;
    }
  };

  const updateUser = async (userDetails: Partial<User>) => {
    try {
      const { data } = await useAuthApi().put("/users", userDetails);

      return data;
    } catch (error) {
      return error;
    }
  };

  return { addNewPost, updatePost, updateUser };
};
