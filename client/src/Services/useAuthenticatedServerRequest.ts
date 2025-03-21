/* eslint-disable react-hooks/rules-of-hooks */
import { useAuthApi } from "../Context/useAuthApi";
import { Like } from "../Types/likeTypes";
import { Post, PostToCreate } from "../Types/postTypes";
import { User } from "../Types/userTypes";
import { Comment } from "../Types/commentTypes";
export const useAuthenticatedServerRequest = () => {
  const axios = useAuthApi();

  const addNewPost = async (newPost: PostToCreate): Promise<Post | unknown> => {
    try {
      const { data } = await axios
        .getAuthorizedAxios()
        .post<Post>("/posts", newPost);

      return data;
    } catch (error) {
      return error;
    }
  };

  const updatePost = async (postId: string, newPostData: Partial<Post>) => {
    try {
      const { data } = await axios
        .getAuthorizedAxios()

        .put<Post>(`/posts/${postId}`, newPostData);

      return data;
    } catch (error) {
      return error;
    }
  };

  const updateUser = async (userDetails: Partial<User>) => {
    try {
      const { data } = await axios
        .getAuthorizedAxios()
        .put("/users", userDetails);

      return data;
    } catch (error) {
      return error;
    }
  };

  
const addLike = async (postId: string) => {
  try {
    const { data } = await axios.getAuthorizedAxios().post(
      process.env.REACT_APP_SERVER_URL + `/like`, {
        postId: postId,
      }
    );

    return data;
  } catch (error) {
    return error;
  }
}

const deleteLike = async (postId: string) => {
  try {
    const { data } = await axios.getAuthorizedAxios().delete(
      process.env.REACT_APP_SERVER_URL + `/like`,{
      data:{postId}}
    );

    return data;
  } catch (error) {
    return error;
  }
}

const getIsLikedByUser = async (postId: string) => {
  try {
    const { data } = await axios.getAuthorizedAxios().get<boolean>(
      process.env.REACT_APP_SERVER_URL + `/like/status/${postId}`
    );

    return data;
  } catch (error: unknown) {
    return error;
  }
}
const addNewComment = async (comment: Comment) => {
  try {
    const { data } = await axios.getAuthorizedAxios().post(
      process.env.REACT_APP_SERVER_URL + "/comments",
      comment
    );

    return data;
  } catch (error) {
    return error;
  }
};

  return { addNewPost, updatePost, updateUser, addLike, deleteLike, getIsLikedByUser, addNewComment};
};
