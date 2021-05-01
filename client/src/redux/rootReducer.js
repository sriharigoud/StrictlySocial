import { combineReducers  } from 'redux';

import notificationsReducer from './Notifications/Notifications.reducer';
import postsReducer from './Posts/Posts.reducer';
import UserReducer from './User/User.reducer';
const rootReducer = combineReducers({
    notifications: notificationsReducer,
    posts: postsReducer,
    user: UserReducer
});

export default rootReducer;
