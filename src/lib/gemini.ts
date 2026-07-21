/* Gemini client — browser-safe.
   All provider credentials remain server-side in /api/gemini. */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GeminiResponse {
  text: string;
  source: 'gemini' | 'error';
}

type GeminiRequest = {
  messages: ChatMessage[];
  systemPrompt?: string;
};

async function requestGemini(payload: GeminiRequest): Promise<GeminiResponse> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data: unknown = await response.json();
    if (
      !response.ok ||
      typeof data !== 'object' ||
      data === null ||
      !('text' in data) ||
      typeof data.text !== 'string'
    ) {
      return { text: 'Não foi possível processar a solicitação.', source: 'error' };
    }

    return { text: data.text, source: 'gemini' };
  } catch {
    return { text: 'Serviço de inteligência temporariamente indisponível.', source: 'error' };
  }
}

export async function generateText(
  prompt: string,
  systemPrompt?: string,
): Promise<GeminiResponse> {
  return requestGemini({
    messages: [{ role: 'user', content: prompt }],
    systemPrompt,
  });
}

export async function chat(
  messages: ChatMessage[],
  systemPrompt?: string,
): Promise<GeminiResponse> {
  return requestGemini({ messages, systemPrompt });
}

export async function analyzeData(
  data: unknown,
  instruction: string,
): Promise<GeminiResponse> {
  const prompt = `[DADOS PARA ANÁLISE]\n${JSON.stringify(data, null, 2)}\n\n[INSTRUÇÃO]\n${instruction}`;
  return generateText(
    prompt,
    'Você é um analista de dados sênior. Seja conciso, objetivo e não invente fatos.',
  );
}
