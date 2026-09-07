'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface FavoritesContextType {
  favoriteIds: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  favoritesCount: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('darien_favorites');
      if (saved) {
        setFavoriteIds(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load favorites', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('darien_favorites', JSON.stringify(favoriteIds));
    } catch (e) {
      console.error('Failed to save favorites', e);
    }
  }, [favoriteIds]);

  const toggleFavorite = (propertyId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]
    );
  };

  const isFavorite = (propertyId: string) => favoriteIds.includes(propertyId);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        toggleFavorite,
        isFavorite,
        favoritesCount: favoriteIds.length
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
