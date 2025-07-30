import React, {createContext, useContext, useState} from 'react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

export type AlertItem = {
  id: string;
  message: string;
  type: AlertType;
};

type ToastContextType = {
  alerts: AlertItem[];
  showAlert: (alert: Omit<AlertItem, 'id'>) => void;
  hideAlert: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  const showAlert = (alert: Omit<AlertItem, 'id'>) => {
    const id = Date.now().toString();
    setAlerts(prev => [...prev, {...alert, id}]);
  };

  const hideAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <ToastContext.Provider value={{alerts, showAlert, hideAlert}}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
