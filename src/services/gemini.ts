import { GoogleGenAI } from '@google/genai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

/** Sends a prompt to Gemini and returns its generated text. */
export async function askGemini(prompt: string): Promise<string> {
  if (!ai) {
    throw new Error('Gemini is not configured. Add VITE_GEMINI_API_KEY to your environment and restart the app.')
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
  })

  const text = response.text?.trim()
  if (!text) {
    throw new Error('Gemini returned an empty response. Please try again.')
  }

  return text
}
