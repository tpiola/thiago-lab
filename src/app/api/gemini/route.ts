import { NextResponse } from 'next/server';

type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

const MAX_MESSAGES = 30;
const MAX_CONTENT_LENGTH = 12_000;

function isMessage(value: unknown): value is ChatMessage {
  if (typeof value !== 'object' || value === null) return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === 'user' || message.role === 'assistant' || message.role === 'system') &&
    typeof message.content === 'string' &&
    message.content.length > 0 &&
    message.content.length <= MAX_CONTENT_LENGTH
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[gemini] GEMINI_API_KEY is not configured');
    return NextResponse.json({ error: 'service_unavailable' }, { status: 503 });
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }

  if (typeof input !== 'object' || input === null) {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 });
  }

  const body = input as Record<string, unknown>;
  if (
    !Array.isArray(body.messages) ||
    body.messages.length === 0 ||
    body.messages.length > MAX_MESSAGES ||
    !body.messages.every(isMessage)
  ) {
    return NextResponse.json({ error: 'invalid_messages' }, { status: 400 });
  }

  const systemPrompt =
    typeof body.systemPrompt === 'string'
      ? body.systemPrompt.slice(0, MAX_CONTENT_LENGTH)
      : undefined;

  const contents = body.messages
    .filter((message) => message.role !== 'system')
    .map((message) => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    }));

  const systemInstructionParts = [
    ...(systemPrompt ? [{ text: systemPrompt }] : []),
    ...body.messages
      .filter((message) => message.role === 'system')
      .map((message) => ({ text: message.content })),
  ];

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          ...(systemInstructionParts.length
            ? { systemInstruction: { parts: systemInstructionParts } }
            : {}),
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            topP: 0.95,
          },
        }),
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      console.error('[gemini] provider rejected request:', response.status);
      return NextResponse.json({ error: 'provider_error' }, { status: 502 });
    }

    const data: unknown = await response.json();
    const text =
      typeof data === 'object' &&
      data !== null &&
      'candidates' in data &&
      Array.isArray(data.candidates) &&
      typeof data.candidates[0]?.content?.parts?.[0]?.text === 'string'
        ? data.candidates[0].content.parts[0].text
        : null;

    if (!text) {
      return NextResponse.json({ error: 'empty_response' }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error('[gemini] request failed:', error instanceof Error ? error.name : 'unknown');
    return NextResponse.json({ error: 'provider_unavailable' }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
