import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import '../styles/AuthModal.css';

const AuthModal = ({ open, onOpenChange, mode, onModeChange, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    addToast({
      title: mode === 'login' ? 'Welcome back!' : 'Account created!',
      description: mode === 'login' ? 'You have successfully logged in.' : 'Your account has been created successfully.',
    });

    onSuccess({
      name: mode === 'register' ? name : 'Chef User',
      email,
    });

    setLoading(false);
    setEmail('');
    setPassword('');
    setName('');
  };

  if (!open) return null;

  return React.createElement(
    'div',
    {
      className: 'fixed inset-0 z-50 flex items-center justify-center',
      style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
    },
    React.createElement(
      'div',
      {
        className: 'glass-card rounded-xl p-6 mx-4 max-w-md w-full animate-scale-in',
        style: { maxWidth: '400px' }
      },
      [
        React.createElement(
          'div',
          { key: 'header', className: 'mb-6' },
          [
            React.createElement(
              'h2',
              { key: 'title', className: 'text-2xl font-bold' },
              mode === 'login' ? 'Welcome Back' : 'Create Account'
            ),
            React.createElement(
              'p',
              { key: 'desc', className: 'mt-2', style: { color: 'var(--muted-foreground)' } },
              mode === 'login' 
                ? 'Enter your credentials to access your recipes'
                : 'Sign up to save and manage your recipes'
            )
          ]
        ),
        React.createElement(
          'form',
          {
            key: 'form',
            onSubmit: handleSubmit,
            className: 'space-y-4'
          },
          [
            mode === 'register' && React.createElement(
              'div',
              { key: 'name', className: 'space-y-2' },
              [
                React.createElement(
                  'label',
                  {
                    key: 'label',
                    htmlFor: 'name',
                    className: 'text-sm font-medium'
                  },
                  'Name'
                ),
                React.createElement('input', {
                  key: 'input',
                  id: 'name',
                  type: 'text',
                  placeholder: 'Your name',
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  required: true,
                  className: 'input'
                })
              ]
            ),
            React.createElement(
              'div',
              { key: 'email', className: 'space-y-2' },
              [
                React.createElement(
                  'label',
                  {
                    key: 'label',
                    htmlFor: 'email',
                    className: 'text-sm font-medium'
                  },
                  'Email'
                ),
                React.createElement('input', {
                  key: 'input',
                  id: 'email',
                  type: 'email',
                  placeholder: 'chef@example.com',
                  value: email,
                  onChange: (e) => setEmail(e.target.value),
                  required: true,
                  className: 'input'
                })
              ]
            ),
            React.createElement(
              'div',
              { key: 'password', className: 'space-y-2' },
              [
                React.createElement(
                  'label',
                  {
                    key: 'label',
                    htmlFor: 'password',
                    className: 'text-sm font-medium'
                  },
                  'Password'
                ),
                React.createElement('input', {
                  key: 'input',
                  id: 'password',
                  type: 'password',
                  placeholder: '••••••••',
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  required: true,
                  className: 'input'
                })
              ]
            ),
            React.createElement(
              'button',
              {
                key: 'submit',
                type: 'submit',
                className: 'btn btn-primary w-full',
                disabled: loading
              },
              loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'
            ),
            React.createElement(
              'div',
              {
                key: 'switch',
                className: 'text-center text-sm',
                style: { color: 'var(--muted-foreground)' }
              },
              [
                React.createElement(
                  'span',
                  { key: 'text' },
                  mode === 'login' ? "Don't have an account? " : "Already have an account? "
                ),
                React.createElement(
                  'button',
                  {
                    key: 'button',
                    type: 'button',
                    onClick: () => onModeChange(mode === 'login' ? 'register' : 'login'),
                    className: 'font-medium',
                    style: { 
                      color: 'var(--primary)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer'
                    }
                  },
                  mode === 'login' ? 'Sign up' : 'Login'
                )
              ]
            )
          ]
        )
      ]
    )
  );
};

export default AuthModal;