import { ADD, ALL } from "./User.types";

export const AddNotification = (payload) => {
  return {
    type: ADD,
    payload: payload
  };
};

export const setAll = (payload) => {
  return {
    type: ALL,
    payload: payload
  };
};
