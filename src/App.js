import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import CookingMode from './components/CookingMode';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import HomePage from './pages/HomePage';
import MyRecipesPage from './pages/MyRecipesPage';
import CookPage from './pages/CookPage';
import ExplorePage from './pages/ExplorePage';
import AboutPage from './pages/AboutPage';
import './App.css';

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [showCookingMode, setShowCookingMode] = useState(false);

  // Handle hash-based routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      
      if (hash === 'cook') {
        const savedRecipe = sessionStorage.getItem('currentRecipe');
        if (savedRecipe) {
          try {
            const recipe = JSON.parse(savedRecipe);
            setCurrentRecipe(recipe);
            setShowCookingMode(true);
          } catch (error) {
            console.error('Error parsing saved recipe:', error);
            window.location.hash = 'home';
          }
        } else {
          window.location.hash = 'home';
        }
      } else {
        setShowCookingMode(false);
        setActivePage(hash || 'home');
      }
    };

    // Initial check
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStartCooking = (recipe) => {
    sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
    setCurrentRecipe(recipe);
    setShowCookingMode(true);
    window.location.hash = 'cook';
  };

  const handleCompleteCooking = () => {
    setShowCookingMode(false);
    setCurrentRecipe(null);
    sessionStorage.removeItem('currentRecipe');
    window.location.hash = 'home';
    
    // Show completion toast
    if (window.toastContext) {
      window.toastContext.addToast({
        title: 'Cooking completed!',
        description: 'Great job! Recipe has been saved to your collection.',
        variant: 'success',
      });
    }
  };

  const handleExitCooking = () => {
    setShowCookingMode(false);
    setCurrentRecipe(null);
    sessionStorage.removeItem('currentRecipe');
    window.location.hash = 'home';
  };

  const renderPage = () => {
    if (showCookingMode && currentRecipe) {
      return React.createElement(CookingMode, {
        key: 'cooking-mode',
        recipe: currentRecipe,
        onComplete: handleCompleteCooking,
        onExit: handleExitCooking
      });
    }

    switch (activePage) {
      case 'home':
        return React.createElement(HomePage, { 
          key: 'home',
          onAuthRequired: () => setShowAuthModal(true),
          onStartCooking: handleStartCooking
        });
      case 'explore':
        return React.createElement(ExplorePage, { 
          key: 'explore',
          onStartCooking: handleStartCooking
        });
      case 'my-recipes':
        return React.createElement(MyRecipesPage, { 
          key: 'my-recipes',
          onAuthRequired: () => setShowAuthModal(true),
          onStartCooking: handleStartCooking
        });
      case 'about':
        return React.createElement(AboutPage, { key: 'about' });
      default:
        return React.createElement(HomePage, { 
          key: 'home',
          onAuthRequired: () => setShowAuthModal(true),
          onStartCooking: handleStartCooking
        });
    }
  };

  // Store toast context globally for access in completion handler
  const handleToastProviderMount = (toastContext) => {
    window.toastContext = toastContext;
  };

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      ToastProvider,
      { onMount: handleToastProviderMount },
      React.createElement(
        AuthProvider,
        null,
        [
          !showCookingMode && React.createElement(Header, {
            key: 'header',
            currentPage: activePage,
            onPageChange: setActivePage,
            onAuthClick: () => setShowAuthModal(true)
          }),
          React.createElement('main', { key: 'main' }, renderPage()),
          React.createElement(AuthModal, {
            key: 'auth-modal',
            open: showAuthModal,
            onOpenChange: setShowAuthModal
          })
        ]
      )
    )
  );
};

export default App;