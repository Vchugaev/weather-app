import { useState } from "react";
import styles from "./WeatherCard.module.scss";
import favoriteIcon from "../../assets/images/heart-thin-icon.svg";
import unFavoriteIcon from "../../assets/images/red-heart-icon.svg";
import deleteIcon from "../../assets/images/delete.svg";
import type { WeatherData } from "../../types/weather.types";
import {
  saveFavorite,
  removeFavorite,
  isFavorite,
} from "../../utils/favoritesStorage";
import { removeFromHistory } from "../../store/weatherSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface props {
  data: WeatherData;
}

export default function WeatherCard({ data }: props) {
  const [isFav, setIsFav] = useState(isFavorite(data.name));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function formatWeatherDate(timestamp: number): string {
    const date = new Date(timestamp * 1000); // Умножаем на 1000, т.к. в JS timestamp в миллисекундах

    const day = date.getDate(); // День месяца (1-31)
    const month = date.getMonth() + 1; // Месяц (0-11) + 1 = (1-12)
    const year = date.getFullYear(); // Год (4 цифры)

    return `${day}/${month}/${year}`;
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(data.name);
    } else {
      saveFavorite(data.name);
    }
    setIsFav(!isFav);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFav) {
      removeFavorite(data.name);
    }
    dispatch(removeFromHistory(data.name));
  };

  return (
    <div
      onClick={() => navigate(`/city/${data.name}`)}
      className={styles.weatherCard}
    >
      <div className={styles.actions}>
        <button
          className={styles.favoriteButton}
          onClick={toggleFavorite}
        >
          <img
            src={isFav ? unFavoriteIcon : favoriteIcon}
            alt={isFav ? "Remove from favorites" : "Add to favorites"}
          />
        </button>

        <button onClick={handleDelete} className={styles.deleteButton}>
          <img src={deleteIcon} alt="Delete city" />
        </button>
      </div>
      <div className={styles.header}>
        <img
          className={styles.icon}
          src={`/animated/${data.weather[0].icon}.svg`}
          alt="Картинка погоды"
        />
        <div className={styles.header__info}>
          <span className={styles.location}>
            {data.name}, {data.sys.country}
          </span>
          <span className={styles.date}>{formatWeatherDate(data.dt)}</span>
        </div>
      </div>
      <div className={styles.temp}>
        {Number(data.main.temp).toFixed(0)}
        <span>°C</span>
      </div>
      <div className={styles.description}>{data.weather[0].description}</div>
    </div>
  );
}
