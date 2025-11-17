import React, { useState } from 'react';
import { Clock, Users, ChefHat, Heart, Star, Share2, Check, Twitter } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { saveRecipe, isRecipeSaved, rateRecipe, getRecipeRating } from '../services/storageService';

const RecipeCard = ({ recipe }) => {
  const [isSaved, setIsSaved] = useState(isRecipeSaved(recipe.id));
  const [currentRating, setCurrentRating] = useState(getRecipeRating(recipe.id));
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const difficultyColors = {
    Easy: 'badge-secondary',
    Medium: 'badge-primary',
    Hard: 'badge-destructive'
  };

  const handleSave = () => {
    if (isSaved) {
      addToast({
        title: 'Already saved',
        description: 'This recipe is in your collection',
      });
    } else {
      saveRecipe(recipe);
      setIsSaved(true);
      addToast({
        title: 'Recipe saved!',
        description: 'Added to your recipe collection',
      });
    }
  };

  const handleRate = (rating) => {
    rateRecipe(recipe.id, rating);
    setCurrentRating(rating);
    addToast({
      title: 'Rating saved!',
      description: `You rated this recipe ${rating} stars`,
    });
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: 'Link copied!',
      description: 'Recipe link copied to clipboard',
    });
  };

  const handleShareTwitter = () => {
    const text = `Check out this ${recipe.title} recipe!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank', 'width=550,height=420');
  };

  const handleShareWhatsApp = () => {
    const text = `Check out this ${recipe.title} recipe! ${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const StarRating = ({ onRate }) => {
    return React.createElement(
      'div',
      { className: 'flex gap-1' },
      [1, 2, 3, 4, 5].map((star) =>
        React.createElement(
          'button',
          {
            key: star,
            onClick: () => onRate(star),
            className: 'transition-transform hover:scale-110',
            style: { background: 'none', border: 'none', cursor: 'pointer' }
          },
          React.createElement(Star, {
            size: 24,
            fill: star <= currentRating ? 'var(--primary)' : 'none',
            color: star <= currentRating ? 'var(--primary)' : 'var(--muted-foreground)'
          })
        )
      )
    );
  };

  const ShareMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    return React.createElement(
      'div',
      { className: 'relative' },
      [
        React.createElement(
          'button',
          {
            key: 'trigger',
            onClick: () => setIsOpen(!isOpen),
            className: 'btn btn-outline btn-sm gap-2',
            style: { backgroundColor: 'transparent' }
          },
          [
            React.createElement(Share2, { key: 'icon', size: 16 }),
            'Share'
          ]
        ),
        isOpen && React.createElement(
          'div',
          {
            key: 'menu',
            className: 'absolute top-full right-0 mt-2 glass-card rounded-lg p-2 w-56 z-10'
          },
          [
            React.createElement(
              'button',
              {
                key: 'copy',
                onClick: handleCopyLink,
                className: 'btn btn-ghost w-full justify-start gap-2'
              },
              [
                copied ? React.createElement(Check, { key: 'icon', size: 16, color: 'var(--secondary)' }) : React.createElement(Share2, { key: 'icon', size: 16 }),
                copied ? 'Copied!' : 'Copy Link'
              ]
            ),
            React.createElement(
              'button',
              {
                key: 'twitter',
                onClick: handleShareTwitter,
                className: 'btn btn-ghost w-full justify-start gap-2'
              },
              [
                React.createElement(Twitter, { key: 'icon', size: 16 }),
                'Share on Twitter'
              ]
            ),
            React.createElement(
              'button',
              {
                key: 'whatsapp',
                onClick: handleShareWhatsApp,
                className: 'btn btn-ghost w-full justify-start gap-2'
              },
              [
                React.createElement(
                  'svg',
                  {
                    key: 'icon',
                    width: 16,
                    height: 16,
                    viewBox: '0 0 24 24',
                    fill: 'currentColor'
                  },
                  React.createElement('path', {
                    d: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'
                  })
                ),
                'Share on WhatsApp'
              ]
            )
          ]
        )
      ]
    );
  };

  return React.createElement(
    'div',
    { className: 'glass-card rounded-xl overflow-hidden animate-slide-up' },
    [
      recipe.image && React.createElement(
        'div',
        {
          key: 'image',
          className: 'relative aspect-video md:aspect-[21/9] gradient-overlay'
        },
        [
          React.createElement('img', {
            key: 'img',
            src: recipe.image || '/placeholder.svg',
            alt: recipe.title,
            className: 'w-full h-full object-cover'
          }),
          React.createElement(
            'div',
            {
              key: 'badge',
              className: 'absolute bottom-0 left-0 p-6'
            },
            React.createElement(
              'span',
              { className: difficultyColors[recipe.difficulty] },
              recipe.difficulty
            )
          )
        ]
      ),
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
              !recipe.image && React.createElement(
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
                        'p',
                        {
                          key: 'desc',
                          className: 'text-sm leading-relaxed pt-0.5 flex-1'
                        },
                        [
                          instruction.description,
                          instruction.duration && React.createElement(
                            'span',
                            {
                              key: 'duration',
                              style: { color: 'var(--muted-foreground)', marginLeft: '8px' }
                            },
                            `(${instruction.duration} min)`
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
                    key: 'save',
                    onClick: handleSave,
                    className: `btn btn-sm gap-2 transition-all hover:scale-105 ${isSaved ? 'btn-primary' : 'btn-outline'}`,
                    style: isSaved ? {} : { backgroundColor: 'transparent' }
                  },
                  [
                    React.createElement(Heart, {
                      key: 'icon',
                      size: 16,
                      fill: isSaved ? 'currentColor' : 'none'
                    }),
                    isSaved ? 'Saved' : 'Save'
                  ]
                ),
                React.createElement(
                  'button',
                  {
                    key: 'rate',
                    onClick: () => handleRate(currentRating || 1),
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
                    currentRating > 0 ? `${currentRating} Stars` : 'Rate'
                  ]
                ),
                React.createElement(ShareMenu, { key: 'share' })
              ]
            )
          )
        ]
      )
    ]
  );
};

export default RecipeCard;