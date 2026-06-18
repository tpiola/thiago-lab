/* ═══════════════════════════════════════════════════════════════════════════
   Gemini Client — Intelligence OS
   Usa Google Gemini API key (NEXT_PUBLIC_GEMINI_API_KEY) com fallback
   para OmniRoute Gateway (localhost:20128)
   ═══════════════════════════════════════════════════════════════════════════ */

const OMNIROUTE_URL = "http://localhost:20128/v1/chat/completions";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

/* ── Tipos ──────────────────────────────────────────────────────────────── */
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface GeminiResponse {
  text: string;
  source: "gemini" | "omniRoute" | "error";
}

/* ── Gerar texto via OmniRoute ──────────────────────────────────────────── */
async function queryOmniRoute(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  const fullMessages: ChatMessage[] = systemPrompt
    ? [{ role: "system", content: systemPrompt }, ...messages]
    : messages;

  const res = await fetch(OMNIROUTE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: fullMessages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Erro desconhecido");
    throw new Error(`OmniRoute ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "Sem resposta do modelo.";
}

/* ── Gerar texto via Gemini API ─────────────────────────────────────────── */
async function queryGemini(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<string> {
  const apiKey =
    typeof window !== "undefined"
      ? // @ts-expect-error - acessando process.env no cliente
        window.ENV?.NEXT_PUBLIC_GEMINI_API_KEY ||
        process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
        ""
      : process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  if (!apiKey) throw new Error("Gemini API key não configurada");

  // Concatena system prompt e mensagens
  const contents = [];
  if (systemPrompt) {
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
    contents.push({
      role: "model",
      parts: [{ text: "Instruções recebidas. Como posso ajudar?" }],
    });
  }

  for (const msg of messages) {
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    });
  }

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
        topP: 0.95,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Erro desconhecido");
    throw new Error(`Gemini API ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sem resposta da Gemini."
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Funções Públicas
   ═══════════════════════════════════════════════════════════════════════════ */

/** Gera texto tentando Gemini → OmniRoute como fallback */
export async function generateText(
  prompt: string,
  systemPrompt?: string
): Promise<GeminiResponse> {
  const messages: ChatMessage[] = [{ role: "user", content: prompt }];

  // Tenta Gemini primeiro
  try {
    const text = await queryGemini(messages, systemPrompt);
    return { text, source: "gemini" };
  } catch (geminiErr) {
    console.warn("Gemini falhou, tentando OmniRoute:", geminiErr);
  }

  // Fallback OmniRoute
  try {
    const text = await queryOmniRoute(messages, systemPrompt);
    return { text, source: "omniRoute" };
  } catch (omniErr) {
    return {
      text: `Erro ao processar requisição. Gemini e OmniRoute indisponíveis.\n\nDetalhes: ${omniErr instanceof Error ? omniErr.message : "Erro desconhecido"}`,
      source: "error",
    };
  }
}

/** Chat multi-turn com fallback */
export async function chat(
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<GeminiResponse> {
  // Tenta Gemini primeiro
  try {
    const text = await queryGemini(messages, systemPrompt);
    return { text, source: "gemini" };
  } catch (geminiErr) {
    console.warn("Gemini chat falhou, tentando OmniRoute:", geminiErr);
  }

  try {
    const text = await queryOmniRoute(messages, systemPrompt);
    return { text, source: "omniRoute" };
  } catch (omniErr) {
    return {
      text: `Erro no chat. Serviços indisponíveis.\n\nDetalhes: ${omniErr instanceof Error ? omniErr.message : "Erro desconhecido"}`,
      source: "error",
    };
  }
}

/** Analisa dados com prompt estruturado */
export async function analyzeData(
  data: unknown,
  instruction: string
): Promise<GeminiResponse> {
  const prompt = `
[DADOS PARA ANÁLISE]
${JSON.stringify(data, null, 2)}

[INSTRUÇÃO]
${instruction}

Por favor, analise os dados acima e forneça insights acionáveis.
  `.trim();

  return generateText(prompt, "Você é um analista de dados sênior do Intelligence OS CRM. Seja conciso e objetivo.");
}
