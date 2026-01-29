/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from 'react';

type DrawerContextType = {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  drawerWidth: number;
};

const DrawerContext = createContext<DrawerContextType | null>(null);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  return (
    <DrawerContext.Provider value={{ drawerOpen, setDrawerOpen, drawerWidth: 400 }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('useDrawer must be used within DrawerProvider');
  return context;
};
