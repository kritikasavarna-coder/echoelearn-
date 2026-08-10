import {
  explainTopicService,
  generateQuizService,
  activeRecallService,
  aiChatService,
} from "../services/aiService.js";

// Controller for topic explanation
export const explainTopic = async (req, res, next) => {
  try {
    const { topic } = req.body;
    const result = await explainTopicService(topic);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

// Controller for quiz generation
export const generateQuiz = async (req, res, next) => {
  try {
    const { topic } = req.body;
    const result = await generateQuizService(topic);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

// Controller for active recall questions
export const activeRecall = async (req, res, next) => {
  try {
    const { topic } = req.body;
    const result = await activeRecallService(topic);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};

// Controller for AI chat responses
export const aiChat = async (req, res, next) => {
  try {
    const { message } = req.body;
    const result = await aiChatService(message);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
};
