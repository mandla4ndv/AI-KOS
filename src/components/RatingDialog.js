import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import '../styles/RatingDialog.css';

const RatingDialog = ({ open, onOpenChange, recipeTitle, currentRating, onRate }) => {
  const [rating, setRating] = useState(currentRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating, comment.trim());
      onOpenChange(false);
      setRating(0);
      setHoverRating(0);
      setComment('');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setRating(currentRating || 0);
    setComment('');
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
          { key: 'header', className: 'flex items-center justify-between mb-6' },
          [
            React.createElement(
              'h2',
              { key: 'title', className: 'text-xl font-bold' },
              'Rate this recipe'
            ),
            React.createElement(
              'button',
              {
                key: 'close',
                onClick: handleCancel,
                className: 'btn btn-ghost btn-sm',
                style: { background: 'none', border: 'none' }
              },
              React.createElement(X, { size: 20 })
            )
          ]
        ),
        React.createElement(
          'p',
          { 
            key: 'desc', 
            className: 'mb-6',
            style: { color: 'var(--muted-foreground)' }
          },
          `How did you like "${recipeTitle}"?`
        ),
        React.createElement(
          'div',
          {
            key: 'stars',
            className: 'flex items-center justify-center gap-2 py-4'
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
            key: 'comment',
            className: 'mt-6'
          },
          [
            React.createElement(
              'label',
              {
                key: 'label',
                htmlFor: 'comment',
                className: 'text-sm font-medium mb-2 block'
              },
              'Add a comment (optional)'
            ),
            React.createElement('textarea', {
              key: 'textarea',
              id: 'comment',
              placeholder: 'Share your thoughts about this recipe...',
              value: comment,
              onChange: (e) => setComment(e.target.value),
              className: 'input min-h-24 resize-vertical',
              rows: 3
            })
          ]
        ),
        React.createElement(
          'div',
          {
            key: 'actions',
            className: 'flex gap-3 mt-6'
          },
          [
            React.createElement(
              'button',
              {
                key: 'cancel',
                onClick: handleCancel,
                className: 'btn btn-outline flex-1'
              },
              'Cancel'
            ),
            React.createElement(
              'button',
              {
                key: 'submit',
                onClick: handleSubmit,
                disabled: rating === 0,
                className: 'btn btn-primary flex-1'
              },
              'Submit Rating'
            )
          ]
        )
      ]
    )
  );
};

export default RatingDialog;