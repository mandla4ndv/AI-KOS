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
      const prompt = `Create a simple, practical recipe using these ingredients: ${ingredients.join(', ')}.
      
      Make it easy to follow with clear instructions. Use normal ingredients that people have at home.
      Keep the recipe name simple and descriptive.
      
      Return ONLY valid JSON with this structure:
      {
        "title": "Simple recipe name",
        "prepTime": number between 15-60,
        "difficulty": "Easy" or "Medium",
        "servings": number between 2-4,
        "ingredients": [
          {
            "name": "ingredient name",
            "quantity": "amount",
            "unit": "unit or empty string"
          }
        ],
        "instructions": [
          {
            "step": 1,
            "description": "simple instruction",
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