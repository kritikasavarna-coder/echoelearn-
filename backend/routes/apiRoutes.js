import express from "express";
import {
  explainTopic,
  generateQuiz,
  activeRecall,
  aiChat,
} from "../controllers/aiController.js";

const router = express.Router();

// POST /api/explain - explain a topic in a student-friendly format
router.post("/explain", explainTopic);

// POST /api/quiz - generate 5 multiple-choice questions
router.post("/quiz", generateQuiz);

// POST /api/recall - generate 5 active recall questions
router.post("/recall", activeRecall);

// POST /api/chat - simple AI chat behavior
router.post("/chat", aiChat);

export default router;
