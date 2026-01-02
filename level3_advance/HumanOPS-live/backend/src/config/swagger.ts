import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HumanOps Live API',
      version,
      description: 'API documentation for HumanOps Live backend. Human Observability System (HOS).',
      contact: {
        name: 'HumanOps Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './src/infrastructure/http/routes/*.ts',
    './src/infrastructure/http/controllers/*.ts',
  ], // Path to the API docs
};

export const swaggerSpec = swaggerJsdoc(options);
