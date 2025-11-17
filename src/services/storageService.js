const STORAGE_KEY = 'recipeai_saved_recipes';
const RATINGS_KEY = 'recipeai_recipe_ratings';

export function getSavedRecipes() {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error loading saved recipes:', error);
    return [];
  }
}

export function saveRecipe(recipe, rating) {
  const recipes = getSavedRecipes();
  const savedRecipe = {
    ...recipe,
    savedAt: new Date(),
    userRating: rating || 0,
  };

  const filtered = recipes.filter((r) => r.id !== recipe.id);
  filtered.unshift(savedRecipe);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function deleteRecipe(recipeId) {
  const recipes = getSavedRecipes();
  const filtered = recipes.filter((r) => r.id !== recipeId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

export function updateRecipeRating(recipeId, rating) {
  const recipes = getSavedRecipes();
  const updated = recipes.map((r) => (r.id === recipeId ? { ...r, userRating: rating } : r));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function isRecipeSaved(recipeId) {
  if (typeof window === 'undefined') return false;

  const recipes = getSavedRecipes();
  return recipes.some((r) => r.id === recipeId);
}

export function rateRecipe(recipeId, rating) {
  if (typeof window === 'undefined') return;

  try {
    const ratings = getRatings();
    ratings[recipeId] = rating;
    localStorage.setItem(RATINGS_KEY, JSON.stringify(ratings));

    const savedRecipes = getSavedRecipes();
    if (savedRecipes.some((r) => r.id === recipeId)) {
      updateRecipeRating(recipeId, rating);
    }
  } catch (error) {
    console.error('Error saving rating:', error);
  }
}

export function getRecipeRating(recipeId) {
  if (typeof window === 'undefined') return 0;

  try {
    const ratings = getRatings();
    return ratings[recipeId] || 0;
  } catch (error) {
    console.error('Error loading rating:', error);
    return 0;
  }
}

function getRatings() {
  if (typeof window === 'undefined') return {};

  try {
    const saved = localStorage.getItem(RATINGS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error loading ratings:', error);
    return {};
  }
}