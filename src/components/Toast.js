import React from 'react';
import { X } from 'lucide-react';
import '../styles/Toast.css';

const Toast = ({ toasts, onRemove }) => {
  // Separate toasts by position
  const topToasts = toasts.filter(toast => !toast.position || toast.position === 'top');
  const bottomToasts = toasts.filter(toast => toast.position === 'bottom');

  return React.createElement(
    React.Fragment,
    null,
    [
      // Top toasts (default behavior)
      topToasts.length > 0 && React.createElement(
        'div',
        {
          key: 'top-toasts',
          className: 'toast-container top-toast-container'
        },
        topToasts.map((toast) => renderToast(toast, onRemove))
      ),
      
      // Bottom toasts (new)
      bottomToasts.length > 0 && React.createElement(
        'div',
        {
          key: 'bottom-toasts',
          className: 'toast-container bottom-toast-container'
        },
        bottomToasts.map((toast) => renderToast(toast, onRemove))
      )
    ]
  );
};

const renderToast = (toast, onRemove) => {
  return React.createElement(
    'div',
    {
      key: toast.id,
      className: `toast ${toast.variant === 'destructive' ? 'destructive' : ''} ${toast.variant === 'success' ? 'success' : ''}`
    },
    React.createElement(
      'div',
      { className: 'toast-content' },
      [
        React.createElement(
          'div',
          { key: 'content', className: 'toast-message' },
          [
            React.createElement(
              'h4',
              { key: 'title', className: 'toast-title' },
              toast.title
            ),
            toast.description && React.createElement(
              'p',
              { key: 'desc', className: 'toast-description' },
              toast.description
            )
          ]
        ),
        React.createElement(
          'button',
          {
            key: 'close',
            onClick: () => onRemove(toast.id),
            className: 'toast-close',
            'aria-label': 'Close toast'
          },
          React.createElement(X, { size: 16 })
        )
      ]
    ),
    React.createElement('div', {
      key: 'progress',
      className: 'toast-progress'
    })
  );
};

export default Toast;