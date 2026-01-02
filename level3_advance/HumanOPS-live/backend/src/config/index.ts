export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
  
  socket: {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    },
  },
  
  // Paramètres métier par défaut
  business: {
    reliabilityScore: {
      min: 0.4,
      max: 1.0,
      default: 0.7,
    },
    reinforcement: {
      defaultExpirationHours: 24,
    },
  },
} as const;

export type Config = typeof config;
