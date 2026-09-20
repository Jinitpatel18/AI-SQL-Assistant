import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes.js';
import schemaRoutes from './modules/schema/schema.routes.js';
import queryRoutes from './modules/query/query.routes.js';
import historyRoutes from './modules/history/history.routes.js';


const app = express()

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json())

app.get("/", (req, res) => {
    res.json({ status: 'ok', message: "Hello This is The Fist Api After Start This New Project!!" })
});

app.use('/api/auth', authRoutes);
app.use('/api/schema', schemaRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/history', historyRoutes);

export default app;