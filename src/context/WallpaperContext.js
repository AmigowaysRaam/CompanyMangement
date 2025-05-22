import React, { createContext, useState, useContext } from 'react';

// Create the Wallpaper Context
const WallpaperContext = createContext();

export const useWallpaper = () => useContext(WallpaperContext);

// Wallpaper Provider component
export const WallpaperProvider = ({ children }) => {
  const [wallpaper, setWallpaper] = useState(null);

  // Function to change wallpaper
  const changeWallpaper = (url) => {
    setWallpaper(url);
  };

  return (
    <WallpaperContext.Provider value={{ wallpaper, changeWallpaper }}>
      {children}
    </WallpaperContext.Provider>
  );
};
// export const useAuth = () => useContext(WallpaperContext);
