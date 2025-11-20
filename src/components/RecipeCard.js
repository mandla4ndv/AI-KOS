// components/RecipeCard.js
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
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            fill={star <= rating ? 'var(--primary)' : 'none'}
            color={star <= rating ? 'var(--primary)' : 'var(--muted-foreground)'}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="recipe-card rounded-xl overflow-hidden animate-slide-up">
        <div className="recipe-card-content">
          {/* Header without difficulty badge */}
          <div className="recipe-card-header">
            <h2 className="recipe-card-title">{recipe.title}</h2>
            {/* Difficulty badge completely removed */}
          </div>

          <div className="recipe-meta-info">
            <div className="recipe-meta-item">
              <Clock size={16} />
              {recipe.prepTime} mins
            </div>
            <div className="recipe-meta-item">
              <Users size={16} />
              {recipe.servings} servings
            </div>
            <div className="recipe-meta-item">
              <ChefHat size={16} />
              {recipe.instructions.length} steps
            </div>
          </div>

          <div className="recipe-ingredients-section">
            <h3 className="recipe-ingredients-title">Ingredients</h3>
            <div className="recipe-ingredients-grid">
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="recipe-ingredient-item stagger-item">
                  <div className="recipe-ingredient-dot" />
                  <span className="recipe-ingredient-text">
                    {ingredient.quantity}{ingredient.unit ? ` ${ingredient.unit}` : ''} {ingredient.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="recipe-instructions-section">
            <h3 className="recipe-instructions-title">Instructions</h3>
            <div className="recipe-instructions-list">
              {recipe.instructions.map((instruction) => (
                <div key={instruction.step} className="recipe-instruction-item stagger-item">
                  <div className="recipe-instruction-number">
                    {instruction.step}
                  </div>
                  <div className="recipe-instruction-content">
                    <p className="recipe-instruction-description">
                      {instruction.description}
                    </p>
                    {instruction.duration && (
                      <div className="recipe-instruction-duration">
                        <Clock size={12} />
                        Timer: {instruction.duration} minutes
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="recipe-primary-actions">
            <div className="recipe-primary-actions-container">
              <button
                onClick={handleStartCooking}
                className="recipe-cook-button"
              >
                <ChefHat size={20} />
                Start Cooking
              </button>
            </div>
          </div>

          <div className="recipe-secondary-actions">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`recipe-action-button ${isSaved ? 'recipe-save-button saved' : ''}`}
            >
              <Heart
                size={16}
                fill={isSaved ? 'currentColor' : 'none'}
              />
              {loading ? '...' : (isSaved ? 'Saved' : 'Save')}
            </button>
            <button
              onClick={() => user ? setShowRatingDialog(true) : onAuthRequired()}
              className="recipe-action-button"
            >
              <Star
                size={16}
                fill={currentRating > 0 ? 'currentColor' : 'none'}
                color={currentRating > 0 ? 'var(--primary)' : 'currentColor'}
              />
              {currentRating > 0 ? (
                <StarRatingDisplay rating={currentRating} size={12} />
              ) : (
                'Rate'
              )}
            </button>
            <button
              onClick={() => setShowShareModal(true)}
              className="recipe-action-button"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      <RatingDialog
        open={showRatingDialog}
        onOpenChange={setShowRatingDialog}
        recipeTitle={recipe.title}
        currentRating={currentRating}
        onRate={handleRate}
      />

      <ShareModal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        recipe={recipe}
      />
    </>
  );
};

export default RecipeCard;