import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

try {
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migration completed successfully');
} catch (e) {
  console.error('Migration error:', e.message, e.cause?.message || '');
  process.exit(1);
} finally {
  await connection.end();
  process.exit(0);
}
