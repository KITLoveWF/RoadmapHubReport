import LLMService from "../services/LLM.service.js";
import express from 'express';
const router = express.Router();

router.post('/generate-roadmap-local', LLMService.getLLMResponse);
router.post('/generate-roadmap-gemini', LLMService.getGeminiResponse);

export default router;