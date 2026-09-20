import { getUserQueryHistory } from '../query/query.repository.js';

export const fetchUserHistory = async (userId) => {
    return await getUserQueryHistory(userId);
};