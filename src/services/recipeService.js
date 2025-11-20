// services/recipeService.js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: "AIzaSyD8h1rdTcyV9q-QZlqZAOz6POu2vKsEaoQ"
});

class GeminiClient {
  async detectIngredientsFromImage(imageFile) {
    try {
      const prompt = `Look at this food image and tell me what ingredients you can see. Return ONLY a JSON array of ingredient names in lowercase. Example: ["chicken", "tomatoes", "onions"]
      
      IMPORTANT: If the image does not contain food ingredients (like cars, people, landscapes, etc.), return an empty array [].`;

      const base64Image = await this.fileToBase64(imageFile);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: imageFile.type,
                  data: base64Image
                }
              }
            ]
          }
        ]
      });

      const text = response.text.trim();
      console.log("Gemini Vision Response:", text);

      if (text.toLowerCase().includes("i'm sorry") || 
          text.toLowerCase().includes("i can't") || 
          text.toLowerCase().includes("no food") ||
          text.toLowerCase().includes("car") ||
          text.toLowerCase().includes("vehicle")) {
        console.log("No food ingredients detected in image");
        return [];
      }

      const cleanedText = text.replace(/```json|```/g, '').trim();
      
      let ingredients;
      try {
        ingredients = JSON.parse(cleanedText);
      } catch (parseError) {
        console.log("Failed to parse JSON, trying to extract array from text");
        const arrayMatch = cleanedText.match(/\[.*\]/);
        if (arrayMatch) {
          ingredients = JSON.parse(arrayMatch[0]);
        } else {
          const ingredientList = cleanedText.split('\n')
            .map(line => line.replace(/^-|\d+\.|\*/g, '').trim())
            .filter(line => line.length > 0 && !line.toLowerCase().includes('ingredient'));
          
          if (ingredientList.length > 0) {
            ingredients = ingredientList;
          } else {
            ingredients = [];
          }
        }
      }
      
      if (Array.isArray(ingredients) && ingredients.length > 0) {
        const foodIngredients = ingredients.filter(ing => 
          !ing.toLowerCase().includes('car') &&
          !ing.toLowerCase().includes('vehicle') &&
          !ing.toLowerCase().includes('person') &&
          !ing.toLowerCase().includes('background')
        );
        return foodIngredients;
      } else {
        console.log("No valid ingredients array found in response");
        return [];
      }
    } catch (error) {
      console.error("Error detecting ingredients:", error);
      if (error.message.includes('JSON') || error.message.includes('parse')) {
        throw new Error("The AI service returned an unexpected response. Please try a different image.");
      } else if (error.message.includes('car') || error.message.includes('vehicle')) {
        throw new Error("This image appears to contain a vehicle, not food ingredients. Please upload a photo of food.");
      } else {
        throw new Error("Failed to analyze image. Please try a clearer photo or add ingredients manually.");
      }
    }
  }

  async generateRecipe(ingredients, difficulty = 'easy') {
    try {
      const commonAddedIngredients = ['salt', 'pepper', 'oil', 'olive oil', 'vegetable oil', 'water', 'butter', 'flour', 'sugar', 'garlic', 'onion powder', 'garlic powder', 'spices', 'seasoning'];
      
      const difficultyPrompts = {
        easy: `Create a SIMPLE, BASIC household recipe using ONLY these ingredients: ${ingredients.join(', ')}.
        - Use simple cooking techniques anyone can do at home
        - Maximum 5-6 steps
        - Basic preparation methods only
        - Focus on comfort food and everyday meals
        - Prep time: 15-30 minutes
        - Difficulty level: Easy`,
        
        medium: `Create a DECENT, FLAVORFUL recipe using ONLY these ingredients: ${ingredients.join(', ')}.
        - Use intermediate cooking techniques
        - Can include 6-8 steps
        - More creative combinations
        - Similar to good home cooking or casual dining
        - Prep time: 30-45 minutes
        - Difficulty level: Medium`,
        
        difficult: `Create a SOPHISTICATED, RESTAURANT-QUALITY recipe using ONLY these ingredients: ${ingredients.join(', ')}.
        - Use advanced cooking techniques
        - Multiple preparation steps (8-12 steps)
        - Elegant presentation ideas
        - Complex flavor development
        - Similar to fine dining restaurant dishes
        - Prep time: 45-90 minutes
        - Difficulty level: Hard`
      };

      const prompt = `${difficultyPrompts[difficulty]}

STRICT RULES - DO NOT VIOLATE THESE:
1. USE ONLY THESE EXACT INGREDIENTS: ${ingredients.join(', ')}
2. DO NOT ADD any salt, pepper, oil, butter, water, flour, sugar, or any other ingredients
3. DO NOT ADD any spices, herbs, or seasonings
4. If cooking requires heat, assume basic cooking methods that don't require added fats
5. If ingredients need preparation (washing, peeling, chopping), include those steps
6. Recipe must work with ONLY the provided ingredients
7. USE METRIC SYSTEM UNITS ONLY: grams (g), milliliters (ml), centimeters (cm), kilograms (kg), liters (L)
8. DO NOT USE imperial units: no cups, ounces, pounds, inches, teaspoons, tablespoons, quarts, gallons

METRIC CONVERSION GUIDE:
- For solids: use grams (g) or kilograms (kg)
- For liquids: use milliliters (ml) or liters (L)
- For sizes: use centimeters (cm)
- For small amounts: use grams (g) or milliliters (ml)
- 1 cup ≈ 240 ml
- 1 ounce ≈ 28 g
- 1 pound ≈ 450 g
- 1 inch ≈ 2.5 cm
- 1 teaspoon ≈ 5 ml
- 1 tablespoon ≈ 15 ml

ALLOWED TECHNIQUES (no additional ingredients):
- Boiling, steaming, baking, grilling, roasting
- Mixing, chopping, slicing, dicing
- Mashing, blending, whisking

Return ONLY valid JSON with this structure:
{
  "title": "Recipe name using only: ${ingredients.join(', ')}",
  "prepTime": number between 15-90,
  "difficulty": "${difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard'}",
  "servings": number between 2-4,
  "ingredients": [
    {
      "name": "ingredient name (MUST be from: ${ingredients.join(', ')})",
      "quantity": "amount in metric units",
      "unit": "metric unit (g, ml, cm, kg, L) or empty string for whole items"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "instruction using only provided ingredients with metric measurements",
      "duration": number (optional)
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt
      });

      const text = response.text.trim();
      console.log("Gemini Recipe Response:", text);

      const cleanedText = text.replace(/```json|```/g, '').trim();
      
      let recipeData;
      try {
        recipeData = JSON.parse(cleanedText);
      } catch (parseError) {
        console.log("Failed to parse JSON, trying to extract JSON from text");
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          recipeData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("AI returned invalid JSON format");
        }
      }
      
      // Convert any imperial units to metric in the response
      recipeData.ingredients = recipeData.ingredients.map(ingredient => {
        let { quantity, unit, name } = ingredient;
        
        // Remove any imperial units and convert to metric
        if (unit) {
          unit = unit.toLowerCase();
          if (unit.includes('cup') || unit.includes('cups')) {
            quantity = quantity * 240;
            unit = 'ml';
          } else if (unit.includes('tablespoon') || unit.includes('tbsp')) {
            quantity = quantity * 15;
            unit = 'ml';
          } else if (unit.includes('teaspoon') || unit.includes('tsp')) {
            quantity = quantity * 5;
            unit = 'ml';
          } else if (unit.includes('ounce') || unit.includes('oz')) {
            quantity = quantity * 28;
            unit = 'g';
          } else if (unit.includes('pound') || unit.includes('lb')) {
            quantity = quantity * 450;
            unit = 'g';
          } else if (unit.includes('inch') || unit.includes('in')) {
            quantity = quantity * 2.5;
            unit = 'cm';
          } else if (unit.includes('quart') || unit.includes('qt')) {
            quantity = quantity * 950;
            unit = 'ml';
          } else if (unit.includes('gallon') || unit.includes('gal')) {
            quantity = quantity * 3800;
            unit = 'ml';
          }
          
          // Ensure proper metric unit formatting
          if (unit === 'milliliters') unit = 'ml';
          if (unit === 'liters') unit = 'L';
          if (unit === 'grams') unit = 'g';
          if (unit === 'kilograms') unit = 'kg';
          if (unit === 'centimeters') unit = 'cm';
        }
        
        return {
          name,
          quantity: Math.round(quantity * 100) / 100, // Round to 2 decimal places
          unit
        };
      });
      
      const providedIngredients = ingredients.map(ing => ing.toLowerCase().trim());
      const recipeIngredients = recipeData.ingredients.map(ing => ing.name.toLowerCase().trim());
      
      console.log("Provided ingredients:", providedIngredients);
      console.log("Recipe ingredients:", recipeIngredients);
      
      const validatedIngredients = recipeData.ingredients.filter(ingredient => {
        const ingName = ingredient.name.toLowerCase().trim();
        
        const isAllowed = providedIngredients.some(provided => 
          ingName.includes(provided) || provided.includes(ingName)
        );
        
        const isCommonAdded = commonAddedIngredients.some(common => 
          ingName.includes(common)
        );
        
        if (!isAllowed || isCommonAdded) {
          console.log(`Removing unauthorized ingredient: ${ingredient.name}`);
          return false;
        }
        
        return true;
      });
      
      recipeData.ingredients = validatedIngredients;
      
      // Convert imperial units in instructions to metric
      recipeData.instructions = recipeData.instructions.map(instruction => {
        let description = instruction.description;
        
        // Remove references to common added ingredients
        commonAddedIngredients.forEach(ingredient => {
          const regex = new RegExp(`\\b${ingredient}\\b`, 'gi');
          description = description.replace(regex, '');
        });
        
        // Convert imperial units in instructions
        description = description.replace(/(\d+)\s*cups?/gi, (match, num) => `${num * 240} ml`);
        description = description.replace(/(\d+)\s*tablespoons?/gi, (match, num) => `${num * 15} ml`);
        description = description.replace(/(\d+)\s*teaspoons?/gi, (match, num) => `${num * 5} ml`);
        description = description.replace(/(\d+)\s*ounces?/gi, (match, num) => `${num * 28} g`);
        description = description.replace(/(\d+)\s*pounds?/gi, (match, num) => `${num * 450} g`);
        description = description.replace(/(\d+)\s*inches?/gi, (match, num) => `${num * 2.5} cm`);
        
        // Clean up any double spaces or punctuation issues
        description = description.replace(/\s+/g, ' ').trim();
        description = description.replace(/\.\./g, '.').replace(/\s\./g, '.');
        description = description.replace(/,\s*,/g, ',').replace(/\s,/g, ',');
        
        return {
          ...instruction,
          description: description
        };
      });
      
      recipeData.difficulty = difficulty === 'easy' ? 'Easy' : difficulty === 'medium' ? 'Medium' : 'Hard';
      
      return {
        id: `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...recipeData,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Error generating recipe:", error);
      if (error.message.includes('JSON')) {
        throw new Error("The AI service returned an invalid response. Please try again.");
      }
      throw new Error("Failed to generate recipe. Please try again.");
    }
  }

  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

const geminiClient = new GeminiClient();

export async function generateRecipe(ingredients, difficulty = 'easy') {
  try {
    console.log("Generating recipe with ingredients:", ingredients, "Difficulty:", difficulty);
    
    if (!ingredients || ingredients.length === 0) {
      throw new Error("No ingredients provided");
    }
    
    const recipe = await geminiClient.generateRecipe(ingredients, difficulty);
    
    if (recipe.ingredients.length === 0) {
      throw new Error("No valid recipe could be created with only the provided ingredients. Please try adding more ingredients.");
    }
    
    if (!recipe.title || !recipe.ingredients || !recipe.instructions) {
      throw new Error("Generated recipe is missing required fields");
    }
    
    const finalRecipe = {
      ...recipe,
      instructions: recipe.instructions.map(instruction => ({
        ...instruction,
      })),
    };

    console.log("Generated recipe:", finalRecipe);
    return finalRecipe;
  } catch (error) {
    console.error("Error in generateRecipe:", error);
    throw error;
  }
}

export async function detectIngredientsFromImage(imageFile) {
  try {
    console.log("Detecting ingredients from image:", imageFile.name);
    
    if (!imageFile) {
      throw new Error("No image file provided");
    }
    
    if (!imageFile.type.startsWith('image/')) {
      throw new Error("Please upload an image file (JPEG, PNG, etc.)");
    }
    
    const ingredients = await geminiClient.detectIngredientsFromImage(imageFile);
    
    console.log("Detected ingredients:", ingredients);
    
    if (ingredients.length === 0) {
      throw new Error("No food ingredients detected in this image. Please upload a photo of food items.");
    }
    
    return ingredients;
  } catch (error) {
    console.error("Error in detectIngredientsFromImage:", error);
    
    if (error.message.includes('No food ingredients')) {
      throw error;
    } else if (error.message.includes('vehicle') || error.message.includes('car')) {
      throw new Error("This image contains a vehicle, not food ingredients. Please upload a photo of food.");
    } else if (error.message.includes('JSON') || error.message.includes('parse')) {
      throw new Error("The AI service returned an unexpected response. Please try a different image.");
    } else {
      throw new Error("Failed to analyze image. Please try a clearer photo or add ingredients manually.");
    }
  }
}