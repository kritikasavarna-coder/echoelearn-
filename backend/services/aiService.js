import geminiClient from "../config/geminiClient.js";

// Use the latest stable Gemini Flash model recommended for new projects.
// See https://ai.google.dev/gemini-api/docs/models/gemini-3.6-flash
const GEMINI_MODEL = "gemini-3.6-flash";

const validateTopic = (topic) => {
  if (!topic || typeof topic !== "string" || !topic.trim()) {
    const error = new Error("A valid topic is required.");
    error.status = 400;
    throw error;
  }
};

const validateMessage = (message) => {
  if (!message || typeof message !== "string" || !message.trim()) {
    const error = new Error("A valid message is required.");
    error.status = 400;
    throw error;
  }
};

const extractGeneratedText = (response) => {
  if (!response) return "";

  if (typeof response.text === "string" && response.text.trim()) {
    return response.text.trim();
  }

  const candidates = response?.candidates;
  if (Array.isArray(candidates) && candidates.length > 0) {
    const candidate = candidates[0];

    if (typeof candidate.content === "string" && candidate.content.trim()) {
      return candidate.content.trim();
    }

    if (Array.isArray(candidate.content)) {
      const joinedText = candidate.content
        .map((part) => (typeof part?.text === "string" ? part.text : ""))
        .join("");
      if (joinedText.trim()) {
        return joinedText.trim();
      }
    }

    if (candidate.content && typeof candidate.content === "object") {
      const parts = candidate.content.parts;
      if (Array.isArray(parts) && parts.length > 0) {
        const joinedText = parts
          .map((part) => (typeof part?.text === "string" ? part.text : ""))
          .join("");
        if (joinedText.trim()) {
          return joinedText.trim();
        }
      }

      if (typeof candidate.content.text === "string" && candidate.content.text.trim()) {
        return candidate.content.text.trim();
      }
    }
  }

  return "";
};

const stripMarkdownCodeFences = (text) => {
  if (typeof text !== "string") return text;
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
};

const extractJsonText = (rawText) => {
  if (typeof rawText !== "string") return rawText;

  const cleaned = stripMarkdownCodeFences(rawText);
  if (!cleaned) return cleaned;

  try {
    JSON.parse(cleaned);
    return cleaned;
  } catch {
    const firstObject = cleaned.indexOf("{");
    const firstArray = cleaned.indexOf("[");
    const lastObject = cleaned.lastIndexOf("}");
    const lastArray = cleaned.lastIndexOf("]");
    const start = [firstObject, firstArray].filter((i) => i >= 0);
    const end = [lastObject, lastArray].filter((i) => i >= 0);

    if (start.length && end.length) {
      const sliceStart = Math.min(...start);
      const sliceEnd = Math.max(...end) + 1;
      const candidate = cleaned.slice(sliceStart, sliceEnd).trim();
      try {
        JSON.parse(candidate);
        return candidate;
      } catch {
        // Fall back to cleaned content if candidate extraction fails.
      }
    }
  }

  return cleaned;
};

const generateFromGemini = async (prompt) => {
  const response = await geminiClient.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });

  console.log("Gemini raw response:", JSON.stringify(response, null, 2));

  const text = extractGeneratedText(response);
  if (!text) {
    const error = new Error("Gemini did not return a valid response.");
    error.status = 502;
    throw error;
  }
  return text;
};

const parseServiceJson = (rawText, serviceName) => {
  const text = extractJsonText(rawText);

  console.log(`parseServiceJson rawText type: ${typeof rawText}`);
  console.log(`parseServiceJson rawText:`, rawText);
  console.log(`parseServiceJson cleaned text:`, text);

  if (typeof text !== "string") {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (parseError) {
    console.error(`Gemini raw ${serviceName} response text:`, rawText);
    console.error(`Gemini cleaned ${serviceName} response text:`, text);
    console.error(parseError.stack);
    const error = new Error(`Unable to parse Gemini response for ${serviceName}.`);
    error.status = 502;
    throw error;
  }
};

export const explainTopicService = async (topic) => {
  validateTopic(topic);

  const prompt = `You are a friendly teacher helping a student learn. Create a JSON object for the topic '${topic}' with the following keys: title, summary, keyPoints, realLifeExample, memoryTip. The summary should be simple and clear. The keyPoints array should contain 4 concise bullets. Return valid JSON only.`;

  const rawText = await generateFromGemini(prompt);
  return parseServiceJson(rawText, "explanation");
};

const normalizeQuizQuestion = (question, index) => {
  const options = Array.isArray(question.options) ? question.options : [];
  const normalizedOptions = options.map((opt, optIndex) => {
    if (typeof opt === "string") {
      return {
        id: String.fromCharCode(65 + optIndex),
        label: opt,
      };
    }

    if (opt && typeof opt === "object") {
      return {
        id: opt.id || String.fromCharCode(65 + optIndex),
        label: opt.label || opt.text || String(opt),
      };
    }

    return {
      id: String.fromCharCode(65 + optIndex),
      label: String(opt),
    };
  });

  const correctOptionId = normalizedOptions.find((o) => {
    if (!o || typeof o.label !== "string") return false;
    return o.label.trim().toLowerCase() === String(question.correctAnswer || "").trim().toLowerCase();
  })?.id || normalizedOptions[0]?.id;

  return {
    id: question.id || `question-${index + 1}`,
    question: question.question || question.prompt || "",
    options: normalizedOptions,
    correctAnswer: question.correctAnswer || "",
    correctOptionId,
    explanation: question.explanation || "",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
  };
};

export const generateQuizService = async (topic) => {
  validateTopic(topic);

  const prompt = `You are a patient teacher generating a quiz on '${topic}'. Return valid JSON with exactly 5 multiple-choice questions. Each question should have: question, options, correctAnswer, explanation. Options should be an array of 4 choices. Return valid JSON only.`;

  const rawText = await generateFromGemini(prompt);
  const parsed = parseServiceJson(rawText, "quiz generation");

  const questions = Array.isArray(parsed) ? parsed : parsed.questions;
  if (!Array.isArray(questions) || questions.length !== 5) {
    const error = new Error("Unable to parse Gemini response for quiz generation.");
    error.status = 502;
    throw error;
  }

  return {
    questions: questions.map(normalizeQuizQuestion),
  };
};

export const activeRecallService = async (topic) => {
  validateTopic(topic);

  const prompt = `You are an encouraging teacher creating active recall questions for '${topic}'. Return valid JSON with a single key: questions. Provide exactly 5 questions. Do not include answers or explanations. Return valid JSON only.`;

  const rawText = await generateFromGemini(prompt);
  const parsed = parseServiceJson(rawText, "active recall");

  const questions = Array.isArray(parsed) ? parsed : parsed.questions;
  if (!Array.isArray(questions) || questions.length !== 5) {
    const error = new Error("Unable to parse Gemini response for active recall.");
    error.status = 502;
    throw error;
  }

  return { questions: questions.map((q) => String(q)) };
};

export const aiChatService = async (message) => {
  validateMessage(message);

  const prompt = `You are a patient teacher. Reply to the message below in a kind, clear, and beginner-friendly way. Keep the response short and educational. Message: ${message}`;

  const rawText = await generateFromGemini(prompt);
  const parsed = extractJsonText(rawText);
  return { reply: typeof parsed === "string" ? parsed : String(parsed) };
};
