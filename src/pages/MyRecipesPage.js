import React, { useState, useEffect } from 'react';
import { ChefHat, Plus } from 'lucide-react';
import SavedRecipeCard from '../components/SavedRecipeCard';
import { getSavedRecipes } from '../services/storageService';
import '../styles/MyRecipesPage.css';

const MyRecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadRecipes = () => {
    const savedRecipes = getSavedRecipes();
    setRecipes(savedRecipes);
    setIsLoading(false);
  };

  useEffect(() => {
    loadRecipes();
  }, []);

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
                  onClick: () => window.location.href = '/#home',
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
                  'Loading recipes...'
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
                onDelete: loadRecipes
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
                  onClick: () => window.location.href = '/#home',
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