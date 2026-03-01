import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

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
