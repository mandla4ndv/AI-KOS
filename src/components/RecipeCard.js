import React, { useState, useEffect } from 'react';
import { Clock, Users, ChefHat, Heart, Star, Share2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { saveRecipeToDB, deleteRecipeFromDB, updateRecipeRating, isRecipeSavedForUser } from '../services/databaseService';
import RatingDialog from './RatingDialog';
import ShareModal from './ShareModal';
import '../styles/RecipeCard.css';

const RecipeCard = ({ recipe, userId, onAuthRequired }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [currentRating, setCurrentRating] = useState(0);
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth();

  // Check if recipe is saved when component mounts
  useEffect(() => {
    const checkIfSaved = async () => {
      if (user && userId) {
        try {
          const saved = await isRecipeSavedForUser(userId, recipe.id);
          setIsSaved(saved);
        } catch (error) {
          console.error('Error checking if recipe saved:', error);
        }
      }
    };

    checkIfSaved();
  }, [user, userId, recipe.id]);

  const difficultyColors = {
    Easy: 'badge-secondary',
    Medium: 'badge-primary',
    Hard: 'badge-destructive'
  };

  const handleSave = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        await deleteRecipeFromDB(userId, recipe.id);
        setIsSaved(false);
        addToast({
          title: 'Recipe removed',
          description: 'Recipe has been removed from your collection',
        });
      } else {
        await saveRecipeToDB(userId, {
          ...recipe,
          userRating: currentRating,
          savedAt: new Date()
        });
        setIsSaved(true);
        addToast({
          title: 'Recipe saved!',
          description: 'Added to your recipe collection',
        });
      }
    } catch (error) {
      console.error('Error saving/deleting recipe:', error);
      addToast({
        title: 'Error',
        description: 'Failed to update recipe. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (rating, comment = '') => {
    if (!user) {
      onAuthRequired();
      return;
    }

    try {
      await updateRecipeRating(userId, recipe.id, rating, comment);
      setCurrentRating(rating);
      addToast({
        title: 'Rating saved!',
        description: comment ? `You rated this recipe ${rating} stars with a comment` : `You rated this recipe ${rating} stars`,
      });
    } catch (error) {
      console.error('Error updating rating:', error);
      addToast({
        title: 'Error',
        description: 'Failed to save rating. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStartCooking = () => {
    sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
    window.location.hash = 'cook';
    addToast({
      title: 'Cooking mode started!',
      description: 'Enjoy cooking your recipe',
    });
  };

  const StarRatingDisplay = ({ rating, size = 16 }) => {
    return React.createElement(
      'div',
      { className: 'flex gap-1' },
      [1, 2, 3, 4, 5].map((star) =>
        React.createElement(Star, {
          key: star,
          size: size,
          fill: star <= rating ? 'var(--primary)' : 'none',
          color: star <= rating ? 'var(--primary)' : 'var(--muted-foreground)'
        })
      )
    );
  };

  return React.createElement(
    React.Fragment,
    null,
    [
      React.createElement(
        'div',
        { 
          key: 'recipe-card',
          className: 'glass-card rounded-xl overflow-hidden animate-slide-up'
        },
        [
          React.createElement(
            'div',
            { key: 'content', className: 'p-6' },
            [
              React.createElement(
                'div',
                {
                  key: 'header',
                  className: 'flex items-start justify-between gap-4 mb-4'
                },
                [
                  React.createElement(
                    'h2',
                    {
                      key: 'title',
                      className: 'text-2xl font-bold text-balance flex-1'
                    },
                    recipe.title
                  ),
                  React.createElement(
                    'span',
                    {
                      key: 'badge',
                      className: difficultyColors[recipe.difficulty]
                    },
                    recipe.difficulty
                  )
                ]
              ),
              React.createElement(
                'div',
                {
                  key: 'meta',
                  className: 'flex flex-wrap gap-4 text-sm mb-6',
                  style: { color: 'var(--muted-foreground)' }
                },
                [
                  React.createElement(
                    'div',
                    { key: 'time', className: 'flex items-center gap-1.5' },
                    [
                      React.createElement(Clock, { key: 'icon', size: 16 }),
                      `${recipe.prepTime} mins`
                    ]
                  ),
                  React.createElement(
                    'div',
                    { key: 'servings', className: 'flex items-center gap-1.5' },
                    [
                      React.createElement(Users, { key: 'icon', size: 16 }),
                      `${recipe.servings} servings`
                    ]
                  ),
                  React.createElement(
                    'div',
                    { key: 'steps', className: 'flex items-center gap-1.5' },
                    [
                      React.createElement(ChefHat, { key: 'icon', size: 16 }),
                      `${recipe.instructions.length} steps`
                    ]
                  )
                ]
              ),
              React.createElement(
                'div',
                { key: 'ingredients', className: 'mb-6' },
                [
                  React.createElement(
                    'h3',
                    {
                      key: 'title',
                      className: 'font-semibold text-lg mb-3'
                    },
                    'Ingredients'
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'list',
                      className: 'grid grid-cols-1 md:grid-cols-2 gap-2'
                    },
                    recipe.ingredients.map((ingredient, index) =>
                      React.createElement(
                        'div',
                        {
                          key: index,
                          className: 'flex items-center gap-2 text-sm rounded-lg px-3 py-2 stagger-item transition-transform hover:scale-105',
                          style: { backgroundColor: 'var(--muted)' }
                        },
                        [
                          React.createElement(
                            'div',
                            {
                              key: 'dot',
                              className: 'w-1.5 h-1.5 rounded-full',
                              style: { backgroundColor: 'var(--primary)' }
                            }
                          ),
                          React.createElement(
                            'span',
                            { key: 'text' },
                            `${ingredient.quantity}${ingredient.unit ? ` ${ingredient.unit}` : ''} ${ingredient.name}`
                          )
                        ]
                      )
                    )
                  )
                ]
              ),
              React.createElement(
                'div',
                { key: 'instructions', className: 'mb-6' },
                [
                  React.createElement(
                    'h3',
                    {
                      key: 'title',
                      className: 'font-semibold text-lg mb-3'
                    },
                    'Instructions'
                  ),
                  React.createElement(
                    'div',
                    { key: 'list', className: 'space-y-3' },
                    recipe.instructions.map((instruction) =>
                      React.createElement(
                        'div',
                        {
                          key: instruction.step,
                          className: 'flex gap-3 stagger-item'
                        },
                        [
                          React.createElement(
                            'div',
                            {
                              key: 'number',
                              className: 'flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold',
                              style: { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }
                            },
                            instruction.step
                          ),
                          React.createElement(
                            'div',
                            {
                              key: 'desc',
                              className: 'flex-1'
                            },
                            [
                              React.createElement(
                                'p',
                                {
                                  key: 'text',
                                  className: 'text-sm leading-relaxed pt-0.5'
                                },
                                instruction.description
                              ),
                              instruction.duration && React.createElement(
                                'div',
                                {
                                  key: 'duration',
                                  className: 'flex items-center gap-1 mt-2 text-xs',
                                  style: { color: 'var(--muted-foreground)' }
                                },
                                [
                                  React.createElement(Clock, { key: 'icon', size: 12 }),
                                  `Timer: ${instruction.duration} minutes`
                                ]
                              )
                            ]
                          )
                        ]
                      )
                    )
                  )
                ]
              ),
              React.createElement(
                'div',
                {
                  key: 'actions',
                  className: 'pt-4 border-t',
                  style: { borderColor: 'var(--border)' }
                },
                React.createElement(
                  'div',
                  { className: 'flex items-center justify-center gap-3' },
                  [
                    React.createElement(
                      'button',
                      {
                        key: 'cook',
                        onClick: handleStartCooking,
                        className: 'btn btn-primary btn-lg gap-2 flex-1'
                      },
                      [
                        React.createElement(ChefHat, { key: 'icon', size: 20 }),
                        'Start Cooking'
                      ]
                    )
                  ]
                )
              ),
              React.createElement(
                'div',
                {
                  key: 'secondary-actions',
                  className: 'pt-4 flex items-center justify-center gap-3'
                },
                [
                  React.createElement(
                    'button',
                    {
                      key: 'save',
                      onClick: handleSave,
                      disabled: loading,
                      className: `btn btn-sm gap-2 transition-all hover:scale-105 ${isSaved ? 'btn-primary' : 'btn-outline'}`,
                      style: isSaved ? {} : { backgroundColor: 'transparent' }
                    },
                    [
                      React.createElement(Heart, {
                        key: 'icon',
                        size: 16,
                        fill: isSaved ? 'currentColor' : 'none'
                      }),
                      loading ? '...' : (isSaved ? 'Saved' : 'Save')
                    ]
                  ),
                  React.createElement(
                    'button',
                    {
                      key: 'rate',
                      onClick: () => user ? setShowRatingDialog(true) : onAuthRequired(),
                      className: 'btn btn-outline btn-sm gap-2',
                      style: { backgroundColor: 'transparent' }
                    },
                    [
                      React.createElement(Star, {
                        key: 'icon',
                        size: 16,
                        fill: currentRating > 0 ? 'currentColor' : 'none',
                        color: currentRating > 0 ? 'var(--primary)' : 'currentColor'
                      }),
                      currentRating > 0 ? React.createElement(StarRatingDisplay, { 
                        key: 'stars', 
                        rating: currentRating, 
                        size: 12 
                      }) : 'Rate'
                    ]
                  ),
                  React.createElement(
                    'button',
                    {
                      key: 'share',
                      onClick: () => setShowShareModal(true),
                      className: 'btn btn-outline btn-sm gap-2',
                      style: { backgroundColor: 'transparent' }
                    },
                    [
                      React.createElement(Share2, { key: 'icon', size: 16 }),
                      'Share'
                    ]
                  )
                ]
              )
            ]
          )
        ]
      ),
      React.createElement(RatingDialog, {
        key: 'rating-dialog',
        open: showRatingDialog,
        onOpenChange: setShowRatingDialog,
        recipeTitle: recipe.title,
        currentRating: currentRating,
        onRate: handleRate
      }),
      React.createElement(ShareModal, {
        key: 'share-modal',
        open: showShareModal,
        onOpenChange: setShowShareModal,
        recipe: recipe
      })
    ]
  );
};

export default RecipeCard;