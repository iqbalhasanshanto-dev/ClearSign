import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export async function askGemini(prompt: string): Promise<string> {
  try {
    if (!apiKey) {
      return "⚠️ API Key missing! Please check VITE_GEMINI_API_KEY in .env.local";
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: 
          "You are ClearSign AI, a medical assistant.\n" +
          "1. Respond clearly with bullet points and line breaks.\n" +
          "2. If requested or asked in Bangla (বাংলা), respond in fluent Bangla.\n" +
          "3. Keep formatting clean and easy to read."
      }
    });
    return response.text || "No response received from Gemini.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `⚠️ Error: ${error?.message || "Failed to connect to Gemini API."}`;
  }
}
