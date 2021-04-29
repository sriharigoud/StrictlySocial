import { combineReducers  } from 'redux';

import notificationsReducer from './Notifications/Notifications.reducer';
import postsReducer from './Posts/Posts.reducer';
const rootReducer = combineReducers({
    notifications: notificationsReducer,
    posts: postsReducer
});

export default rootReducer;
