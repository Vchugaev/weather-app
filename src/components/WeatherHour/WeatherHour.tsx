import type { WeatherData } from "../../types/weather.types";
import styles from "./WeatherHour.module.scss";
interface props {
  title: string;
  data: WeatherData;
}

export default function WeatherHour({ title, data }: props) {
  return (
    <>
      <div className={styles.main}>
        <h2 className={styles.title}>{title}</h2>
        <img
          className={styles.icon}
          src={`/animated/${data.weather[0].icon}.svg`}
          alt="картинка погоды"
        />
        <div className={styles.temp}>
          <span className="">
            {Number(data.main.temp).toFixed(0)}
            <span className={styles.tempValue}>°C</span>
          </span>
        </div>
        <div className={styles.description}>{data.weather[0].description}</div>
      </div>
    </>
  );
}
