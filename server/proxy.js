import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { AI_MODELS, OPENROUTER_CONFIG } from './openaiClient.js';
import optimizeRoute from './routes/optimize.js';
import convertRoute from './routes/convert.js';
import analyzeRoute from './routes/analyze.js';
import standupRoute from './routes/standup.js';
import promptRoute from './routes/prompt.js';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '5mb' }));

// Routes
app.use('/v1/optimize', optimizeRoute(OPENROUTER_CONFIG, AI_MODELS));
app.use('/v1/convert', convertRoute(OPENROUTER_CONFIG, AI_MODELS));
app.use('/v1/analyze', analyzeRoute(OPENROUTER_CONFIG, AI_MODELS));
app.use('/v1/standup', standupRoute(OPENROUTER_CONFIG, AI_MODELS));
app.use('/v1/prompt', promptRoute(OPENROUTER_CONFIG, AI_MODELS));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    details: err.message
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});