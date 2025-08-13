'use client';
import { createContext, useContext } from 'react';

interface MobileNavContextProps {
  goBack: () => void;
}

export const MobileNavContext = createContext<MobileNavContextProps | null>(null);

export const useMobileNavigation = () => useContext(MobileNavContext);
