import prisma from '../../config/db.js';

export const saveQueryToHistory = async ({ userId, question, generatedSql, result }) => {
    return await prisma.queryHistory.create({
        data: {
            userId,
            question,
            generatedSql,
            result, // Prisma isko JSON field me store karega
        },
    });
};

export const getUserQueryHistory = async (userId) => {
    return await prisma.queryHistory.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
};