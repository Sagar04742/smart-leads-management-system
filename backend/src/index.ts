import dns from "dns";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth';
import leadRoutes from './routes/leads';
import { errorHandler, notFound } from './middleware/errorHandler';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_, res) => res.json({ success: true, message: 'OK' }));
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
