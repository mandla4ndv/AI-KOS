import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import '../styles/ConfirmationModal.css';

const ConfirmationModal = ({ 
  open, 
  onOpenChange, 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  onConfirm,
  variant = 'default'
}) => {
  if (!open) return null;

  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return React.createElement(
    'div',
    {
      className: 'fixed inset-0 z-50 flex items-center justify-center',
      style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
    },
    React.createElement(
      'div',
      {
        className: 'glass-card rounded-xl p-6 mx-4 max-w-md w-full animate-scale-in'
      },
      [
        React.createElement(
          'div',
          { key: 'header', className: 'flex items-center justify-between mb-4' },
          [
            React.createElement(
              'div',
              { key: 'title', className: 'flex items-center gap-3' },
              [
                variant === 'destructive' && React.createElement(AlertTriangle, {
                  key: 'icon',
                  size: 24,
                  style: { color: 'var(--destructive)' }
                }),
                React.createElement(
                  'h2',
                  {
                    key: 'text',
                    className: 'text-xl font-bold',
                    style: variant === 'destructive' ? { color: 'var(--destructive)' } : {}
                  },
                  title
                )
              ]
            ),
            React.createElement(
              'button',
              {
                key: 'close',
                onClick: handleCancel,
                className: 'btn btn-ghost btn-sm',
                style: { background: 'none', border: 'none' }
              },
              React.createElement(X, { size: 20 })
            )
          ]
        ),
        React.createElement(
          'p',
          { 
            key: 'message', 
            className: 'mb-6',
            style: { color: 'var(--muted-foreground)' }
          },
          message
        ),
        React.createElement(
          'div',
          {
            key: 'actions',
            className: 'flex gap-3'
          },
          [
            React.createElement(
              'button',
              {
                key: 'cancel',
                onClick: handleCancel,
                className: 'btn btn-outline flex-1'
              },
              cancelText
            ),
            React.createElement(
              'button',
              {
                key: 'confirm',
                onClick: handleConfirm,
                className: `btn flex-1 ${variant === 'destructive' ? 'btn-destructive' : 'btn-primary'}`
              },
              confirmText
            )
          ]
        )
      ]
    )
  );
};

export default ConfirmationModal;