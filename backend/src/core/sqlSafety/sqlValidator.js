import pkg from 'node-sql-parser';
const { Parser } = pkg;

const parser = new Parser();

export const validateSqlIsSafe = (sql) => {
    let parsedResult;

    try {
        parsedResult = parser.astify(sql, { database: 'postgresql' });
    } catch (error) {
        throw new Error('Generated SQL is not valid: ' + error.message);
    }

    const statements = Array.isArray(parsedResult) ? parsedResult : [parsedResult];

    if (statements.length > 1) {
        throw new Error('Multiple SQL statements are not allowed');
    }

    const statement = statements[0];

    if (statement.type !== 'select') {
        throw new Error(`Only SELECT queries are allowed. Detected type: ${statement.type}`);
    }

    return true;
};