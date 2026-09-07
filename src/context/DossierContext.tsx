'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Property } from '../types/property';
import { DossierSummary, ClientInfo, DossierType } from '../types/dossier';

interface DossierContextType {
  selectedProperties: Property[];
  addToDossier: (property: Property) => void;
  removeFromDossier: (propertyId: string) => void;
  clearDossier: () => void;
  isInDossier: (propertyId: string) => boolean;
  summary: DossierSummary;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isExecutiveModalOpen: boolean;
  setIsExecutiveModalOpen: (open: boolean) => void;
  clientInfo: ClientInfo;
  setClientInfo: React.Dispatch<React.SetStateAction<ClientInfo>>;
  dossierType: DossierType;
  setDossierType: (type: DossierType) => void;
  lastAddedTitle: string | null;
}

const defaultClientInfo: ClientInfo = {
  fullName: '',
  companyName: '',
  email: '',
  phone: '',
  city: 'Medellín / Apartadó',
  notes: ''
};

const DossierContext = createContext<DossierContextType | undefined>(undefined);

export const DossierProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedProperties, setSelectedProperties] = useState<Property[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState<ClientInfo>(defaultClientInfo);
  const [dossierType, setDossierType] = useState<DossierType>('Inversionista');
  const [lastAddedTitle, setLastAddedTitle] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('darien_dossier_properties');
      if (saved) {
        setSelectedProperties(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load dossier from localStorage', e);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('darien_dossier_properties', JSON.stringify(selectedProperties));
    } catch (e) {
      console.error('Failed to save dossier to localStorage', e);
    }
  }, [selectedProperties]);

  const addToDossier = (property: Property) => {
    setSelectedProperties((prev) => {
      if (prev.some((p) => p.id === property.id)) return prev;
      return [...prev, property];
    });
    setLastAddedTitle(property.title);
    setIsDrawerOpen(true);

    setTimeout(() => {
      setLastAddedTitle(null);
    }, 3000);
  };

  const removeFromDossier = (propertyId: string) => {
    setSelectedProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const clearDossier = () => {
    setSelectedProperties([]);
  };

  const isInDossier = (propertyId: string) => {
    return selectedProperties.some((p) => p.id === propertyId);
  };

  // Compute metrics in real-time
  const summary: DossierSummary = useMemo(() => {
    let totalAreaHa = 0;
    let totalAreaM2 = 0;
    let totalSalePrice = 0;
    let totalMonthlyRent = 0;
    let hasSale = false;
    let hasRent = false;
    let hasCustody = false;

    selectedProperties.forEach((p) => {
      if (p.areaTotalHa) totalAreaHa += p.areaTotalHa;
      if (p.areaTotalM2) totalAreaM2 += p.areaTotalM2;

      if (p.modality === 'Venta') {
        hasSale = true;
        if (p.price) totalSalePrice += p.price;
      } else if (p.modality === 'Arriendo') {
        hasRent = true;
        if (p.monthlyRent) totalMonthlyRent += p.monthlyRent;
      } else if (p.modality === 'Custodia') {
        hasCustody = true;
        if (p.monthlyRent) totalMonthlyRent += p.monthlyRent;
      } else if (p.modality === 'Inversión') {
        if (p.price) totalSalePrice += p.price;
        if (p.monthlyRent) totalMonthlyRent += p.monthlyRent;
        hasSale = true;
      }
    });

    const modalitiesCount = [hasSale, hasRent, hasCustody].filter(Boolean).length;

    return {
      propertyCount: selectedProperties.length,
      totalAreaHa: Math.round(totalAreaHa * 100) / 100,
      totalAreaM2,
      totalSalePrice,
      totalMonthlyRent,
      hasSale,
      hasRent,
      hasCustody,
      hasMixedModalities: modalitiesCount > 1
    };
  }, [selectedProperties]);

  return (
    <DossierContext.Provider
      value={{
        selectedProperties,
        addToDossier,
        removeFromDossier,
        clearDossier,
        isInDossier,
        summary,
        isDrawerOpen,
        setIsDrawerOpen,
        isExecutiveModalOpen,
        setIsExecutiveModalOpen,
        clientInfo,
        setClientInfo,
        dossierType,
        setDossierType,
        lastAddedTitle
      }}
    >
      {children}
    </DossierContext.Provider>
  );
};

export const useDossier = () => {
  const context = useContext(DossierContext);
  if (!context) {
    throw new Error('useDossier must be used within a DossierProvider');
  }
  return context;
};
