import { combineReducers  } from 'redux';

import notificationsReducer from './Notifications/Notifications.reducer';
const rootReducer = combineReducers({
    notifications: notificationsReducer,
});

export default rootReducer;
