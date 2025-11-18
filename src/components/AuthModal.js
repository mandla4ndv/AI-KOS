import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { auth } from '../config/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';

const AuthModal = ({ open, onOpenChange }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
        addToast({
          title: 'Welcome back!',
          description: 'Successfully logged in',
          variant: 'success',
        });
      } else {
        // Register
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name.trim()) {
          await updateProfile(userCredential.user, {
            displayName: name.trim()
          });
        }
        addToast({
          title: 'Account created!',
          description: 'Welcome to Recipe Generator',
          variant: 'success',
        });
      }
      onOpenChange(false);
      setEmail('');
      setPassword('');
      setName('');
    } catch (error) {
      console.error('Auth error:', error);
      let message = 'An error occurred during authentication';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'Email is already in use';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email address';
          break;
        case 'auth/weak-password':
          message = 'Password should be at least 6 characters';
          break;
        case 'auth/user-not-found':
          message = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          message = 'Incorrect password';
          break;
        default:
          message = error.message;
      }
      
      addToast({
        title: 'Authentication failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
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
        className: 'glass-card rounded-xl p-6 mx-4 max-w-md w-full animate-scale-in'
      },
      [
        React.createElement(
          'div',
          { key: 'header', className: 'flex items-center justify-between mb-6' },
          [
            React.createElement(
              'h2',
              { key: 'title', className: 'text-xl font-bold' },
              isLogin ? 'Sign In' : 'Create Account'
            ),
            React.createElement(
              'button',
              {
                key: 'close',
                onClick: () => onOpenChange(false),
                className: 'btn btn-ghost btn-sm',
                style: { background: 'none', border: 'none' }
              },
              React.createElement(X, { size: 20 })
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
            !isLogin && React.createElement(
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
                  'Full Name'
                ),
                React.createElement(
                  'div',
                  {
                    key: 'input-container',
                    className: 'relative'
                  },
                  [
                    React.createElement(User, {
                      key: 'icon',
                      size: 16,
                      className: 'absolute left-3 top-1/2 transform -translate-y-1/2',
                      style: { color: 'var(--muted-foreground)' }
                    }),
                    React.createElement('input', {
                      key: 'input',
                      id: 'name',
                      type: 'text',
                      placeholder: 'Enter your name',
                      value: name,
                      onChange: (e) => setName(e.target.value),
                      className: 'input pl-10 w-full',
                      required: !isLogin
                    })
                  ]
                )
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
                React.createElement(
                  'div',
                  {
                    key: 'input-container',
                    className: 'relative'
                  },
                  [
                    React.createElement(Mail, {
                      key: 'icon',
                      size: 16,
                      className: 'absolute left-3 top-1/2 transform -translate-y-1/2',
                      style: { color: 'var(--muted-foreground)' }
                    }),
                    React.createElement('input', {
                      key: 'input',
                      id: 'email',
                      type: 'email',
                      placeholder: 'Enter your email',
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      className: 'input pl-10 w-full',
                      required: true
                    })
                  ]
                )
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
                React.createElement(
                  'div',
                  {
                    key: 'input-container',
                    className: 'relative'
                  },
                  [
                    React.createElement(Lock, {
                      key: 'icon',
                      size: 16,
                      className: 'absolute left-3 top-1/2 transform -translate-y-1/2',
                      style: { color: 'var(--muted-foreground)' }
                    }),
                    React.createElement('input', {
                      key: 'input',
                      id: 'password',
                      type: 'password',
                      placeholder: 'Enter your password',
                      value: password,
                      onChange: (e) => setPassword(e.target.value),
                      className: 'input pl-10 w-full',
                      required: true,
                      minLength: 6
                    })
                  ]
                )
              ]
            ),
            React.createElement(
              'button',
              {
                key: 'submit',
                type: 'submit',
                disabled: loading,
                className: 'btn btn-primary w-full gap-2'
              },
              loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')
            )
          ]
        ),
        React.createElement(
          'div',
          {
            key: 'switch',
            className: 'text-center mt-4'
          },
          [
            React.createElement(
              'p',
              {
                key: 'text',
                className: 'text-sm',
                style: { color: 'var(--muted-foreground)' }
              },
              isLogin ? "Don't have an account? " : 'Already have an account? '
            ),
            React.createElement(
              'button',
              {
                key: 'button',
                onClick: () => setIsLogin(!isLogin),
                className: 'text-primary hover:underline font-medium',
                style: { background: 'none', border: 'none' }
              },
              isLogin ? 'Sign up' : 'Sign in'
            )
          ]
        )
      ]
    )
  );
};

export default AuthModal;