import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

// Load environment variables before reading the Gemini API key.
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY?.trim();
if (!apiKey) {
  throw new Error("GEMINI_API_KEY must be set in .env before starting the backend.");
}

// Initialize Gemini client once and reuse throughout the backend.
// Explicitly disable Vertex AI and use only the Gemini API with API key auth.
const geminiClient = new GoogleGenAI({
  apiKey,
  vertexai: false,
  httpOptions: {
    baseUrl: "https://generativelanguage.googleapis.com/",
  },
});

export default geminiClient;
