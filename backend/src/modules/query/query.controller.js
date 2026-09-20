import { processUserQuestion } from './query.service.js';

export const askQuestion = async (req, res) => {
    try {
        const { question } = req.body;
        const userId = req.user.userId; // authMiddleware se aaya

        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        const result = await processUserQuestion(userId, question);

        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};