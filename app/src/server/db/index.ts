import { Pool, PoolClient } from 'pg';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://engtool:engtool_password@localhost:5432/engtool_db',
});

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meeting_date: string;
  duration_minutes: number | null;
  attendees: any[];
  source_calendar_id: string | null;
  source_event_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface MeetingNote {
  id: string;
  meeting_id: string;
  content: string;
  source_type: string | null;
  source_url: string | null;
  created_at: string;
}

export interface MeetingSummary {
  id: string;
  meeting_id: string;
  summary: string;
  key_topics: any[];
  action_items: any[];
  decisions: any[];
  created_at: string;
  updated_at: string;
}

export interface MeetingWithSummary extends Meeting {
  summary: MeetingSummary | null;
  notes: MeetingNote[];
}

// Query helper with automatic connection management
export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

// Query helper for single result
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows.length > 0 ? rows[0] : null;
}

// Insert helper
export async function insert<T = any>(text: string, params?: any[]): Promise<T> {
  const rows = await query<T>(text, params);
  if (rows.length === 0) {
    throw new Error('Insert failed - no rows returned');
  }
  return rows[0];
}

export default pool;
