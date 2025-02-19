import "dotenv/config";
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

const poolNeon: Pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const poolConnection = drizzle(poolNeon);