import { NextRequest } from "next/server";
import OpenAI from "openai";

export const runtime = "edge"; // IMPORTANT for streaming

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

/* ---------------- strict system prompt ---------------- */

const SYSTEM_PROMPT = `
You are an academic assistant.

You will receive:
- user query
- list of available subjects
- allowed resource types

Your task:
1. Identify the subject ONLY from the given subject list
2. Identify requested resource types ONLY from allowed list
3. If unclear, ask clarification question

Rules:
- Never invent subjects
- Never invent resource types
- Keep responses short
- Respond ONLY with valid JSON
- No markdown
- No explanations

JSON format (STRICT):
{
  "subject": string | null,
  "types": string[],
  "needClarification": boolean,
  "clarificationQuestion": string | null
}
`;

export async function POST(req: NextRequest) {
    const body = await req.json();

    const { query, subjects, allowedTypes } = body.user;

    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        stream: true,
        temperature: 0,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
                role: "user",
                content: JSON.stringify({
                    query,
                    subjects,
                    allowedTypes,
                }),
            },
        ],
    });

    const readable = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of stream) {
                    const token = chunk.choices[0]?.delta?.content || "";
                    fullResponse += token;
                }

                // validate JSON
                const parsed = JSON.parse(fullResponse);

                controller.enqueue(
                    encoder.encode(JSON.stringify(parsed))
                );
                controller.close();
            } catch (err) {
                controller.enqueue(
                    encoder.encode(
                        JSON.stringify({
                            subject: null,
                            types: [],
                            needClarification: true,
                            clarificationQuestion:
                                "I couldn’t understand that. Can you rephrase?",
                        })
                    )
                );
                controller.close();
            }
        },
    });

    return new Response(readable, {
        headers: {
            "Content-Type": "application/json",
            "Transfer-Encoding": "chunked",
        },
    });
}
