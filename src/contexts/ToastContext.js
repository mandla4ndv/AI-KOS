import React, { createContext, useContext } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children, value }) => {
  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};