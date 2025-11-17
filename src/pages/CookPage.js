import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import CookingMode from '../components/CookingMode';
import RatingDialog from '../components/RatingDialog';
import { saveRecipe } from '../services/storageService';

const CookPage = () => {
  const [recipe, setRecipe] = useState(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const storedRecipe = sessionStorage.getItem('currentRecipe');
    if (storedRecipe) {
      setRecipe(JSON.parse(storedRecipe));
    } else {
      window.location.href = '/#home';
    }
  }, []);

  const handleComplete = () => {
    setShowRatingDialog(true);
  };

  const handleRate = (rating) => {
    if (recipe) {
      saveRecipe(recipe, rating);
      addToast({
        title: 'Recipe saved!',
        description: 'Your recipe has been added to My Recipes',
      });
      window.location.href = '/#my-recipes';
    }
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit cooking mode?')) {
      window.location.href = '/#home';
    }
  };

  if (!recipe) {
    return React.createElement(
      'div',
      { className: 'min-h-screen flex items-center justify-center' },
      React.createElement(
        'div',
        { className: 'text-center' },
        [
          React.createElement(
            'div',
            {
              key: 'spinner',
              className: 'h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4'
            }
          ),
          React.createElement(
            'p',
            {
              key: 'text',
              style: { color: 'var(--muted-foreground)' }
            },
            'Loading recipe...'
          )
        ]
      )
    );
  }

  return React.createElement(
    React.Fragment,
    null,
    [
      React.createElement(CookingMode, {
        key: 'cooking-mode',
        recipe: recipe,
        onComplete: handleComplete,
        onExit: handleExit
      }),
      React.createElement(RatingDialog, {
        key: 'rating-dialog',
        open: showRatingDialog,
        onOpenChange: setShowRatingDialog,
        recipeTitle: recipe.title,
        onRate: handleRate
      })
    ]
  );
};

export default CookPage;