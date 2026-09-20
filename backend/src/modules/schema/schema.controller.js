import { getDatabaseSchema } from './schema.service.js';

export const getSchema = async (req, res) => {
    try {
        const schema = await getDatabaseSchema();
        res.status(200).json(schema);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};