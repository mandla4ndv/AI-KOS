import React, { createContext, useContext, useState } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { id, ...toast };
    setToasts((prev) => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const value = {
    toasts,
    addToast,
    removeToast
  };

  return React.createElement(
    ToastContext.Provider,
    { value: value },
    [
      children,
      React.createElement(ToastContainer, {
        key: 'toast-container',
        toasts: toasts,
        onRemove: removeToast
      })
    ]
  );
};

const ToastContainer = ({ toasts, onRemove }) => {
  return React.createElement(
    'div',
    {
      className: 'fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full'
    },
    toasts.map((toast) =>
      React.createElement(Toast, {
        key: toast.id,
        toast: toast,
        onRemove: onRemove
      })
    )
  );
};

const Toast = ({ toast, onRemove }) => {
  const variantStyles = {
    default: 'border-border bg-card',
    destructive: 'border-destructive bg-destructive text-destructive-foreground',
    success: 'border-green-500 bg-green-50 text-green-900'
  };

  return React.createElement(
    'div',
    {
      className: `flex items-center justify-between p-4 rounded-lg border shadow-lg animate-slide-in-right ${variantStyles[toast.variant || 'default']}`,
      style: { animation: 'slideInRight 0.3s ease-out' }
    },
    [
      React.createElement(
        'div',
        { key: 'content', className: 'flex-1' },
        [
          toast.title && React.createElement(
            'h4',
            { key: 'title', className: 'font-semibold' },
            toast.title
          ),
          toast.description && React.createElement(
            'p',
            { key: 'desc', className: 'text-sm mt-1' },
            toast.description
          )
        ]
      ),
      React.createElement(
        'button',
        {
          key: 'close',
          onClick: () => onRemove(toast.id),
          className: 'ml-4 text-sm opacity-70 hover:opacity-100 transition-opacity',
          style: { background: 'none', border: 'none' }
        },
        '×'
      )
    ]
  );
};

export { ToastContext };