import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MyRecipesPage from './pages/MyRecipesPage';
import AboutPage from './pages/AboutPage';
import CookPage from './pages/CookPage';
import Toast from './components/Toast';
import { ToastProvider } from './contexts/ToastContext';
import './index.css';
import './styles/components.css';
import './styles/layout.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'explore', 'my-recipes', 'about', 'cook'].includes(hash)) {
        setCurrentPage(hash);
      } else {
        window.location.hash = 'home';
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const addToast = (toast) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'explore':
        return React.createElement(ExplorePage, { key: 'explore-page' });
      case 'my-recipes':
        return React.createElement(MyRecipesPage, { key: 'my-recipes-page' });
      case 'about':
        return React.createElement(AboutPage, { key: 'about-page' });
      case 'cook':
        return React.createElement(CookPage, { key: 'cook-page' });
      default:
        return React.createElement(HomePage, { key: 'home-page' });
    }
  };

  return React.createElement(
    ToastProvider,
    { value: { addToast, removeToast } },
    React.createElement(
      'div',
      { 
        className: 'min-h-screen',
        style: { backgroundColor: 'var(--background)' }
      },
      [
        React.createElement(Header, {
          key: 'header',
          currentPage: currentPage,
          onNavigate: setCurrentPage
        }),
        renderPage(),
        React.createElement(Toast, {
          key: 'toast',
          toasts: toasts,
          onRemove: removeToast
        })
      ]
    )
  );
}

export default App;