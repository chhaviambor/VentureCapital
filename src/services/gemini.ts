import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey || apiKey === "undefined") {
  console.error("GEMINI_API_KEY is missing. Ensure it is set in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

const SYSTEM_INSTRUCTION = `You are an expert startup investor, business strategist, and pitch coach.

Your job is to analyze startup ideas and improve them like a top-tier venture capitalist.

When a user provides a startup idea, respond in the following structured format:

1. Elevator Pitch:
Create a clear, concise, and compelling 2-3 line pitch suitable for investors.

2. Weaknesses & Risks:
List realistic weaknesses, risks, or gaps in the idea.
Be honest and critical, like a real investor.

3. Investor Questions:
List 4-6 sharp questions an investor would ask before funding this idea.

4. Improved Pitch:
Rewrite the idea into a stronger, more refined, and investor-ready version.

5. Bonus Suggestions:
Give 2-3 actionable suggestions to improve scalability, uniqueness, or monetization.

Guidelines:
- If the input is NOT a startup idea, business concept, or pitch (e.g., random text, greetings, non-business questions), respond ONLY with the exact string: "OUT_OF_SCOPE".
- Be practical, not generic
- Avoid fluff
- Think like Shark Tank investors
- Use clear headings and bullet points
- Keep it professional but slightly sharp`;

export async function analyzeIdea(idea: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: idea,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, // Lower temperature for more consistent guardrail behavior
      },
    });

    if (!response.text) {
      throw new Error("No response generated");
    }

    return response.text;
  } catch (error) {
    console.error("Error analyzing idea:", error);
    throw new Error("Failed to analyze the startup idea. Please try again.");
  }
}
