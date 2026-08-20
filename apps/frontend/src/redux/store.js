import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice.js';
import postSlice from './post-slice.js';
import socketSlice from './socket-slice.js';
import chatSlice from './chat-slice.js';
import rtnSlice from './rtn-slice.js';

import {
  persistReducer,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // The socket is a non-serializable live connection - it must NOT be
  // persisted to storage. It is recreated on every app load in App.jsx.
  blacklist: ['socketio'],
};

const rootReducer = combineReducers({
  auth: authSlice,
  post: postSlice,
  socketio: socketSlice,
  chat: chatSlice,
  realTimeNotification: rtnSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore the socket instance which is intentionally non-serializable
        ignoredActions: ['socketio/setSocket'],
        ignoredPaths: ['socketio.socket'],
      },
    }),
});
export default store;
