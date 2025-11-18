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
      { className: 'min-h-screen bg-background' },
      React.createElement(
        'main',
        { className: 'flex-1' },
        React.createElement(
          'div',
          { className: 'container py-8 md:py-12' },
          React.createElement(
            'div',
            {
              key: 'not-logged-in',
              className: 'my-recipes-login-required'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'icon',
                  className: 'my-recipes-login-icon'
                },
                React.createElement(ChefHat, { size: 64 })
              ),
              React.createElement(
                'h2',
                {
                  key: 'title',
                  className: 'my-recipes-login-title'
                },
                'Login Required'
              ),
              React.createElement(
                'p',
                {
                  key: 'description',
                  className: 'my-recipes-login-description'
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
    { className: 'min-h-screen bg-background' },
    React.createElement(
      'main',
      { className: 'flex-1' },
      React.createElement(
        'div',
        { className: 'container py-8 md:py-12' },
        [
          React.createElement(
            'div',
            {
              key: 'header',
              className: 'my-recipes-header'
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
                      className: 'my-recipes-title'
                    },
                    'My Recipes'
                  ),
                  React.createElement(
                    'p',
                    {
                      key: 'subtitle',
                      className: 'my-recipes-subtitle'
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
                  className: 'btn btn-primary gap-2 my-recipes-new-button'
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
              className: 'my-recipes-loading'
            },
            React.createElement(
              'div',
              { className: 'text-center' },
              [
                React.createElement(
                  'div',
                  {
                    key: 'spinner',
                    className: 'my-recipes-loading-spinner'
                  }
                ),
                React.createElement(
                  'p',
                  {
                    key: 'text',
                    className: 'my-recipes-loading-text'
                  },
                  'Loading your recipes...'
                )
              ]
            )
          ) : recipes.length > 0 ? React.createElement(
            'div',
            {
              key: 'grid',
              className: 'my-recipes-grid'
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
              className: 'my-recipes-empty'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'icon',
                  className: 'my-recipes-empty-icon'
                },
                React.createElement(ChefHat, { size: 64 })
              ),
              React.createElement(
                'h2',
                {
                  key: 'title',
                  className: 'my-recipes-empty-title'
                },
                'No recipes yet'
              ),
              React.createElement(
                'p',
                {
                  key: 'description',
                  className: 'my-recipes-empty-description'
                },
                'Start by generating a recipe from your ingredients and save it after cooking'
              ),
              React.createElement(
                'button',
                {
                  key: 'action',
                  onClick: () => window.location.hash = 'home',
                  className: 'btn btn-primary btn-lg gap-2 my-recipes-empty-button'
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