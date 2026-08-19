import { GoogleGenAI } from '@google/genai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null

const systemInstruction = `You are ClearSign AI, a helpful medical assistant.
- Automatically detect the user's language.
- If the user writes in Bangla (বাংলা) or requests information in Bangla, respond in fluent, easy-to-understand Bangla.
- Always structure your responses cleanly with Markdown headers, bullet points, and proper line breaks.`

/** Sends a prompt to Gemini and returns its generated text. */
export async function askGemini(prompt: string): Promise<string> {
  if (!ai) {
    throw new Error('Gemini is not configured. Add VITE_GEMINI_API_KEY to your environment and restart the app.')
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: prompt,
    config: {
      systemInstruction,
    },
  })

  const text = response.text?.trim()
  if (!text) {
    throw new Error('Gemini returned an empty response. Please try again.')
  }

  return text
}
