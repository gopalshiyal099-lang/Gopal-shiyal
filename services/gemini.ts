
import { GoogleGenAI } from "@google/genai";
import { PROPERTIES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getRealEstateAdvice = async (userPrompt: string, chatHistory: any[]) => {
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    You are the AI Assistant for "Mahuva Property". 
    Your goal is to help users find properties in Mahuva and surrounding areas.
    Here is our current inventory of properties: ${JSON.stringify(PROPERTIES)}.
    
    When asked about properties:
    1. Suggest specific listings from the inventory.
    2. Provide highlights (price in INR, specific Mahuva location).
    3. Encourage them to use the "Call" or "WhatsApp" buttons on the page to speak with our local agents.
    
    Be professional, helpful, and culturally aware of the local Mahuva market.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [...chatHistory, { role: 'user', parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The assistant is currently resting. Please contact our local agents in Mahuva directly via WhatsApp.";
  }
};
