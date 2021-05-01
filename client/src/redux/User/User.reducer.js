import { ADD, ALL } from "./User.types";

const INITIAL_STATE = {
  user: {},
};

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {

    default:
      return state;
  }
};

export default userReducer;
