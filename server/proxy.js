import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { openai, AI_MODELS } from './openaiClient.js';
import optimizeRouter from './routes/optimize.js';
import analyzeRouter from './routes/analyze.js';
import convertRouter from './routes/convert.js';
import standupRouter from './routes/standup.js';

const { json, urlencoded } = bodyParser;    
const app = express();

app.use(json({ limit: '2mb' }));
app.use(urlencoded({ extended: true, limit: '2mb' }));
app.use(cors());

app.use('/v1/optimize', optimizeRouter(openai, AI_MODELS));
app.use('/v1/analyze', analyzeRouter(openai, AI_MODELS));
app.use('/v1/convert', convertRouter(openai, AI_MODELS));
app.use('/v1/standup', standupRouter(openai, AI_MODELS));

app.get('/health', (_req, res) => res.send({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
