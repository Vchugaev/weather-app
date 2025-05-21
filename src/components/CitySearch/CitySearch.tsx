import { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./CitySearch.module.scss";
import searchIcon from "../../assets/images/search.svg";
import { useLazyGetCurrentWeatherQuery } from "../../store/weatherApi";
import { addToHistory } from "../../store/weatherSlice";
import type { WeatherData } from "../../types/weather.types";

export default function CitySearch() {
  const [city, setCity] = useState("");
  const dispatch = useDispatch();
  const [trigger, { isLoading, error }] = useLazyGetCurrentWeatherQuery();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;
    try {
      const res: WeatherData = await trigger({
        locationName: city.trim(),
        units: "metric",
        lang: "ru",
      }).unwrap();
      dispatch(addToHistory(res));
      setCity("");
    } catch (err) {
      console.error("Failed to fetch weather:", err);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          type="text"
          placeholder="Введите город"
          className={styles.searchInput}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={styles.searchButton}
        >
          {isLoading ? (
            "Загрузка..."
          ) : (
            <img src={searchIcon} alt="Найти город" />
          )}
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          Ошибка: Не удалось получить данные о погоде
        </div>
      )}
    </div>
  );
}
