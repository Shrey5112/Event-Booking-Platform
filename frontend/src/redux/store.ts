// store/store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { persistReducer, persistStore } from "redux-persist";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
// import thunk from "redux-thunk";

import userReducer from "./userSlice";
import eventReducer from "./eventSlice";
import bookingReducer from "./bookingSlice";
import themeReducer from "./themeSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"], // only persist user slice (not events/bookings if you don’t want)
};

const rootReducer = combineReducers({
  user: userReducer,
  events: eventReducer,
  bookings: bookingReducer,
  theme: themeReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
