import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema/index';

/** Create a Drizzle client bound to the D1 database from the Worker env. */
export function createDb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type Db = ReturnType<typeof createDb>;
