import express from 'express';
import { askQuestion } from './query.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/ask', authMiddleware, askQuestion);

export default router;