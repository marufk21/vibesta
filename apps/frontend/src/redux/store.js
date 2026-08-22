import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './auth-slice.js';
import postSlice from './post-slice.js';
import socketSlice from './socket-slice.js';
import chatSlice from './chat-slice.js';
import rtnSlice from './rtn-slice.js';

import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  // Only persist lightweight auth data. Heavy/transient state (socket, feed
  // posts, chat messages, notifications) is blacklisted so it isn't written to
  // localStorage on every update — avoids storage bloat and slow rehydration.
  // - socket: non-serializable live connection, recreated on load (see App.jsx)
  // - post:   large feed, refetched on mount (see useGetAllPost)
  // - chat:   messages refreshed per selected user
  // - realTimeNotification: ephemeral like toasts
  blacklist: ['socketio', 'post', 'chat', 'realTimeNotification'],
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
        ignoredActions: ['socketio/setSocket', FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['socketio.socket'],
      },
    }),
});
export default store;
