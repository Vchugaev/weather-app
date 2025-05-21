import { useParams } from "react-router-dom";
import styles from "./CityDetailPage.module.scss";
import { useEffect, useState } from "react";
import {
  useGetHourlyForecastQuery,
  useLazyGetCurrentWeatherQuery,
} from "../../store/weatherApi";
import type { WeatherData } from "../../types/weather.types";
import WeatherHour from "../../components/WeatherHour/WeatherHour";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import getCityImage from "../../utils/getImage";

export default function CityDetailPage() {
  const { cityId } = useParams<{ cityId: string }>();
  const [trigger] = useLazyGetCurrentWeatherQuery();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const cities = useSelector((state: RootState) => state.weather.history);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (cityId) {
      const loadImage = async () => {
        const url = await getCityImage(cityId);
        setImageUrl(url);
      };

      loadImage();
    }
  }, [cityId]);
  const { data } = useGetHourlyForecastQuery({
    locationName: cityId || "",
    units: "metric",
    lang: "ru",
  });

  useEffect(() => {
    if (cityId && cities) {
      let weatherItems: null | WeatherData = null;

      for (let el of cities) {
        if (el.name === cityId) {
          weatherItems = el;
          setWeatherData(el);
        }
      }
      async function getWeather(cityId: string) {
        const res: WeatherData = await trigger({
          locationName: cityId,
          units: "metric",
          lang: "ru",
        }).unwrap();

        setWeatherData(res);
      }
      if (!weatherItems) {
        getWeather(cityId);
      }
    }
  }, [cityId, cities]);

  if (weatherData && imageUrl) {
    return (
      <div className={styles.page}>
        <main className={styles.main}>
          <header className={styles.header}>
            <h1>Текущая погода</h1>
          </header>

          <section className={styles.cardMain}>
            <div className={styles.current}>
              <img src={imageUrl} alt="Москва" className={styles.cityImage} />
              <div className={styles.info}>
                <h2>{weatherData.name}</h2>
                <div className={styles.tempRow}>
                  <img
                    className={styles.icon}
                    src={`/animated/${weatherData.weather[0].icon}.svg`}
                    alt="Погода"
                  />
                  <span className={styles.temp}>
                    {Math.round(weatherData.main.temp)}
                    <span className={styles.tempValue}>°C</span>
                  </span>
                </div>
                <p>{weatherData.weather[0].description}</p>
              </div>
              <div className={styles.extra}>
                <span className={styles.extraLike}>
                  Ощущается как: {Math.round(weatherData.main.feels_like)}
                  <span className={styles.tempValue}>°C</span>
                </span>
                <div className={styles.extraIcons}>
                  <div className={styles.extraMinMax}>
                    <img
                      className={styles.extraIcon}
                      src={`/thermometerUp.png`}
                      alt="Погода"
                    />
                    <span className={styles.tempMain}>
                      {Math.round(weatherData.main.temp_max)}
                      <span className={styles.tempValue}>°C</span>
                    </span>
                  </div>
                  <div className={styles.extraMinMax}>
                    <img
                      className={styles.extraIcon}
                      src={`/thermometerDown.png`}
                      alt="Погода"
                    />
                    <span className={styles.tempMain}>
                      {Math.round(weatherData.main.temp_min)}
                      <span className={styles.tempValue}>°C</span>
                    </span>
                  </div>
                </div>
                <div className={styles.infoWeather}>
                  <div className={styles.extraInfo}>
                    <img src="/wi-humidity.svg" alt="" />
                    <span className={styles.extraHumidity}>
                      Влажность:{" "}
                      <span className={styles.extraInfoBlock}>
                        {weatherData.main.humidity}%{" "}
                      </span>
                    </span>
                  </div>
                  <div className={styles.extraInfo}>
                    <img src="/wi-windy.svg" alt="" />
                    <span className={styles.extraWind}>
                      Ветер:{" "}
                      <span className={styles.extraInfoBlock}>
                        {weatherData.wind.speed} м/с
                      </span>
                    </span>
                  </div>
                  <div className={styles.extraInfo}>
                    <img src="/wi-barometer.svg" alt="" />
                    <span className={styles.extraPressure}>
                      Давление:
                      <span className={styles.extraInfoBlock}>
                        {" "}
                        {weatherData.main.pressure} гПа
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <h2 className={styles.heading}>Прогноз на сутки</h2>
            {data && (
              <div className={styles.forecast}>
                <WeatherHour data={data[0]} title={"утро"} />
                <WeatherHour data={data[1]} title={"день"} />
                <WeatherHour data={data[2]} title={"вечер"} />
                <WeatherHour data={data[3]} title={"ночь"} />
              </div>
            )}
          </section>
        </main>
      </div>
    );
  }
}
