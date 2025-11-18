import React, { useState } from 'react';
import { X, Copy, Check, Twitter, Facebook, MessageCircle, Mail } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import '../styles/ShareModal.css';

const ShareModal = ({ open, onOpenChange, recipe }) => {
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  if (!open) return null;

  const generateRecipeUrl = () => {
    const baseUrl = window.location.href.split('#')[0];
    return `${baseUrl}#recipe-${recipe.id}`;
  };

  const handleCopyLink = () => {
    const url = generateRecipeUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast({
      title: 'Link copied!',
      description: 'Recipe link copied to clipboard',
    });
  };

  const handleShareTwitter = () => {
    const text = `Check out this delicious ${recipe.title} recipe!`;
    const url = generateRecipeUrl();
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
  };

  const handleShareFacebook = () => {
    const url = generateRecipeUrl();
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=550,height=420');
  };

  const handleShareWhatsApp = () => {
    const text = `Check out this delicious ${recipe.title} recipe! ${generateRecipeUrl()}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank');
  };

  const handleShareEmail = () => {
    const subject = `Check out this recipe: ${recipe.title}`;
    const body = `I found this amazing recipe and thought you might like it!\n\n${recipe.title}\n${generateRecipeUrl()}\n\nIngredients:\n${recipe.ingredients.map(ing => `- ${ing.quantity}${ing.unit ? ` ${ing.unit}` : ''} ${ing.name}`).join('\n')}`;
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      action: handleCopyLink,
      color: copied ? 'var(--success)' : 'var(--primary)'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: handleShareTwitter,
      color: '#1DA1F2'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: handleShareFacebook,
      color: '#1877F2'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: handleShareWhatsApp,
      color: '#25D366'
    },
    {
      name: 'Email',
      icon: Mail,
      action: handleShareEmail,
      color: 'var(--muted-foreground)'
    }
  ];

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
              'Share Recipe'
            ),
            React.createElement(
              'button',
              {
                key: 'close',
                onClick: () => onOpenChange(false),
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
            className: 'mb-6 text-center',
            style: { color: 'var(--muted-foreground)' }
          },
          `Share "${recipe.title}" with others`
        ),
        React.createElement(
          'div',
          {
            key: 'share-options',
            className: 'grid grid-cols-2 gap-3'
          },
          shareOptions.map((option) =>
            React.createElement(
              'button',
              {
                key: option.name,
                onClick: option.action,
                className: 'btn btn-outline flex-col gap-2 py-4 h-auto',
                style: { backgroundColor: 'transparent' }
              },
              [
                React.createElement(option.icon, {
                  key: 'icon',
                  size: 24,
                  color: option.color
                }),
                React.createElement(
                  'span',
                  { 
                    key: 'text',
                    className: 'text-sm font-medium'
                  },
                  option.name
                )
              ]
            )
          )
        ),
        React.createElement(
          'div',
          {
            key: 'link-section',
            className: 'mt-6 p-3 rounded-lg',
            style: { backgroundColor: 'var(--muted)' }
          },
          [
            React.createElement(
              'p',
              {
                key: 'label',
                className: 'text-xs font-medium mb-2',
                style: { color: 'var(--muted-foreground)' }
              },
              'Recipe Link'
            ),
            React.createElement(
              'div',
              {
                key: 'link-container',
                className: 'flex items-center gap-2'
              },
              [
                React.createElement(
                  'input',
                  {
                    key: 'input',
                    type: 'text',
                    value: generateRecipeUrl(),
                    readOnly: true,
                    className: 'input flex-1 text-xs',
                    style: { backgroundColor: 'transparent', border: 'none' }
                  }
                ),
                React.createElement(
                  'button',
                  {
                    key: 'copy',
                    onClick: handleCopyLink,
                    className: 'btn btn-ghost btn-sm'
                  },
                  React.createElement(copied ? Check : Copy, { 
                    size: 16,
                    color: copied ? 'var(--success)' : 'var(--primary)'
                  })
                )
              ]
            )
          ]
        )
      ]
    )
  );
};

export default ShareModal;