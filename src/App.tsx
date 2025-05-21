import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import "./assets/styles/global.css";
import { useEffect } from "react";
import { getFavorites } from "./utils/favoritesStorage";
import { useDispatch } from "react-redux";
import { useLazyGetCurrentWeatherQuery } from "./store/weatherApi";
import { addToHistory } from "./store/weatherSlice";
import CityDetailPage from "./pages/CityDetailPage/CityDetailPage";

const App = () => {
  const dispatch = useDispatch();
  const [fetchWeather] = useLazyGetCurrentWeatherQuery();
  useEffect(() => {
    const loadFavorites = async () => {
      const favorites = getFavorites();

      for (const cityName of favorites) {
        try {
          const result = await fetchWeather({
            locationName: cityName,
            units: "metric",
            lang: "ru",
          }).unwrap();

          dispatch(addToHistory(result));
        } catch (error) {
          console.error(`Failed to load ${cityName}:`, error);
        }
      }
    };

    loadFavorites();
  }, [dispatch, fetchWeather]);

  return (
    <main>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/city/:cityId" element={<CityDetailPage />} />
        </Routes>
      </Router>
    </main>
  );
};

export default App;
