import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const reportSystemInstruction =
  "You are ClearSign AI, a compassionate medical report decoder. Simplify medical jargon into plain language. If the document or request is in Bangla (বাংলা), respond in fluent Bangla.";

export async function analyzeReportImage(
  base64Data: string,
  mimeType: string,
  customPrompt?: string,
): Promise<string> {
  if (!apiKey) {
    throw new Error('API Key missing! Please check VITE_GEMINI_API_KEY in .env.local.')
  }

  const generateAnalysis = async (model: string) => {
    const response = await ai.models.generateContent({
      model,
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType, data: base64Data } },
          {
            text: customPrompt ??
              'Explain this medical report in plain language. Use short headings and bullet points, highlight any values or findings to discuss with a clinician, and do not diagnose.',
          },
        ],
      }],
      config: { systemInstruction: reportSystemInstruction },
    })

    const text = response.text?.trim()
    if (!text) throw new Error('Gemini returned an empty analysis.')
    return text
  }

  try {
    return await generateAnalysis('gemini-3.6-flash')
  } catch (primaryError) {
    console.warn('Primary Gemini analysis model failed; trying fallback model.', primaryError)
    try {
      return await generateAnalysis('gemini-2.5-flash')
    } catch (fallbackError) {
      console.error('Gemini report analysis failed with both models.', fallbackError)
      const fallbackMessage = fallbackError instanceof Error ? fallbackError.message : 'Unknown API error.'
      throw new Error(`Unable to analyze this report. ${fallbackMessage}`)
    }
  }
}

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
