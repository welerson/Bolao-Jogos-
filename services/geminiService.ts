import { GoogleGenAI, Type } from "@google/genai";

export const geminiService = {
  async generateLuckyNumbers(gameType: string, count: number) {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) {
        console.warn("API_KEY não encontrada. Usando fallback de números aleatórios.");
        return this.getFallbackNumbers(gameType, count);
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Gere ${count} números da sorte para um jogo de ${gameType} da loteria brasileira. Retorne no formato JSON com uma chave 'numbers' contendo um array de inteiros.`,
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

      const text = response.text;
      if (!text) throw new Error("Resposta vazia da IA");
      
      const data = JSON.parse(text);
      return data.numbers;
    } catch (e) {
      console.error("Erro ao gerar números com Gemini:", e);
      return this.getFallbackNumbers(gameType, count);
    }
  },

  getFallbackNumbers(gameType: string, count: number) {
    const fallbackNumbers = [];
    const max = gameType === 'mega-sena' ? 60 : 25;
    while(fallbackNumbers.length < count) {
      const n = Math.floor(Math.random() * max) + 1;
      if(!fallbackNumbers.includes(n)) fallbackNumbers.push(n);
    }
    return fallbackNumbers.sort((a, b) => a - b);
  },

  async explainGameRules(gameType: string) {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) return "Regras oficiais podem ser consultadas no site da Caixa.";

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Explique brevemente as regras básicas e como funciona o prêmio do jogo ${gameType} da Caixa Econômica Federal. Seja direto e use português brasileiro.`,
      });
      return response.text || "Informações indisponíveis.";
    } catch (e) {
      return "Informações sobre as regras não disponíveis no momento.";
    }
  }
};