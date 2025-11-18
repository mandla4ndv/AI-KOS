import React from 'react';
import { X } from 'lucide-react';
import '../styles/Toast.css';

const Toast = ({ toasts, onRemove }) => {
  return React.createElement(
    'div',
    { className: 'fixed top-4 right-4 z-50 space-y-2' },
    toasts.map((toast) =>
      React.createElement(
        'div',
        {
          key: toast.id,
          className: `glass-card border rounded-lg p-4 min-w-80 max-w-md transform transition-all duration-300 ${
            toast.variant === 'destructive' 
              ? 'border-destructive' 
              : 'border-border'
          }`,
          style: toast.variant === 'destructive' ? {
            borderColor: 'var(--destructive)',
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            color: 'var(--destructive)'
          } : {}
        },
        React.createElement(
          'div',
          { className: 'flex items-start justify-between' },
          [
            React.createElement(
              'div',
              { key: 'content', className: 'flex-1' },
              [
                React.createElement(
                  'h4',
                  { key: 'title', className: 'font-semibold' },
                  toast.title
                ),
                toast.description && React.createElement(
                  'p',
                  { key: 'desc', className: 'text-sm mt-1', style: { color: 'var(--muted-foreground)' } },
                  toast.description
                )
              ]
            ),
            React.createElement(
              'button',
              {
                key: 'close',
                onClick: () => onRemove(toast.id),
                className: 'ml-4 flex-shrink-0 transition-colors',
                style: { color: 'var(--muted-foreground)' }
              },
              React.createElement(X, { size: 16 })
            )
          ]
        )
      )
    )
  );
};

export default Toast;