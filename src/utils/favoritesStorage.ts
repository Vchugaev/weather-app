export const getFavorites = (): string[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("weatherFavorites");
  return data ? JSON.parse(data) : [];
};

export const saveFavorite = (city: string): void => {
  const favorites = getFavorites();
  if (!favorites.some((f) => f === city)) {
    localStorage.setItem(
      "weatherFavorites",
      JSON.stringify([...favorites, city])
    );
  }
};

export const removeFavorite = (city: string): void => {
  const favorites = getFavorites();
  localStorage.setItem(
    "weatherFavorites",
    JSON.stringify(favorites.filter((f) => f !== city))
  );
};

export const isFavorite = (city: string): boolean => {
  return getFavorites().some((f) => f === city);
};