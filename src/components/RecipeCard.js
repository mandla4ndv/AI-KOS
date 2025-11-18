import React, { useState } from 'react';
import { Clock, Users, ChefHat, Heart, Star, Share2, Check, Twitter, Facebook, Link2, MessageCircle } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { saveRecipe, deleteRecipe, isRecipeSaved, rateRecipe, getRecipeRating } from '../services/storageService';
import RatingDialog from './RatingDialog';
import '../styles/RecipeCard.css';

const RecipeCard = ({ recipe }) => {
  const [isSaved, setIsSaved] = useState(isRecipeSaved(recipe.id));
  const [currentRating, setCurrentRating] = useState(getRecipeRating(recipe.id));
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const difficultyColors = {
    Easy: 'badge-secondary',
    Medium: 'badge-primary',
    Hard: 'badge-destructive'
  };

  const handleSave = () => {
    if (isSaved) {
      deleteRecipe(recipe.id);
      setIsSaved(false);
      addToast({
        title: 'Recipe removed',
        description: 'Recipe has been removed from your collection',
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

  const handleRate = (rating, comment = '') => {
    rateRecipe(recipe.id, rating);
    setCurrentRating(rating);
    addToast({
      title: 'Rating saved!',
      description: comment ? `You rated this recipe ${rating} stars with a comment` : `You rated this recipe ${rating} stars`,
    });
  };

  const handleStartCooking = () => {
    sessionStorage.setItem('currentRecipe', JSON.stringify(recipe));
    window.location.hash = 'cook';
    addToast({
      title: 'Cooking mode started!',
      description: 'Enjoy cooking your recipe',
    });
  };

  const handleCopyLink = () => {
    const url = window.location.href.split('#')[0] + `#recipe-${recipe.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setShowShareMenu(false);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: 'Link copied!',
      description: 'Recipe link copied to clipboard',
    });
  };

  const handleShareTwitter = () => {
    const text = `Check out this delicious ${recipe.title} recipe!`;
    const url = window.location.href.split('#')[0] + `#recipe-${recipe.id}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
    setShowShareMenu(false);
  };

  const handleShareFacebook = () => {
    const text = `Check out this delicious ${recipe.title} recipe!`;
    const url = window.location.href.split('#')[0] + `#recipe-${recipe.id}`;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
    setShowShareMenu(false);
  };

  const handleShareWhatsApp = () => {
    const text = `Check out this delicious ${recipe.title} recipe!`;
    const url = window.location.href.split('#')[0] + `#recipe-${recipe.id}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(shareUrl, '_blank');
    setShowShareMenu(false);
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

  const ShareMenu = () => {
    return React.createElement(
      'div',
      { className: 'relative' },
      [
        React.createElement(
          'button',
          {
            key: 'trigger',
            onClick: () => setShowShareMenu(!showShareMenu),
            className: 'btn btn-outline btn-sm gap-2',
            style: { backgroundColor: 'transparent' }
          },
          [
            React.createElement(Share2, { key: 'icon', size: 16 }),
            'Share'
          ]
        ),
        showShareMenu && React.createElement(
          'div',
          {
            key: 'menu',
            className: 'absolute top-full right-0 mt-2 glass-card rounded-lg p-2 w-56 z-10 animate-scale-in'
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
                copied ? React.createElement(Check, { key: 'icon', size: 16, color: 'var(--primary)' }) : React.createElement(Link2, { key: 'icon', size: 16 }),
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
                key: 'facebook',
                onClick: handleShareFacebook,
                className: 'btn btn-ghost w-full justify-start gap-2'
              },
              [
                React.createElement(Facebook, { key: 'icon', size: 16 }),
                'Share on Facebook'
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
                React.createElement(MessageCircle, { key: 'icon', size: 16 }),
                'Share on WhatsApp'
              ]
            )
          ]
        )
      ]
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
                      onClick: () => setShowRatingDialog(true),
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
                  React.createElement(ShareMenu, { key: 'share' })
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
      })
    ]
  );
};

export default RecipeCard;