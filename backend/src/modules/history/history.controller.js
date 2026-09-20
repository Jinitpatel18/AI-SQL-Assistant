import { fetchUserHistory } from './history.service.js';

export const getHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const history = await fetchUserHistory(userId);
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};