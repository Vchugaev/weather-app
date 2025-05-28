import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import "./assets/styles/global.css";
import { useEffect } from "react";
import { getFavorites } from "./utils/favoritesStorage";
import { useDispatch } from "react-redux";
import { useLazyGetCurrentWeatherQuery } from "./store/weatherApi";
import { addToHistory } from "./store/weatherSlice";
import CityDetailPage from "./pages/CityDetailPage/CityDetailPage";

// в импортах полная каша, лучше под это настроить линтер
// также не хватает алисов, чтобы вместо ../../components/some-component
// или ./pages/page1/page
// было @/assets или @/pages и т.п. - таким образом относительные импорты во многом уйдут, а абсолютные будут унифицированы и удобны

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
          // если запрос не проходит или в процессе вылетает ошибка, лучше показывать юзеру, что есть проблемы с этим -
          // для этого подойдет например тост или какой то хотя бы фидбек строкой на странице типа
          // “Не удалось получить информацию по городу *город*”
          console.error(`Failed to load ${cityName}:`, error);
        }
      }
    };

    loadFavorites();
  }, [dispatch, fetchWeather]);

  return (
    // Семантическая ошибка. Как правило, тег main используется в самой странице для отображения контента.
    // Т.е. у нас есть body, в котором на верхнем уровне есть header (шапка), aside (навбар если есть),
    // main (основной, меняющийся контент, уникальный для каждой страницы) и footer (если есть).
    // Так что тег main чисто по семантическим соображениям лучше помещать внутрь страницы или обертки для страниц
    // (если нужны подробности, то можно погуглить про семантику этих тегов)
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
