import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { WeatherData } from "../types/weather.types";

interface WeatherRequestParams {
  locationName: string;
  units?: "metric" | "imperial";
  lang?: string;
}

export const weatherApi = createApi({
  reducerPath: "weatherApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.openweathermap.org/data/2.5/",
  }),
  endpoints: (builder) => ({
    getCurrentWeather: builder.query<WeatherData, WeatherRequestParams>({
      query: ({ locationName, units = "metric", lang = "ru" }) => ({
        url: "weather",
        params: {
          q: locationName,
          units,
          lang,
          appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
        },
      }),
    }),

    getHourlyForecast: builder.query<WeatherData[], WeatherRequestParams>({
      query: ({ locationName, units = "metric", lang = "ru" }) => ({
        url: "forecast",
        params: {
          q: locationName,
          units,
          lang,
          appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
        },
      }),
      transformResponse: (response: WeatherData) => {
        const tomorrowDate = new Date();
        tomorrowDate.setDate(tomorrowDate.getDate() + 1);
        const formattedDate = tomorrowDate.toISOString().split("T")[0];

        const desiredHours = [9, 15, 18, 21];

        // можно упростить: сразу return response.list.filter()
        const list = response.list.filter((entry) => {
          const isTomorrow = entry.dt_txt.startsWith(formattedDate);
          const utcHour = new Date(entry.dt * 1000).getUTCHours();
          return isTomorrow && desiredHours.includes(utcHour);
        });
        return list;
      },
    }),
  }),
});

export const {
  // экспортируется наружу (57 и 60 строки), но нигде не используется
  useGetCurrentWeatherQuery,
  useLazyGetCurrentWeatherQuery,
  useGetHourlyForecastQuery,
  useLazyGetHourlyForecastQuery,
} = weatherApi;
