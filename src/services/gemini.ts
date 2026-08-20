import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const reportSystemInstruction =
  "You are ClearSign AI, a compassionate medical report decoder. Simplify medical jargon into plain language. 1. LANGUAGE RULE: ALWAYS match the exact language of the user's latest prompt. If the user asks in English, reply strictly in English. If the user asks in Bangla (বাংলা), reply in Bangla. 2. FORMATTING RULE: Do NOT output raw markdown asterisks (e.g., '**', '*') or hashes ('###'). Write plain, readable text with clean line breaks and bullet points (•) so no unparsed syntax characters appear on screen.";

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
              'Start with the exact plain-text heading CRITICAL HITS / HEALTH ALERTS. Under it, list key health flags, abnormal values, and primary diagnoses as bullet points using •. If none are present, write • No urgent health alerts identified. Then add a blank line and the plain-text heading REPORT BREAKDOWN followed by a clear explanation. Do not diagnose.',
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

export async function askGemini(prompt: string, reportContext?: string): Promise<string> {
  try {
    if (!apiKey) {
      return "⚠️ API Key missing! Please check VITE_GEMINI_API_KEY in .env.local";
    }
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: reportContext
        ? "Context from user's uploaded prescription/report:\n" + reportContext + "\n\nRespond to the user's specific query below in the query's language using the document context, without switching languages unless requested.\n\nUser question: " + prompt
        : prompt,
      config: {
        systemInstruction: 
          "You are ClearSign AI, a medical assistant.\n" +
          "1. LANGUAGE RULE: ALWAYS match the exact language of the user's latest prompt. If the user asks in English, reply strictly in English. If the user asks in Bangla (বাংলা), reply in Bangla.\n" +
          "2. FORMATTING RULE: Do NOT output raw markdown asterisks (e.g., '**', '*') or hashes ('###'). Write plain, readable text with clean line breaks and bullet points (•) so no unparsed syntax characters appear on screen."
      }
    });
    return response.text || "No response received from Gemini.";
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `⚠️ Error: ${error?.message || "Failed to connect to Gemini API."}`;
  }
}
