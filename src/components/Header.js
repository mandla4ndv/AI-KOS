import React, { useState, useEffect } from 'react';
import { Menu, X, ChefHat, User } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import AuthModal from './AuthModal';
import '../styles/Header.css';

const Header = ({ currentPage, onPageChange, onAuthClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser({
          uid: user.uid,
          name: user.displayName || 'Chef User',
          email: user.email
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'explore', label: 'Explore' },
    { key: 'my-recipes', label: 'My Recipes' },
    { key: 'about', label: 'About Us' }
  ];

  return React.createElement(
    React.Fragment,
    null,
    [
      React.createElement(
        'header',
        {
          key: 'header',
          className: 'header'
        },
        React.createElement(
          'div',
          { className: 'header-container' },
          [
            React.createElement(
              'button',
              {
                key: 'logo',
                onClick: () => onPageChange('home'),
                className: 'header-logo'
              },
              [
                React.createElement(ChefHat, { key: 'icon', size: 28 }),
                React.createElement(
                  'span',
                  { key: 'text' },
                  'AI-KOS'
                )
              ]
            ),
            React.createElement(
              'nav',
              { key: 'desktop-nav', className: 'header-nav' },
              navItems.map(item =>
                React.createElement(
                  'button',
                  {
                    key: item.key,
                    onClick: () => onPageChange(item.key),
                    className: `nav-button ${currentPage === item.key ? 'active' : ''}`
                  },
                  item.label
                )
              )
            ),
            React.createElement(
              'div',
              { key: 'user-section', className: 'header-user-section' },
              user ? React.createElement(
                'div',
                { className: 'user-container' },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'avatar',
                      className: 'user-avatar'
                    },
                    user.name.charAt(0).toUpperCase()
                  ),
                  React.createElement(
                    'button',
                    {
                      key: 'logout',
                      onClick: handleLogout,
                      className: 'user-logout-button'
                    },
                    'Logout'
                  )
                ]
              ) : React.createElement(
                'button',
                {
                  onClick: onAuthClick,
                  className: 'user-login-button'
                },
                React.createElement(User, { size: 20 })
              )
            ),
            React.createElement(
              'button',
              {
                key: 'mobile-menu',
                onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                className: 'mobile-menu-button'
              },
              mobileMenuOpen ? React.createElement(X, { size: 20 }) : React.createElement(Menu, { size: 20 })
            )
          ]
        )
      ),
      mobileMenuOpen && React.createElement(
        'div',
        {
          key: 'mobile-nav',
          className: 'mobile-nav'
        },
        React.createElement(
          'div',
          { className: 'mobile-nav-container' },
          navItems.map(item =>
            React.createElement(
              'button',
              {
                key: item.key,
                onClick: () => {
                  onPageChange(item.key);
                  setMobileMenuOpen(false);
                },
                className: `mobile-nav-button ${currentPage === item.key ? 'active' : ''}`
              },
              item.label
            )
          ).concat(
            !user ? React.createElement(
              'button',
              {
                key: 'mobile-login',
                onClick: () => {
                  onAuthClick();
                  setMobileMenuOpen(false);
                },
                className: 'mobile-login-button'
              },
              'Login'
            ) : React.createElement(
              'button',
              {
                key: 'mobile-logout',
                onClick: () => {
                  handleLogout();
                  setMobileMenuOpen(false);
                },
                className: 'mobile-logout-button'
              },
              'Logout'
            )
          )
        )
      ),
      React.createElement(AuthModal, {
        key: 'auth-modal',
        open: authModalOpen,
        onOpenChange: setAuthModalOpen,
        mode: authMode,
        onModeChange: setAuthMode,
        onSuccess: (userData) => {
          setUser(userData);
          setAuthModalOpen(false);
        }
      })
    ]
  );
};

export default Header;