import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

let geminiFlash: ChatGoogleGenerativeAI | null = null;
let groqLlama: ChatGroq | null = null;
let openRouterMiniMax: ChatOpenAI | null = null;
let openRouterGLM: ChatOpenAI | null = null;

export function getGemini() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!geminiFlash && apiKey) {
    geminiFlash = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey,
      maxOutputTokens: 2048,
    });
  }
  return geminiFlash;
}

export function getGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!groqLlama && apiKey) {
    groqLlama = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      apiKey,
      maxTokens: 2048,
    });
  }
  return groqLlama;
}

export function getOpenRouterMiniMax() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterMiniMax && apiKey) {
    openRouterMiniMax = new ChatOpenAI({
      modelName: "minimax/minimax-m2.5:free",
      apiKey,
      configuration: { baseURL: "https://openrouter.ai/api/v1" },
      maxTokens: 2048,
    });
  }
  return openRouterMiniMax;
}

export function getOpenRouterGLM() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!openRouterGLM && apiKey) {
    openRouterGLM = new ChatOpenAI({
      modelName: "z-ai/glm-4.5-air:free",
      apiKey,
      configuration: { baseURL: "https://openrouter.ai/api/v1" },
      maxTokens: 2048,
    });
  }
  return openRouterGLM;
}
