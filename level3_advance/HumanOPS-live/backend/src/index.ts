import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { rateLimit } from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { config } from './config/index.js';
import routes from './infrastructure/http/routes/index.js';
import { errorHandler } from './infrastructure/http/middlewares/error.middleware.js';
import { SocketAdapter } from './infrastructure/ws/SocketAdapter.js';

/**
 * HumanOps Live Backend
 * Architecture Hexagonale + Event-Driven + WebSockets
 */

const app = express();
const httpServer = createServer(app);

// ============================================
// MIDDLEWARES
// ============================================

app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// ============================================
// ROUTES
// ============================================

// Documentation API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.use('/api', routes);

// ============================================
// ERROR HANDLING
// ============================================

app.use(errorHandler);

import { HumanStateHistoryRepository } from './infrastructure/persistence/HumanStateHistoryRepository.js';
import { HistoryService } from './application/services/HistoryService.js';
import { InternalReliabilityScoreRepository } from './infrastructure/persistence/InternalReliabilityScoreRepository.js';
import { ReinforcementResponseRepository } from './infrastructure/persistence/ReinforcementResponseRepository.js';
import { ReliabilityService } from './application/services/ReliabilityService.js';

// ============================================
// SERVICES INITIALIZATION
// ============================================

const historyRepository = new HumanStateHistoryRepository();
new HistoryService(historyRepository);
console.log('History Service initialized');

const reliabilityRepository = new InternalReliabilityScoreRepository();
const reinforcementResponseRepository = new ReinforcementResponseRepository();
new ReliabilityService(
  reliabilityRepository, 
  historyRepository, 
  reinforcementResponseRepository
);
console.log('Reliability Service initialized');

// ============================================
// WEBSOCKET SETUP
// ============================================

new SocketAdapter(httpServer);
console.log('WebSocket adapter initialized');

// ============================================
// SERVER START
// ============================================

httpServer.listen(config.port, () => {
  console.log('');
  console.log('HumanOps Live Backend');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Server running on port ${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`WebSocket enabled`);
  console.log(`Architecture: Hexagonal + Event-Driven`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('Available endpoints:');
  console.log('  GET  /health');
  console.log('  POST /api/auth/register');
  console.log('  POST /api/auth/login');
  console.log('  GET  /api/human-states/me');
  console.log('  PUT  /api/human-states/me');
  console.log('  GET  /api/human-states/team/:teamId');
  console.log('');
});

// ============================================
// GRACEFUL SHUTDOWN
// ============================================

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
