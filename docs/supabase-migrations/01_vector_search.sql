-- Supabase Migration for Vector Search Function

-- Function to search meetings using vector similarity
CREATE OR REPLACE FUNCTION match_meetings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title VARCHAR(500),
  meeting_date TIMESTAMP WITH TIME ZONE,
  summary TEXT,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.id,
    m.title,
    m.meeting_date,
    COALESCE(ms.summary, '') as summary,
    1 - (msi.content_embedding <=> query_embedding) as similarity
  FROM meetings m
  LEFT JOIN meeting_summaries ms ON m.id = ms.meeting_id
  INNER JOIN meeting_search_index msi ON m.id = msi.meeting_id
  WHERE 1 - (msi.content_embedding <=> query_embedding) > match_threshold
  ORDER BY msi.content_embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION match_meetings TO postgres;
GRANT EXECUTE ON FUNCTION match_meetings TO anon;
GRANT EXECUTE ON FUNCTION match_meetings TO authenticated;
