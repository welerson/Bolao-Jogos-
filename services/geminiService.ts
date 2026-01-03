
import { GoogleGenAI, Type } from "@google/genai";

// Função para obter a API Key de forma segura
const getApiKey = () => {
  return (typeof process !== 'undefined' && process.env && process.env.API_KEY) || "";
};

const getAIClient = () => {
  const apiKey = getApiKey();
  return new GoogleGenAI({ apiKey });
};

export const geminiService = {
  async generateLuckyNumbers(gameType: string, count: number) {
    try {
      const ai = getAIClient();
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

      return JSON.parse(response.text).numbers;
    } catch (e) {
      console.error("Erro ao gerar números com Gemini:", e);
      // Fallback manual caso a IA falhe ou a chave esteja ausente
      const fallbackNumbers = [];
      const max = gameType === 'mega-sena' ? 60 : 25;
      while(fallbackNumbers.length < count) {
        const n = Math.floor(Math.random() * max) + 1;
        if(!fallbackNumbers.includes(n)) fallbackNumbers.push(n);
      }
      return fallbackNumbers.sort((a, b) => a - b);
    }
  },

  async explainGameRules(gameType: string) {
    try {
      const ai = getAIClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explique brevemente as regras básicas e como funciona o prêmio do jogo ${gameType} da Caixa Econômica Federal. Seja direto e use português brasileiro.`,
      });
      return response.text;
    } catch (e) {
      return "Informações sobre as regras não disponíveis no momento.";
    }
  }
};
