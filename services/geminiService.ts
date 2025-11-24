import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini
// Note: In a production app, error handling for missing API key is needed.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const categorizeTransaction = async (description: string, amount: number): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Classifique a seguinte transação bancária em uma destas categorias: 'Casa Nova', 'Lazer', 'Casamento', 'Transporte', 'Alimentação', 'Contas Fixas', 'Compras', 'Investimentos'. Retorne apenas a string da categoria.
      
      Transação: "${description}" - R$ ${amount}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING }
          }
        }
      }
    });

    const json = JSON.parse(response.text || '{}');
    return json.category || 'Outros';
  } catch (error) {
    console.error("Erro ao categorizar via Gemini:", error);
    return 'Outros';
  }
};

export const generateEmpatheticAlert = async (
  spenderName: string,
  category: string,
  amount: number,
  limit: number
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Crie uma mensagem curta, empática e não conflituosa (Modo Harmonia) para notificar o casal que ${spenderName} gastou R$${amount} na categoria ${category}, o que representa quase ${Math.round((amount/limit)*100)}% do orçamento. O tom deve ser colaborativo, focando no objetivo comum, não na culpa. Use no máximo 25 palavras.`,
    });
    return response.text || `Atenção carinhosa: O orçamento de ${category} está um pouco apertado este mês. Vamos revisar juntos?`;
  } catch (error) {
    return `Nota do Sistema: Gastos elevados em ${category}. Vale a pena conferir.`;
  }
};