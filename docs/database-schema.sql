-- Database Schema for Engineering Leader Tool
-- PostgreSQL with pgvector extension

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table (simplified for single-user MVP)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  meeting_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER,
  attendees JSONB, -- Array of attendee names/emails
  source_calendar_id VARCHAR(255),
  source_event_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting notes/content
CREATE TABLE meeting_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  content TEXT NOT NULL, -- Raw notes/transcript
  source_type VARCHAR(50), -- 'google_doc', 'transcript', 'manual'
  source_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI-generated summaries
CREATE TABLE meeting_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  summary TEXT NOT NULL, -- AI-generated summary
  key_topics JSONB, -- Array of key topics
  action_items JSONB, -- Array of {text, assignee, status}
  decisions JSONB, -- Array of decisions made
  embedding vector(1536), -- For semantic search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search index for meetings
CREATE TABLE meeting_search_index (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  content_embedding vector(1536), -- For RAG retrieval
  searchable_text TEXT, -- Combined text for search
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_meetings_date ON meetings(meeting_date);
CREATE INDEX idx_meetings_attendees ON meetings USING GIN(attendees);
CREATE INDEX idx_summaries_embedding ON meeting_summaries USING ivfflat(embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_search_embedding ON meeting_search_index USING ivfflat(content_embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_search_text ON meeting_search_index USING GIN(to_tsvector('english', searchable_text));

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_summaries_updated_at BEFORE UPDATE ON meeting_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default user (Yugal)
INSERT INTO users (email, name)
VALUES ('yugal@joinfleek.com', 'Yugal')
ON CONFLICT (email) DO NOTHING;

-- Add comments
COMMENT ON TABLE meetings IS 'Calendar events/meetings';
COMMENT ON TABLE meeting_notes IS 'Raw content from Google Docs/transcripts';
COMMENT ON TABLE meeting_summaries IS 'AI-generated summaries with action items and decisions';
COMMENT ON TABLE meeting_search_index IS 'Vector embeddings for semantic search';
