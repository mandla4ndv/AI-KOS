import React, { useState, useEffect } from 'react';
import { useToast } from '../contexts/ToastContext';
import CookingMode from '../components/CookingMode';
import RatingDialog from '../components/RatingDialog';
import { saveRecipe } from '../services/storageService';
import '../styles/CookPage.css';

const CookPage = () => {
  const [recipe, setRecipe] = useState(null);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const storedRecipe = sessionStorage.getItem('currentRecipe');
    if (storedRecipe) {
      setRecipe(JSON.parse(storedRecipe));
    } else {
      // Try to get recipe from URL hash
      const hash = window.location.hash;
      if (hash.startsWith('#recipe-')) {
        const recipeId = hash.replace('#recipe-', '');
        const savedRecipes = JSON.parse(localStorage.getItem('recipeai_saved_recipes') || '[]');
        const foundRecipe = savedRecipes.find(r => r.id === recipeId);
        if (foundRecipe) {
          setRecipe(foundRecipe);
          sessionStorage.setItem('currentRecipe', JSON.stringify(foundRecipe));
        } else {
          window.location.hash = 'home';
          addToast({
            title: 'Recipe not found',
            description: 'Please generate a recipe first',
            variant: 'destructive',
          });
        }
      } else {
        window.location.hash = 'home';
        addToast({
          title: 'No recipe selected',
          description: 'Please generate a recipe first',
          variant: 'destructive',
        });
      }
    }
  }, [addToast]);

  const handleComplete = () => {
    setShowRatingDialog(true);
  };

  const handleRate = (rating, comment = '') => {
    if (recipe) {
      saveRecipe(recipe, rating);
      addToast({
        title: 'Recipe saved!',
        description: comment ? 'Your recipe and rating have been saved' : 'Your recipe has been added to My Recipes',
      });
      window.location.hash = 'my-recipes';
    }
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit cooking mode?')) {
      window.location.hash = 'home';
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
        currentRating: 0,
        onRate: handleRate
      })
    ]
  );
};

export default CookPage;