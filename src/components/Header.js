import React, { useState } from 'react';
import { Menu, X, ChefHat, User } from 'lucide-react';
import AuthModal from './AuthModal';

const Header = ({ currentPage, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
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
          className: 'sticky top-0 z-50 w-full border-b glass-header'
        },
        React.createElement(
          'div',
          { className: 'container flex h-16 items-center justify-between' },
          [
            React.createElement(
              'button',
              {
                key: 'logo',
                onClick: () => onNavigate('home'),
                className: 'flex items-center gap-2 font-semibold text-xl transition-transform hover:scale-105',
                style: { background: 'none', border: 'none', cursor: 'pointer' }
              },
              [
                React.createElement(ChefHat, { key: 'icon', size: 28, color: 'var(--primary)' }),
                React.createElement(
                  'span',
                  { key: 'text', style: { color: 'var(--primary)' } },
                  'AI-KOS'
                )
              ]
            ),
            React.createElement(
              'nav',
              { key: 'desktop-nav', className: 'hidden md:flex items-center gap-6' },
              navItems.map(item =>
                React.createElement(
                  'button',
                  {
                    key: item.key,
                    onClick: () => onNavigate(item.key),
                    className: 'text-sm font-medium transition-colors',
                    style: {
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: currentPage === item.key ? 'var(--primary)' : 'var(--foreground)'
                    }
                  },
                  item.label
                )
              ).concat(
                !user && React.createElement(
                  'button',
                  {
                    key: 'login',
                    onClick: () => openAuthModal('login'),
                    className: 'btn-ghost btn-sm',
                    style: { background: 'none', border: 'none' }
                  },
                  'Login'
                )
              )
            ),
            React.createElement(
              'div',
              { key: 'user-section', className: 'hidden md:block' },
              user ? React.createElement(
                'div',
                { className: 'flex items-center gap-2' },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'avatar',
                      className: 'w-10 h-10 rounded-full flex items-center justify-center',
                      style: { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }
                    },
                    user.name.charAt(0).toUpperCase()
                  ),
                  React.createElement(
                    'button',
                    {
                      key: 'logout',
                      onClick: () => setUser(null),
                      className: 'btn-ghost btn-sm'
                    },
                    'Logout'
                  )
                ]
              ) : React.createElement(
                'button',
                {
                  onClick: () => openAuthModal('login'),
                  className: 'btn-ghost',
                  style: { background: 'none', border: 'none' }
                },
                React.createElement(User, { size: 20 })
              )
            ),
            React.createElement(
              'button',
              {
                key: 'mobile-menu',
                onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                className: 'btn-ghost md:hidden',
                style: { background: 'none', border: 'none' }
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
          className: 'md:hidden border-t glass-card animate-slide-up'
        },
        React.createElement(
          'nav',
          { className: 'container flex flex-col gap-4 py-4' },
          navItems.map(item =>
            React.createElement(
              'button',
              {
                key: item.key,
                onClick: () => {
                  onNavigate(item.key);
                  setMobileMenuOpen(false);
                },
                className: 'text-sm font-medium transition-colors',
                style: {
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: currentPage === item.key ? 'var(--primary)' : 'var(--foreground)'
                }
              },
              item.label
            )
          ).concat(
            !user ? React.createElement(
              'button',
              {
                key: 'mobile-login',
                onClick: () => {
                  openAuthModal('login');
                  setMobileMenuOpen(false);
                },
                className: 'btn-primary touch-target w-full'
              },
              'Login'
            ) : React.createElement(
              'button',
              {
                key: 'mobile-logout',
                onClick: () => {
                  setUser(null);
                  setMobileMenuOpen(false);
                },
                className: 'btn-outline touch-target w-full'
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