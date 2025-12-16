import React, { createContext, useContext } from 'react';
import { useSells } from '../hooks/useSells';

const SellContext = createContext();

export const useSellContext = () => {
  const context = useContext(SellContext);
  if (!context) {
    throw new Error('useSellContext must be used within a SellProvider');
  }
  return context;
};

export const SellProvider = ({ children }) => {
  const sellsData = useSells();

  return (
    <SellContext.Provider value={sellsData}>
      {children}
    </SellContext.Provider>
  );
};
