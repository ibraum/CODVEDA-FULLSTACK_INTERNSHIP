import { PrismaClient } from '../../generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { config } from '../../config/index.js';

const connectionString = config.database.url;
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
