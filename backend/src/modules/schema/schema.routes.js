import express from 'express';
import { getSchema } from './schema.controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getSchema);

export default router;