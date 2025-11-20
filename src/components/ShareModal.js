// components/ShareModal.js
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
      color: copied ? '#22c55e' : 'var(--primary)',
      platform: 'copy'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: handleShareTwitter,
      color: '#1DA1F2',
      platform: 'twitter'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: handleShareFacebook,
      color: '#1877F2',
      platform: 'facebook'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: handleShareWhatsApp,
      color: '#25D366',
      platform: 'whatsapp'
    },
    {
      name: 'Email',
      icon: Mail,
      action: handleShareEmail,
      color: 'var(--muted-foreground)',
      platform: 'email'
    }
  ];

  return (
    <div className="share-modal-overlay">
      <div className="share-modal-content">
        <div className="share-modal-header">
          <h2 className="share-modal-title">Share Recipe</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="share-modal-close"
          >
            <X size={20} />
          </button>
        </div>
        
        <p className="share-modal-description">
          Share "{recipe.title}" with others
        </p>

        <div className="share-options-grid">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className="share-option-button"
              data-platform={option.platform}
            >
              <option.icon 
                size={24} 
                color={option.color}
                className="share-option-icon"
              />
              <span className="share-option-name">{option.name}</span>
            </button>
          ))}
        </div>

        <div className="share-link-section">
          <p className="share-link-label">Recipe Link</p>
          <div className="share-link-container">
            <input
              type="text"
              value={generateRecipeUrl()}
              readOnly
              className="share-link-input"
            />
            <button
              onClick={handleCopyLink}
              className={`share-link-copy-button ${copied ? 'copied' : ''}`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;