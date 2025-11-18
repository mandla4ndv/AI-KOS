import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { db } from '../config/firebase-config';

// Recipe operations
export const saveRecipeToDB = async (userId, recipe) => {
  try {
    const recipeRef = doc(db, 'users', userId, 'recipes', recipe.id);
    await setDoc(recipeRef, {
      ...recipe,
      savedAt: new Date(),
      updatedAt: new Date()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving recipe to DB:', error);
    throw error;
  }
};

export const deleteRecipeFromDB = async (userId, recipeId) => {
  try {
    const recipeRef = doc(db, 'users', userId, 'recipes', recipeId);
    await deleteDoc(recipeRef);
    return true;
  } catch (error) {
    console.error('Error deleting recipe from DB:', error);
    throw error;
  }
};

export const getUserRecipes = async (userId) => {
  try {
    const recipesRef = collection(db, 'users', userId, 'recipes');
    const querySnapshot = await getDocs(recipesRef);
    const recipes = [];
    querySnapshot.forEach((doc) => {
      recipes.push({ id: doc.id, ...doc.data() });
    });
    return recipes.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
  } catch (error) {
    console.error('Error getting user recipes:', error);
    throw error;
  }
};

export const updateRecipeRating = async (userId, recipeId, rating, comment = '') => {
  try {
    const recipeRef = doc(db, 'users', userId, 'recipes', recipeId);
    await updateDoc(recipeRef, {
      userRating: rating,
      userComment: comment,
      ratedAt: new Date(),
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating recipe rating:', error);
    throw error;
  }
};

// Check if recipe exists for user
export const isRecipeSavedForUser = async (userId, recipeId) => {
  try {
    const recipeRef = doc(db, 'users', userId, 'recipes', recipeId);
    const recipeDoc = await getDoc(recipeRef);
    return recipeDoc.exists();
  } catch (error) {
    console.error('Error checking if recipe saved:', error);
    return false;
  }
};

// User preferences
export const saveUserPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, { preferences }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving user preferences:', error);
    throw error;
  }
};

export const getUserPreferences = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data().preferences || {} : {};
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
};