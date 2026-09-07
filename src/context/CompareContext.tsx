'use client';

import React, { createContext, useContext, useState } from 'react';
import { Property } from '../types/property';

interface CompareContextType {
  comparedProperties: Property[];
  addToCompare: (property: Property) => void;
  removeFromCompare: (propertyId: string) => void;
  isInCompare: (propertyId: string) => boolean;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comparedProperties, setComparedProperties] = useState<Property[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const addToCompare = (property: Property) => {
    if (comparedProperties.some((p) => p.id === property.id)) return;
    if (comparedProperties.length >= 4) {
      alert('Puedes comparar un máximo de 4 propiedades simultáneamente.');
      return;
    }
    setComparedProperties((prev) => [...prev, property]);
  };

  const removeFromCompare = (propertyId: string) => {
    setComparedProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const isInCompare = (propertyId: string) => {
    return comparedProperties.some((p) => p.id === propertyId);
  };

  const clearCompare = () => {
    setComparedProperties([]);
  };

  return (
    <CompareContext.Provider
      value={{
        comparedProperties,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
