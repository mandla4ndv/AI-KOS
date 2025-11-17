import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingDialog = ({ open, onOpenChange, recipeTitle, onRate }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating);
      onOpenChange(false);
      setRating(0);
      setHoverRating(0);
    }
  };

  if (!open) return null;

  return React.createElement(
    'div',
    {
      className: 'fixed inset-0 z-50 flex items-center justify-center',
      style: { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
    },
    React.createElement(
      'div',
      {
        className: 'glass-card rounded-xl p-6 mx-4 max-w-md w-full animate-scale-in'
      },
      [
        React.createElement(
          'div',
          { key: 'header', className: 'mb-6' },
          [
            React.createElement(
              'h2',
              { key: 'title', className: 'text-xl font-bold' },
              'Rate this recipe'
            ),
            React.createElement(
              'p',
              { 
                key: 'desc', 
                className: 'mt-2',
                style: { color: 'var(--muted-foreground)' }
              },
              `How did ${recipeTitle} turn out?`
            )
          ]
        ),
        React.createElement(
          'div',
          {
            key: 'stars',
            className: 'flex items-center justify-center gap-2 py-6'
          },
          [1, 2, 3, 4, 5].map((star) =>
            React.createElement(
              'button',
              {
                key: star,
                onClick: () => setRating(star),
                onMouseEnter: () => setHoverRating(star),
                onMouseLeave: () => setHoverRating(0),
                className: 'transition-transform hover:scale-110',
                style: { background: 'none', border: 'none', cursor: 'pointer' }
              },
              React.createElement(Star, {
                size: 40,
                fill: star <= (hoverRating || rating) ? 'var(--primary)' : 'none',
                color: star <= (hoverRating || rating) ? 'var(--primary)' : 'var(--muted-foreground)'
              })
            )
          )
        ),
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
                key: 'skip',
                onClick: () => onOpenChange(false),
                className: 'btn btn-outline flex-1'
              },
              'Skip'
            ),
            React.createElement(
              'button',
              {
                key: 'save',
                onClick: handleSubmit,
                disabled: rating === 0,
                className: 'btn btn-primary flex-1'
              },
              'Save Rating'
            )
          ]
        )
      ]
    )
  );
};

export default RatingDialog;