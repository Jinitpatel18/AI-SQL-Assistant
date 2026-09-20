export const buildSqlPrompt = (schema, userQuestion) => {
    const schemaText = Object.entries(schema)
        .map(([tableName, columns]) => {
            const columnsText = columns
                .map((col) => `  - ${col.column} (${col.type})`)
                .join('\n');
            return `Table: ${tableName}\n${columnsText}`;
        })
        .join('\n\n');

    return `You are a PostgreSQL expert. Given the database schema below, convert the user's question into a single valid PostgreSQL SELECT query.

Database Schema:
${schemaText}

Rules:
- Only generate SELECT queries. Never generate INSERT, UPDATE, DELETE, DROP, or ALTER statements.
- Return ONLY the raw SQL query, no explanation, no markdown code blocks, no backticks.
- Use proper JOINs when the question requires data from multiple tables.
- For text/string comparisons (like names, cities, categories), always use ILIKE instead of = to make matching case-insensitive, unless the user explicitly asks for exact/case-sensitive matching.

User Question: "${userQuestion}"

SQL Query:`;
};