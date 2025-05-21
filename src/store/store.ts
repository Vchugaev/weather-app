import { configureStore } from "@reduxjs/toolkit";
import { weatherApi } from "./weatherApi.ts";
import weatherReducer from "./weatherSlice.ts";

export const store = configureStore({
  reducer: {
    weather: weatherReducer, // Добавляем ваш слайс
    [weatherApi.reducerPath]: weatherApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(weatherApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
