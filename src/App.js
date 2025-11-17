import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import MyRecipesPage from './pages/MyRecipesPage';
import AboutPage from './pages/AboutPage';
import CookPage from './pages/CookPage';
import Toast from './components/Toast';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [toasts, setToasts] = useState([]);

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
        return <ExplorePage />;
      case 'my-recipes':
        return <MyRecipesPage />;
      case 'about':
        return <AboutPage />;
      case 'cook':
        return <CookPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ToastProvider value={{ addToast, removeToast }}>
      <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        <Header currentPage={currentPage} onNavigate={setCurrentPage} />
        {renderPage()}
        <Toast toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastProvider>
  );
}

export default App;