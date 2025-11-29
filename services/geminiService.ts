import { GoogleGenAI, Type } from "@google/genai";
import { GameStats, ChefFeedback } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getChefCritique = async (stats: GameStats): Promise<ChefFeedback> => {
  try {
    const toastStatus = stats.toastLevel < 30 ? "RAW" : stats.toastLevel > 70 ? "BURNT" : "PERFECT";
    
    const prompt = `
      You are a harsh but fair refined food critic (like Gordon Ramsay). 
      A player has just prepared a piece of toast in a cooking mini-game.
      
      Here are their stats:
      - Slicing Precision: ${stats.sliceQuality}%
      - Toast Level: ${stats.toastLevel}% (Status: ${toastStatus})
      - Butter Coverage: ${stats.butterCoverage}%
      
      Give me a JSON response with a score out of 10 and a short, punchy, 1-sentence critique. 
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
      comment: "My senses are dull today, but that looks edible. (AI connection failed)",
    };
  }
};