import { ADD, ALL } from "./Notifications.types";

const INITIAL_STATE = {
  notifications: [],
};

function notificationsReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ADD:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };

    case ALL:
      return {
        ...state,
        notifications: action.payload,
      };

    default:
      return state;
  }
};

export default notificationsReducer;
