import targetPool from '../../config/targetDb.js';

export const getDatabaseSchema = async () => {
    const query = `
    SELECT 
      table_name,
      column_name,
      data_type,
      is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position;
  `;

    const result = await targetPool.query(query);

    // Data ko table-wise group karo (flat list se structured object banao)
    const schema = {};

    for (const row of result.rows) {
        if (!schema[row.table_name]) {
            schema[row.table_name] = [];
        }
        schema[row.table_name].push({
            column: row.column_name,
            type: row.data_type,
            nullable: row.is_nullable === 'YES',
        });
    }

    return schema;
};