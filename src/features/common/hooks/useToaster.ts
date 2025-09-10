import { ToasterContext, ToasterContextReturn } from '@/providers/toaster-provider';
import { useContext } from 'react';

export function useToaster(): ToasterContextReturn {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToaster must be used within a ToasterProvider');
  }

  return context;
}

export default useToaster;
