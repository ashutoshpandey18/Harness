// Helper for calling OpenRouter API with Gemini / Claude models

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callLLM(
  messages: ChatMessage[],
  options: { model?: string; temperature?: number } = {}
): Promise<string> {
  const model = options.model || "google/gemini-2.5-flash";
  const temp = options.temperature ?? 0.3;

  if (!OPENROUTER_API_KEY) {
    console.warn("OPENROUTER_API_KEY is not defined. Falling back to local mock response.");
    return "Error: OPENROUTER_API_KEY is not configured in .env.local.";
  }

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "MAGS.ai Console"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temp,
        max_tokens: 1024,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenRouter API error:", errText);
      throw new Error(`OpenRouter returned status ${res.status}`);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || "";
  } catch (error) {
    console.error("Failed to query OpenRouter:", error);
    return `[Mock Response due to API Error]: I detected your request. Please check that your API key is active.`;
  }
}

// Translate text helper
export async function translateText(text: string, targetLanguage: string): Promise<string> {
  const prompt = `Translate the following text into ${targetLanguage}. 
Return ONLY the translated text, with no preamble, explanations, or extra quotes.

Text to translate:
"${text}"`;

  return callLLM([{ role: "user", content: prompt }], { temperature: 0.1 });
}
