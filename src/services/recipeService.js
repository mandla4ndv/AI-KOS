import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ 
  apiKey: "AIzaSyD8h1rdTcyV9q-QZlqZAOz6POu2vKsEaoQ"
});

class GeminiClient {
  async detectIngredientsFromImage(imageFile) {
    try {
      const prompt = `Look at this food image and tell me what ingredients you can see. Return ONLY a JSON array of ingredient names in lowercase. Example: ["chicken", "tomatoes", "onions"]`;
      
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

      const cleanedText = text.replace(/```json|```/g, '').trim();
      const ingredients = JSON.parse(cleanedText);
      
      if (Array.isArray(ingredients) && ingredients.length > 0) {
        return ingredients;
      } else {
        throw new Error("Could not identify ingredients from the image");
      }
    } catch (error) {
      console.error("Error detecting ingredients:", error);
      throw new Error("Failed to analyze image. Please try a clearer photo or add ingredients manually.");
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
    return ingredients;
  } catch (error) {
    console.error("Error in detectIngredientsFromImage:", error);
    throw error;
  }
}