async function getCityImage(city: string): Promise<string | null> {
  
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=город+${city}&client_id=${import.meta.env.VITE_UNSPLASH_API_KEY}&lang=ru`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.warn(`No images found for city: ${city}`);
      return null;
    }

    return data.results[0].urls.raw;
  } catch (error) {
    console.error('Failed to fetch city image:', error);
    return null;
  }
}

export default getCityImage