import React, { useState } from 'react';
import { Sparkles, ChefHat } from 'lucide-react';
import IngredientInput from '../components/IngredientInput';
import RecipeCard from '../components/RecipeCard';
import RecipeSkeleton from '../components/RecipeSkeleton';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { generateRecipe } from '../services/recipeService';
import '../styles/HomePage.css';

const HomePage = ({ onAuthRequired, onStartCooking }) => {
  const [ingredients, setIngredients] = useState([]);
  const [recipe, setRecipe] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  const difficultyOptions = [
    { id: 'easy', label: 'Easy', description: 'Quick & Simple' },
    { id: 'medium', label: 'Medium', description: 'Balanced & Flavorful' },
    { id: 'difficult', label: 'Difficult', description: 'Gourmet & Complex' }
  ];

  const getDifficultyDescription = (difficulty) => {
    const descriptions = {
      easy: "Quick & Simple Recipe",
      medium: "Balanced & Flavorful Recipe", 
      difficult: "Gourmet & Complex Recipe"
    };
    return descriptions[difficulty] || "AI Generated Recipe";
  };

  const handleGenerateRecipe = async () => {
    if (!user) {
      onAuthRequired();
      return;
    }

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
      // Use selected difficulty or random if none selected
      const difficulty = selectedDifficulty || getRandomDifficulty();
      console.log("Generating recipe with difficulty:", difficulty);
      
      // Pass userId to generateRecipe to check for duplicates
      const generatedRecipe = await generateRecipe(ingredients, difficulty, user.uid);
      setRecipe(generatedRecipe);

      addToast({
        title: 'Recipe generated!',
        description: `Your ${getDifficultyDescription(difficulty).toLowerCase()} is ready`,
      });
    } catch (error) {
      console.error("Recipe generation error:", error);
      
      if (error.message.includes('matches an existing saved recipe')) {
        addToast({
          title: 'Recipe already saved',
          description: 'This recipe is already in your collection. Generating a different one...',
          variant: 'warning',
        });
        // Auto-retry once with same ingredients
        setTimeout(() => handleGenerateRecipe(), 1000);
      } else {
        addToast({
          title: 'Generation failed',
          description: error.message || 'Could not generate recipe. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const getRandomDifficulty = () => {
    const difficulties = ['easy', 'medium', 'difficult'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
  };

  const handleStartCooking = () => {
    if (recipe) {
      onStartCooking(recipe);
    }
  };

  return (
    <div className="home-page">
      <main className="home-main">
        <div className="home-container">
          {/* Hero Section */}
          <div className="home-hero">
            <h1 className="home-hero-title">
              Turn Ingredients into <span className="text-primary">Delicious Recipes</span>
            </h1>
            <p className="home-hero-subtitle">
              Add your available ingredients and let AI create a perfect recipe for you
            </p>
          </div>

          {/* Main Content */}
          <div className="home-content">
            {/* Left Column - Input */}
            <div className="home-input-section">
              <div className="home-input-card">
                <h2 className="home-input-title">Your Ingredients</h2>
                
                <IngredientInput
                  ingredients={ingredients}
                  onIngredientsChange={setIngredients}
                  onAuthRequired={onAuthRequired}
                />

                {/* Difficulty Filters */}
                <div className="difficulty-filters">
                  <h3 className="difficulty-filters-title">Choose Difficulty</h3>
                  <p className="difficulty-filters-subtitle">
                    {selectedDifficulty 
                      ? `Selected: ${difficultyOptions.find(d => d.id === selectedDifficulty)?.description}`
                      : 'Select a difficulty or leave blank for random'
                    }
                  </p>
                  <div className="difficulty-buttons">
                    {difficultyOptions.map((difficulty) => (
                      <button
                        key={difficulty.id}
                        className={`difficulty-button ${selectedDifficulty === difficulty.id ? 'active' : ''}`}
                        onClick={() => setSelectedDifficulty(
                          selectedDifficulty === difficulty.id ? null : difficulty.id
                        )}
                      >
                        <span className="difficulty-label">{difficulty.label}</span>
                        <span className="difficulty-description">{difficulty.description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Placeholder */}
                {!recipe && !isGenerating && (
                  <div className="home-placeholder">
                    <Sparkles className="home-placeholder-icon" size={48} />
                    <h3 className="home-placeholder-title">Ready to Cook?</h3>
                    <p className="home-placeholder-description">
                      {selectedDifficulty 
                        ? `Generate a ${getDifficultyDescription(selectedDifficulty).toLowerCase()}`
                        : 'Add ingredients and generate a recipe - surprise difficulty each time!'
                      }
                    </p>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  className={`home-generate-button ${isGenerating ? 'loading' : ''}`}
                  onClick={handleGenerateRecipe}
                  disabled={ingredients.length < 1 || isGenerating}
                >
                  <Sparkles size={20} />
                  {isGenerating 
                    ? 'Generating...' 
                    : selectedDifficulty 
                      ? `Generate ${difficultyOptions.find(d => d.id === selectedDifficulty)?.label} Recipe`
                      : 'Generate Recipe'
                  }
                </button>
              </div>
            </div>

            {/* Right Column - Recipe */}
            <div className="home-recipe-section">
              {isGenerating ? (
                <RecipeSkeleton />
              ) : recipe ? (
                <div className="home-recipe-content">
                  {/* Difficulty Banner */}
                  <div className="difficulty-banner">
                    <span className="difficulty-text">
                      {getDifficultyDescription(recipe.difficulty?.toLowerCase())}
                    </span>
                  </div>
                  
                  {/* Recipe Card */}
                  <RecipeCard
                    recipe={recipe}
                    userId={user?.uid}
                    onAuthRequired={onAuthRequired}
                  />
                  
                  {/* Action Buttons */}
                  <div className="home-recipe-actions">
                    <button
                      className="home-cook-button"
                      onClick={handleStartCooking}
                    >
                      <ChefHat size={20} />
                      Start Cooking
                    </button>
                    <button
                      className="home-new-recipe-button"
                      onClick={() => {
                        setRecipe(null);
                        handleGenerateRecipe();
                      }}
                    >
                      <Sparkles size={20} />
                      New Recipe
                    </button>
                  </div>
                </div>
              ) : (
                <div className="home-empty-state">
                  <Sparkles size={64} className="home-empty-icon" />
                  <h3 className="home-empty-title">No Recipe Yet</h3>
                  <p className="home-empty-description">
                    Add ingredients and generate your first AI-powered recipe!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;