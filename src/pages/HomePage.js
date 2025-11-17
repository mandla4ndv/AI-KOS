import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import IngredientInput from '../components/IngredientInput';
import RecipeCard from '../components/RecipeCard';
import RecipeSkeleton from '../components/RecipeSkeleton';
import { useToast } from '../contexts/ToastContext';
import { generateRecipe } from '../services/recipeService';

const HomePage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToast } = useToast();

  const handleGenerateRecipe = async () => {
    if (ingredients.length < 1) {
      addToast({
        title: 'Add ingredients first',
        description: 'Please add at least 1 ingredient to generate a recipe',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setRecipe(null);

    try {
      console.log("Starting recipe generation with:", ingredients);
      const generatedRecipe = await generateRecipe(ingredients);
      setRecipe(generatedRecipe);

      addToast({
        title: 'Recipe generated!',
        description: 'Your AI-powered recipe is ready',
      });
    } catch (error) {
      console.error("Recipe generation error:", error);
      addToast({
        title: 'Generation failed',
        description: error.message || 'Could not generate recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartCooking = () => {
    if (recipe) {
      sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
      window.location.href = '/#cook';
    }
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen flex flex-col' },
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
              key: 'hero',
              className: 'max-w-3xl mx-auto text-center mb-12 animate-fade-in'
            },
            [
              React.createElement(
                'h1',
                {
                  key: 'title',
                  className: 'text-4xl md:text-5xl font-bold mb-4 text-balance'
                },
                'Turn Ingredients into ',
                React.createElement(
                  'span',
                  { style: { color: 'var(--primary)' } },
                  'Delicious Recipes'
                )
              ),
              React.createElement(
                'p',
                {
                  key: 'subtitle',
                  className: 'text-lg leading-relaxed',
                  style: { color: 'var(--muted-foreground)' }
                },
                'Add your available ingredients and let AI create a perfect recipe for you'
              )
            ]
          ),
          React.createElement(
            'div',
            {
              key: 'content',
              className: 'max-w-5xl mx-auto grid gap-8 lg:grid-cols-[1fr,1.5fr]'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'input',
                  className: 'space-y-6 animate-slide-up'
                },
                React.createElement(
                  'div',
                  { className: 'card rounded-xl p-6' },
                  [
                    React.createElement(
                      'h2',
                      {
                        key: 'title',
                        className: 'text-xl font-semibold mb-4'
                      },
                      'Your Ingredients'
                    ),
                    React.createElement(IngredientInput, {
                      key: 'input',
                      ingredients: ingredients,
                      onIngredientsChange: setIngredients
                    }),
                    !recipe && !isGenerating && React.createElement(
                      'div',
                      {
                        key: 'placeholder',
                        className: 'rounded-lg border p-6 flex flex-col items-center justify-center text-center my-6',
                        style: { backgroundColor: 'var(--muted)', borderColor: 'var(--border)' }
                      },
                      [
                        React.createElement(Sparkles, {
                          key: 'icon',
                          size: 48,
                          style: { color: 'var(--primary)', marginBottom: '12px' }
                        }),
                        React.createElement(
                          'h3',
                          {
                            key: 'title',
                            className: 'text-lg font-semibold mb-2'
                          },
                          'Ready to Cook?'
                        ),
                        React.createElement(
                          'p',
                          {
                            key: 'desc',
                            className: 'text-sm leading-relaxed',
                            style: { color: 'var(--muted-foreground)' }
                          },
                          'Add ingredients below or upload a photo'
                        )
                      ]
                    ),
                    React.createElement(
                      'button',
                      {
                        key: 'generate',
                        className: 'btn btn-primary w-full mt-6 gap-2',
                        onClick: handleGenerateRecipe,
                        disabled: ingredients.length < 1 || isGenerating
                      },
                      [
                        React.createElement(Sparkles, { key: 'icon', size: 20 }),
                        isGenerating ? 'Generating...' : 'Generate Recipe'
                      ]
                    )
                  ]
                )
              ),
              React.createElement(
                'div',
                {
                  key: 'recipe',
                  className: 'animate-slide-up'
                },
                isGenerating ? React.createElement(RecipeSkeleton, { key: 'skeleton' }) :
                recipe && !isGenerating && React.createElement(
                  'div',
                  { key: 'recipe-content', className: 'space-y-4 animate-fade-in' },
                  [
                    React.createElement(RecipeCard, {
                      key: 'card',
                      recipe: recipe
                    }),
                    React.createElement(
                      'div',
                      {
                        key: 'actions',
                        className: 'flex gap-3'
                      },
                      [
                        React.createElement(
                          'button',
                          {
                            key: 'cook',
                            onClick: handleStartCooking,
                            className: 'btn btn-primary flex-1 btn-lg'
                          },
                          'Start Cooking'
                        ),
                        React.createElement(
                          'button',
                          {
                            key: 'new',
                            onClick: handleGenerateRecipe,
                            className: 'btn btn-outline btn-lg gap-2'
                          },
                          [
                            React.createElement(Sparkles, { key: 'icon', size: 20 }),
                            'New Recipe'
                          ]
                        )
                      ]
                    )
                  ]
                )
              )
            ]
          )
        ]
      )
    )
  );
};

export default HomePage;