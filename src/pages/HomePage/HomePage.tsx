import styles from "./HomePage.module.scss";
import WeatherCard from "../../components/WeatherCard/WeatherCard";
import CitySearch from "../../components/CitySearch/CitySearch";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import type { WeatherData } from "../../types/weather.types";

export default function HomePage() {
  const { history } = useSelector((state: RootState) => state.weather);

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <header className={styles.header}>
          <CitySearch />
        </header>
        <section className={styles.cardsGrid}>
          {history.map((item: WeatherData) => (
            <WeatherCard key={item.id} data={item} />
          ))}
        </section>
      </div>
    </div>
  );
}
