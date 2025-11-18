import React, { useState, useEffect } from 'react';
import { ChefHat, Plus } from 'lucide-react';
import SavedRecipeCard from '../components/SavedRecipeCard';
import { useAuth } from '../contexts/AuthContext';
import { getUserRecipes } from '../services/databaseService';
import { useToast } from '../contexts/ToastContext';
import '../styles/MyRecipesPage.css';

const MyRecipesPage = ({ onAuthRequired }) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { addToast } = useToast();

  const loadRecipes = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userRecipes = await getUserRecipes(user.uid);
      setRecipes(userRecipes);
    } catch (error) {
      console.error('Error loading recipes:', error);
      addToast({
        title: 'Error loading recipes',
        description: 'Failed to load your saved recipes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [user]);

  const handleRecipeDeleted = () => {
    loadRecipes();
    addToast({
      title: 'Recipe deleted',
      description: 'The recipe has been removed from your collection',
    });
  };

  if (!user) {
    return React.createElement(
      'div',
      { className: 'min-h-screen flex flex-col' },
      React.createElement(
        'main',
        { className: 'flex-1', style: { backgroundColor: 'var(--muted)', opacity: 0.3 } },
        React.createElement(
          'div',
          { className: 'container py-8 md:py-12' },
          React.createElement(
            'div',
            {
              key: 'not-logged-in',
              className: 'flex flex-col items-center justify-center py-16 px-4'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'icon',
                  className: 'rounded-full p-6 mb-6',
                  style: { backgroundColor: 'var(--muted)' }
                },
                React.createElement(ChefHat, { size: 64, style: { color: 'var(--muted-foreground)' } })
              ),
              React.createElement(
                'h2',
                {
                  key: 'title',
                  className: 'text-2xl font-semibold mb-2'
                },
                'Login Required'
              ),
              React.createElement(
                'p',
                {
                  key: 'description',
                  className: 'text-center mb-6 max-w-md leading-relaxed',
                  style: { color: 'var(--muted-foreground)' }
                },
                'Please log in to view and manage your saved recipes'
              ),
              React.createElement(
                'button',
                {
                  key: 'action',
                  onClick: onAuthRequired,
                  className: 'btn btn-primary btn-lg gap-2'
                },
                [
                  React.createElement(Plus, { key: 'icon', size: 20 }),
                  'Login to View Recipes'
                ]
              )
            ]
          )
        )
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'min-h-screen flex flex-col' },
    React.createElement(
      'main',
      { className: 'flex-1', style: { backgroundColor: 'var(--muted)', opacity: 0.3 } },
      React.createElement(
        'div',
        { className: 'container py-8 md:py-12' },
        [
          React.createElement(
            'div',
            {
              key: 'header',
              className: 'flex items-center justify-between mb-8'
            },
            [
              React.createElement(
                'div',
                { key: 'title' },
                [
                  React.createElement(
                    'h1',
                    {
                      key: 'main',
                      className: 'text-3xl md:text-4xl font-bold mb-2'
                    },
                    'My Recipes'
                  ),
                  React.createElement(
                    'p',
                    {
                      key: 'subtitle',
                      style: { color: 'var(--muted-foreground)' }
                    },
                    isLoading ? 'Loading...' :
                    recipes.length === 0
                      ? 'No saved recipes yet'
                      : `${recipes.length} saved ${recipes.length === 1 ? 'recipe' : 'recipes'}`
                  )
                ]
              ),
              React.createElement(
                'button',
                {
                  key: 'new-recipe',
                  onClick: () => window.location.hash = 'home',
                  className: 'btn btn-primary gap-2'
                },
                [
                  React.createElement(Plus, { key: 'icon', size: 20 }),
                  'New Recipe'
                ]
              )
            ]
          ),
          isLoading ? React.createElement(
            'div',
            {
              key: 'loading',
              className: 'flex items-center justify-center py-12'
            },
            React.createElement(
              'div',
              { className: 'text-center' },
              [
                React.createElement(
                  'div',
                  {
                    key: 'spinner',
                    className: 'h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4'
                  }
                ),
                React.createElement(
                  'p',
                  {
                    key: 'text',
                    style: { color: 'var(--muted-foreground)' }
                  },
                  'Loading your recipes...'
                )
              ]
            )
          ) : recipes.length > 0 ? React.createElement(
            'div',
            {
              key: 'grid',
              className: 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            },
            recipes.map((recipe) =>
              React.createElement(SavedRecipeCard, {
                key: recipe.id,
                recipe: recipe,
                userId: user.uid,
                onDelete: handleRecipeDeleted,
                onAuthRequired: onAuthRequired
              })
            )
          ) : React.createElement(
            'div',
            {
              key: 'empty',
              className: 'flex flex-col items-center justify-center py-16 px-4'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'icon',
                  className: 'rounded-full p-6 mb-6',
                  style: { backgroundColor: 'var(--muted)' }
                },
                React.createElement(ChefHat, { size: 64, style: { color: 'var(--muted-foreground)' } })
              ),
              React.createElement(
                'h2',
                {
                  key: 'title',
                  className: 'text-2xl font-semibold mb-2'
                },
                'No recipes yet'
              ),
              React.createElement(
                'p',
                {
                  key: 'description',
                  className: 'text-center mb-6 max-w-md leading-relaxed',
                  style: { color: 'var(--muted-foreground)' }
                },
                'Start by generating a recipe from your ingredients and save it after cooking'
              ),
              React.createElement(
                'button',
                {
                  key: 'action',
                  onClick: () => window.location.hash = 'home',
                  className: 'btn btn-primary btn-lg gap-2'
                },
                [
                  React.createElement(Plus, { key: 'icon', size: 20 }),
                  'Create Your First Recipe'
                ]
              )
            ]
          )
        ]
      )
    )
  );
};

export default MyRecipesPage;