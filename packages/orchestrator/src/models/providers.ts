import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { ChatOpenAI } from "@langchain/openai";

let geminiFlash: ChatGoogleGenerativeAI | null = null;
let groqLlama: ChatGroq | null = null;

let openAIModel: ChatOpenAI | null = null;
let codexModel: ChatOpenAI | null = null;

export function getGemini(key?: string) {
  const apiKey = key || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!geminiFlash && apiKey && apiKey !== "your_gemini_key_here") {
    geminiFlash = new ChatGoogleGenerativeAI({
      model: "gemini-1.5-flash",
      apiKey,
      maxOutputTokens: 2048,
    });
  }
  return geminiFlash;
}

export function getGroq(key?: string) {
  const apiKey = key || process.env.GROQ_API_KEY;
  if (!groqLlama && apiKey && apiKey !== "your_groq_key_here") {
    groqLlama = new ChatGroq({
      model: "llama-3.3-70b-versatile",
      apiKey,
      maxTokens: 2048,
    });
  }
  return groqLlama;
}


export function getOpenAI(key?: string) {
  const apiKey = key || process.env.OPENAI_API_KEY;
  if (!openAIModel && apiKey && apiKey !== "your_openai_key_here") {
    openAIModel = new ChatOpenAI({
      model: "gpt-4o",
      apiKey,
      configuration: { 
        baseURL: "https://api.freemodel.dev/v1",
      },
      maxTokens: 2048,
    });
  }
  return openAIModel;
}

export function getCodex(key?: string) {
  const apiKey = key || process.env.CODEX_API_KEY;
  if (!codexModel && apiKey && apiKey !== "your_codex_key_here") {
    codexModel = new ChatOpenAI({
      model: "gpt-4o",
      apiKey,
      configuration: { 
        baseURL: "https://api.freemodel.dev/v1",
      },
      maxTokens: 2048,
    });
  }
  return codexModel;
}

