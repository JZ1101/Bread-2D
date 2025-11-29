import { GoogleGenAI, Type } from "@google/genai";
import { GameStats, ChefFeedback } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getToppingSuggestions = async (preference: string): Promise<string[]> => {
  try {
    const prompt = `
      The user is playing a toast cooking game. They have buttered their toast.
      They want a topping based on this preference: "${preference}".
      
      Generate exactly 3 short, creative, distinct topping names.
      Examples: "Strawberry Jam", "Aged Cheddar", "Avocado Mash", "Cinnamon Sugar".
      Keep them under 4 words.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["suggestions"]
        }
      }
    });
    
    const json = JSON.parse(response.text || '{"suggestions": []}');
    return json.suggestions || ["Strawberry Jam", "Honey", "Cheddar Cheese"];
  } catch (e) {
    console.error(e);
    return ["Strawberry Jam", "Honey", "Cheddar Cheese"];
  }
};

export const getChefCritique = async (stats: GameStats): Promise<ChefFeedback> => {
  try {
    const toastStatus = stats.toastLevel < 30 ? "RAW" : stats.toastLevel > 70 ? "BURNT" : "PERFECT";
    const topping = stats.topping || "Nothing";

    const prompt = `
      You are a harsh but fair refined food critic (like Gordon Ramsay). 
      A player has just prepared a piece of toast in a cooking mini-game.
      
      Here are their stats:
      - Slicing Precision: ${stats.sliceQuality}%
      - Toast Level: ${stats.toastLevel}% (Status: ${toastStatus})
      - Butter Coverage: ${stats.butterCoverage}%
      - Topping Chosen: ${topping}
      
      Give me a JSON response with a score out of 10 and a short, punchy, 1-sentence critique. 
      Judge the combination of the toast status and the topping (e.g. don't put jam on burnt toast).
      Be funny if they failed, praise them if they did well.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            comment: { type: Type.STRING },
          },
          required: ["score", "comment"],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as ChefFeedback;
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      score: 5,
      comment: "My senses are dull today (AI connection failed), but that looks... interesting.",
    };
  }
};