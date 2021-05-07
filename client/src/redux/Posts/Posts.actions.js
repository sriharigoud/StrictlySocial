import { ADDPOST, ALLPOSTS, LIKE, DELETE, DELETECOMMENT, SHARE, ADDCOMMENT, SETPOST } from "./Posts.types";

export const createPost = (payload) => {
  return {
    type: ADDPOST,
    payload: payload
  };
};

export const deletePost = (payload) => {
  return {
    type: DELETE,
    payload: payload
  };
};

export const toggleLike = (payload) => {
  return {
    type: LIKE,
    payload: payload
  };
};

export const submitComment = (payload) => {
  return {
    type: ADDCOMMENT,
    payload: payload
  };
};

export const deleteComment = (payload) => {
  return {
    type: DELETECOMMENT,
    payload: payload
  };
};

export const sharePost = (payload) => {
  return {
    type: SHARE,
    payload: payload
  };
};

export const setAllPosts = (payload) => {
  return {
    type: ALLPOSTS,
    payload: payload
  };
};

export const setPost = (payload) => {
  return {
    type: SETPOST,
    payload: payload
  };
};
