import React, { useState } from 'react';
import { Clock, Trash2, ChefHat, Star } from 'lucide-react';
import { deleteRecipe, updateRecipeRating } from '../services/storageService';
import { useToast } from '../contexts/ToastContext';

const SavedRecipeCard = ({ recipe, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { addToast } = useToast();

  const difficultyColors = {
    Easy: 'badge-secondary',
    Medium: 'badge-primary',
    Hard: 'badge-destructive'
  };

  const handleDelete = async () => {
    if (confirm(`Delete "${recipe.title}"?`)) {
      setIsDeleting(true);
      deleteRecipe(recipe.id);
      addToast({
        title: 'Recipe deleted',
        description: 'The recipe has been removed from your collection',
      });
      onDelete();
    }
  };

  const handleRatingChange = (newRating) => {
    updateRecipeRating(recipe.id, newRating);
    addToast({
      title: 'Rating updated',
      description: 'Your rating has been saved',
    });
  };

  const handleCookAgain = () => {
    sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
    window.location.href = '/#cook';
  };

  const StarRating = ({ rating, onRatingChange, size = 16 }) => {
    return React.createElement(
      'div',
      { className: 'flex gap-1' },
      [1, 2, 3, 4, 5].map((star) =>
        React.createElement(
          'button',
          {
            key: star,
            onClick: () => onRatingChange(star),
            className: 'transition-transform hover:scale-110',
            style: { background: 'none', border: 'none', cursor: 'pointer' }
          },
          React.createElement(Star, {
            size: size,
            fill: star <= rating ? 'var(--primary)' : 'none',
            color: star <= rating ? 'var(--primary)' : 'var(--muted-foreground)'
          })
        )
      )
    );
  };

  return React.createElement(
    'div',
    { className: 'card overflow-hidden hover:shadow-lg transition-shadow' },
    [
      React.createElement(
        'div',
        {
          key: 'image',
          className: 'aspect-video flex items-center justify-center',
          style: { 
            background: 'linear-gradient(135deg, var(--primary) 20%, var(--secondary) 100%)',
            opacity: 0.2
          }
        },
        React.createElement(ChefHat, { size: 64, style: { color: 'var(--primary)', opacity: 0.4 } })
      ),
      React.createElement(
        'div',
        { key: 'content', className: 'p-4' },
        [
          React.createElement(
            'div',
            {
              key: 'header',
              className: 'flex items-start justify-between gap-2 mb-2'
            },
            [
              React.createElement(
                'h3',
                {
                  key: 'title',
                  className: 'font-semibold text-lg leading-tight text-balance line-clamp-2 flex-1'
                },
                recipe.title
              ),
              React.createElement(
                'span',
                {
                  key: 'difficulty',
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
              className: 'flex items-center gap-4 text-sm mb-3',
              style: { color: 'var(--muted-foreground)' }
            },
            [
              React.createElement(
                'div',
                { key: 'time', className: 'flex items-center gap-1' },
                [
                  React.createElement(Clock, { key: 'icon', size: 16 }),
                  `${recipe.prepTime} min`
                ]
              ),
              React.createElement(
                'div',
                { key: 'servings', className: 'flex items-center gap-1' },
                `${recipe.servings} servings`
              )
            ]
          ),
          React.createElement(
            'div',
            { key: 'rating' },
            React.createElement(StarRating, {
              rating: recipe.userRating,
              onRatingChange: handleRatingChange,
              size: 16
            })
          )
        ]
      ),
      React.createElement(
        'div',
        { key: 'actions', className: 'p-4 pt-0 flex gap-2' },
        [
          React.createElement(
            'button',
            {
              key: 'cook',
              onClick: handleCookAgain,
              className: 'btn btn-primary btn-sm flex-1 gap-2'
            },
            [
              React.createElement(ChefHat, { key: 'icon', size: 16 }),
              'Cook Again'
            ]
          ),
          React.createElement(
            'button',
            {
              key: 'delete',
              onClick: handleDelete,
              disabled: isDeleting,
              className: 'btn btn-outline btn-sm',
              style: { backgroundColor: 'transparent' }
            },
            React.createElement(Trash2, { size: 16 })
          )
        ]
      )
    ]
  );
};

export default SavedRecipeCard;