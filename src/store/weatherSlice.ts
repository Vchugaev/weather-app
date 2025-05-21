import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { WeatherData } from "../types/weather.types";

interface initialState {
  history: WeatherData[];
  current: null | WeatherData;
  searchQuery: string;
}
const initialState: initialState = {
  history: [],
  current: null,
  searchQuery: "",
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    addToHistory: (state, action: PayloadAction<WeatherData>) => {
      const newCity = action.payload;
      const normalizeName = (name: string) => name.trim().toLowerCase();

      const isDuplicate = state.history.some(
        (city) =>
          city.id === newCity.id ||
          normalizeName(city.name) === normalizeName(newCity.name)
      );
      if (!isDuplicate) {
        state.history.unshift(newCity);
        state.current = newCity;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearHistory: (state) => {
      state.history = [];
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter(
        (city) => city.name !== action.payload
      );
    },
    updateHistory: (state, action: PayloadAction<WeatherData[]>) => {
      state.history = action.payload;
    },
  },
});

export const {
  addToHistory,
  setSearchQuery,
  clearHistory,
  removeFromHistory,
  updateHistory,
} = weatherSlice.actions;
export default weatherSlice.reducer;
