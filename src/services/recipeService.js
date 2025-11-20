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

      // Handle cases where Gemini returns non-JSON responses
      if (text.toLowerCase().includes("i'm sorry") || 
          text.toLowerCase().includes("i can't") || 
          text.toLowerCase().includes("no food") ||
          text.toLowerCase().includes("car") ||
          text.toLowerCase().includes("vehicle")) {
        console.log("No food ingredients detected in image");
        return [];
      }

      const cleanedText = text.replace(/```json|```/g, '').trim();
      
      // Try to extract JSON from the response
      let ingredients;
      try {
        ingredients = JSON.parse(cleanedText);
      } catch (parseError) {
        console.log("Failed to parse JSON, trying to extract array from text");
        // Try to extract array from text response
        const arrayMatch = cleanedText.match(/\[.*\]/);
        if (arrayMatch) {
          ingredients = JSON.parse(arrayMatch[0]);
        } else {
          // If no array found, check if it's a list of ingredients
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
        // Filter out any non-food items
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
      
      // Provide more specific error messages
      if (error.message.includes('JSON') || error.message.includes('parse')) {
        throw new Error("The AI service returned an unexpected response. Please try a different image.");
      } else if (error.message.includes('car') || error.message.includes('vehicle')) {
        throw new Error("This image appears to contain a vehicle, not food ingredients. Please upload a photo of food.");
      } else {
        throw new Error("Failed to analyze image. Please try a clearer photo or add ingredients manually.");
      }
    }
  }

  async generateRecipe(ingredients) {
    try {
      const commonAddedIngredients = ['salt', 'pepper', 'oil', 'olive oil', 'vegetable oil', 'water', 'butter', 'flour', 'sugar', 'garlic', 'onion powder', 'garlic powder', 'spices', 'seasoning'];
      
      const prompt = `Create a simple, practical recipe using ONLY these ingredients: ${ingredients.join(', ')}.

STRICT RULES - DO NOT VIOLATE THESE:
1. USE ONLY THESE EXACT INGREDIENTS: ${ingredients.join(', ')}
2. DO NOT ADD any salt, pepper, oil, butter, water, flour, sugar, or any other ingredients
3. DO NOT ADD any spices, herbs, or seasonings
4. If cooking requires heat, assume basic cooking methods that don't require added fats
5. If ingredients need preparation (washing, peeling, chopping), include those steps
6. Recipe must work with ONLY the provided ingredients

ALLOWED TECHNIQUES (no additional ingredients):
- Boiling, steaming, baking, grilling, roasting
- Mixing, chopping, slicing, dicing
- Mashing, blending, whisking

Return ONLY valid JSON with this structure:
{
  "title": "Recipe name using only: ${ingredients.join(', ')}",
  "prepTime": number between 15-60,
  "difficulty": "Easy" or "Medium", 
  "servings": number between 2-4,
  "ingredients": [
    {
      "name": "ingredient name (MUST be from: ${ingredients.join(', ')})",
      "quantity": "amount",
      "unit": "unit or empty string"
    }
  ],
  "instructions": [
    {
      "step": 1,
      "description": "instruction using only provided ingredients",
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
      const recipeData = JSON.parse(cleanedText);
      
      // STRICT VALIDATION: Filter out any unauthorized ingredients
      const providedIngredients = ingredients.map(ing => ing.toLowerCase().trim());
      const recipeIngredients = recipeData.ingredients.map(ing => ing.name.toLowerCase().trim());
      
      console.log("Provided ingredients:", providedIngredients);
      console.log("Recipe ingredients:", recipeIngredients);
      
      // Filter out any ingredients that aren't in the provided list
      const validatedIngredients = recipeData.ingredients.filter(ingredient => {
        const ingName = ingredient.name.toLowerCase().trim();
        
        // Check if this ingredient matches any provided ingredient
        const isAllowed = providedIngredients.some(provided => 
          ingName.includes(provided) || provided.includes(ingName)
        );
        
        // Also check for common added ingredients
        const isCommonAdded = commonAddedIngredients.some(common => 
          ingName.includes(common)
        );
        
        if (!isAllowed || isCommonAdded) {
          console.log(`Removing unauthorized ingredient: ${ingredient.name}`);
          return false;
        }
        
        return true;
      });
      
      // Update the recipe with filtered ingredients
      recipeData.ingredients = validatedIngredients;
      
      // Also validate instructions to remove references to unauthorized ingredients
      recipeData.instructions = recipeData.instructions.map(instruction => {
        let description = instruction.description;
        
        // Remove references to common added ingredients from instructions
        commonAddedIngredients.forEach(ingredient => {
          const regex = new RegExp(`\\b${ingredient}\\b`, 'gi');
          description = description.replace(regex, '');
        });
        
        // Clean up any double spaces or punctuation issues
        description = description.replace(/\s+/g, ' ').trim();
        description = description.replace(/\.\./g, '.').replace(/\s\./g, '.');
        description = description.replace(/,\s*,/g, ',').replace(/\s,/g, ',');
        
        return {
          ...instruction,
          description: description
        };
      });
      
      return {
        id: `recipe-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...recipeData,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error("Error generating recipe:", error);
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

export async function generateRecipe(ingredients) {
  try {
    console.log("Generating recipe with ingredients:", ingredients);
    
    const recipe = await geminiClient.generateRecipe(ingredients);
    
    // Final validation check
    if (recipe.ingredients.length === 0) {
      throw new Error("No valid recipe could be created with only the provided ingredients. Please try adding more ingredients.");
    }
    
    // No image generation - return recipe without images
    const finalRecipe = {
      ...recipe,
      instructions: recipe.instructions.map(instruction => ({
        ...instruction,
        // No image property added
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
    
    const ingredients = await geminiClient.detectIngredientsFromImage(imageFile);
    
    console.log("Detected ingredients:", ingredients);
    
    // If no ingredients detected, throw a specific error
    if (ingredients.length === 0) {
      throw new Error("No food ingredients detected in this image. Please upload a photo of food items.");
    }
    
    return ingredients;
  } catch (error) {
    console.error("Error in detectIngredientsFromImage:", error);
    
    // Re-throw with user-friendly message
    if (error.message.includes('No food ingredients')) {
      throw error; // Keep the specific message
    } else if (error.message.includes('vehicle') || error.message.includes('car')) {
      throw new Error("This image contains a vehicle, not food ingredients. Please upload a photo of food.");
    } else {
      throw new Error("Failed to analyze image. Please try a clearer photo or add ingredients manually.");
    }
  }
}