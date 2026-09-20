import { getDatabaseSchema } from '../schema/schema.service.js';
import { buildSqlPrompt } from '../../core/llm/promptBuilder.js';
import { generateSqlFromPrompt } from '../../core/llm/llmClient.js';
import { validateSqlIsSafe } from '../../core/sqlSafety/sqlValidator.js';
import { executeSafeQuery } from '../../core/sqlSafety/sqlExecutor.js';
import { saveQueryToHistory } from './query.repository.js';

export const processUserQuestion = async (userId, question) => {
    const schema = await getDatabaseSchema();
    const prompt = buildSqlPrompt(schema, question);

    let generatedSql = await generateSqlFromPrompt(prompt);
    generatedSql = generatedSql.replace(/```sql|```/g, '').trim();

    validateSqlIsSafe(generatedSql);

    const result = await executeSafeQuery(generatedSql);

    // History save karo — agar ye fail bhi ho jaye, user ko result to mil hi jayega
    await saveQueryToHistory({ userId, question, generatedSql, result });

    return {
        question,
        generatedSql,
        result,
    };
};