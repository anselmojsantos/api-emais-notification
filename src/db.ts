import { PrismaClient } from '../prisma/generated/prisma';
//import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';


//const adapter = new PrismaBetterSqlite3({
  //  url: process.env.DATABASE_URL || 'file:./dev.db',
//});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
  adapter,
  errorFormat: "pretty",
});

export async function connect() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado ao banco de dados');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  } 
}

export async function disconnect() {
  await prisma.$disconnect();
  console.log('🔌 Desconectado do banco de dados');
}