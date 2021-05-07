import { ADDPOST, ALLPOSTS, LIKE, DELETE, DELETECOMMENT, SHARE, ADDCOMMENT, SETPOST } from "./Posts.types";
import { LOCATION_CHANGE } from 'react-router-redux';

const INITIAL_STATE = {
  posts: [],
};

function postsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADDPOST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case LOCATION_CHANGE:
      return []
    case ALLPOSTS:
      return {
        ...state,
        posts: action.payload,
      };

    case DELETE:
      return {
        ...state,
        posts: state.posts.filter((a) => a._id !== action.payload.post._id),
      };

    case SHARE:
      return {
        ...state,
        posts: [action.payload.post, ...state.posts],
      };

    case DELETECOMMENT:
      return {
        ...state,
        posts: state.posts.map((a) => a._id === action.payload.post._id ? { ...a, comments: action.payload.comments } : { ...a }
      ),
    };

    case ADDCOMMENT:
      return {
        ...state,
        posts: state.posts.map((a) => a._id === action.payload.post._id ? { ...a, comments: action.payload.comments } : { ...a }
      ),
    };

    case LIKE:
      return {
        ...state,
        posts: state.posts.map((a) => a._id === action.payload.post._id ? { ...a, likes: action.payload.likes } : { ...a }
      ),
    };

    case SETPOST:
      return {
        ...state,
        posts: state.posts.map((a) => a._id === action.payload.post._id ? {...action.payload.post} : { ...a }
      ),
    };

    default:
      return state;
  }
};

export default postsReducer;
