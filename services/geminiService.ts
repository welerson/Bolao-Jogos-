
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const geminiService = {
  async generateLuckyNumbers(gameType: string, count: number) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Gere ${count} números da sorte para um jogo de ${gameType} da loteria brasileira. Retorne apenas os números separados por vírgula.`,
      config: {
        temperature: 1,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            numbers: {
              type: Type.ARRAY,
              items: { type: Type.INTEGER }
            }
          },
          required: ["numbers"]
        }
      }
    });

    try {
      return JSON.parse(response.text).numbers;
    } catch (e) {
      console.error("Error parsing Gemini response", e);
      return [];
    }
  },

  async explainGameRules(gameType: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique brevemente as regras básicas e como funciona o prêmio do jogo ${gameType} da Caixa Econômica Federal. Seja direto e use português brasileiro.`,
    });
    return response.text;
  }
};
