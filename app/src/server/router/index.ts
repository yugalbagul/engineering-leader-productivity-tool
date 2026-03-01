import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { supabase } from '../db';
import { generateMeetingSummary, generateEmbedding, processQuery } from '../llm';
import { fetchCalendarEvents, fetchMeetingNotes, eventToMeeting } from '../integrations/google';

/**
 * tRPC Router for Engineering Leader Tool
 */
export const appRouter = router({
  // Meetings procedures
  meetings: router({
    list: publicProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }))
      .query(async ({ input }) => {
        const { data, error } = await supabase
          .from('meetings')
          .select(`
            *,
            meeting_summaries(*),
            meeting_notes(*)
          `)
          .order('meeting_date', { ascending: false })
          .range(input.offset, input.offset + input.limit - 1);

        if (error) throw error;
        return data;
      }),

    get: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }) => {
        const { data, error } = await supabase
          .from('meetings')
          .select(`
            *,
            meeting_summaries(*),
            meeting_notes(*)
          `)
          .eq('id', input.id)
          .single();

        if (error) throw error;
        return data;
      }),

    byDate: publicProcedure
      .input(z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      }))
      .query(async ({ input }) => {
        const { data, error } = await supabase
          .from('meetings')
          .select(`
            *,
            meeting_summaries(*),
            meeting_notes(*)
          `)
          .gte('meeting_date', input.startDate)
          .lte('meeting_date', input.endDate)
          .order('meeting_date', { ascending: false });

        if (error) throw error;
        return data;
      }),
  }),

  // Calendar ingestion
  ingestion: router({
    syncCalendar: publicProcedure
      .input(z.object({
        daysBack: z.number().min(1).max(30).default(7),
      }))
      .mutation(async ({ input }) => {
        // Fetch calendar events
        const events = await fetchCalendarEvents(input.daysBack);

        let syncedCount = 0;

        for (const event of events) {
          const meetingData = eventToMeeting(event);

          // Check if meeting already exists
          const { data: existing } = await supabase
            .from('meetings')
            .select('id')
            .eq('source_event_id', event.id)
            .single();

          if (existing) {
            // Update existing meeting
            const { error } = await supabase
              .from('meetings')
              .update(meetingData)
              .eq('id', existing.id);

            if (!error) syncedCount++;
          } else {
            // Create new meeting
            const { error } = await supabase
              .from('meetings')
              .insert(meetingData)
              .select('id')
              .single();

            if (!error) syncedCount++;
          }
        }

        return { synced: syncedCount, total: events.length };
      }),

    syncNotes: publicProcedure
      .input(z.object({
        meetingId: z.string().uuid(),
      }))
      .mutation(async ({ input }) => {
        // Fetch meeting
        const { data: meeting, error } = await supabase
          .from('meetings')
          .select('*')
          .eq('id', input.meetingId)
          .single();

        if (error || !meeting) throw error || new Error('Meeting not found');

        // Fetch notes from Google Drive
        const notesContent = await fetchMeetingNotes(
          meeting.title,
          meeting.attendees
        );

        if (!notesContent) {
          return { success: false, message: 'No notes found' };
        }

        // Insert notes
        const { error: insertError } = await supabase
          .from('meeting_notes')
          .insert({
            meeting_id: input.meetingId,
            content: notesContent,
            source_type: 'google_doc',
          });

        if (insertError) throw insertError;

        // Generate summary
        const summary = await generateMeetingSummary({
          title: meeting.title,
          attendees: meeting.attendees,
          content: notesContent,
        });

        // Generate embeddings
        const summaryEmbedding = await generateEmbedding(summary.summary);
        const contentEmbedding = await generateEmbedding(notesContent);

        // Insert summary
        const { error: summaryError } = await supabase
          .from('meeting_summaries')
          .insert({
            meeting_id: input.meetingId,
            summary: summary.summary,
            key_topics: summary.key_topics,
            action_items: summary.action_items,
            decisions: summary.decisions,
            embedding: summaryEmbedding,
          });

        if (summaryError) throw summaryError;

        // Insert search index
        const searchableText = `${meeting.title}\n${notesContent}\n${summary.summary}`;
        const { error: searchError } = await supabase
          .from('meeting_search_index')
          .insert({
            meeting_id: input.meetingId,
            content_embedding: contentEmbedding,
            searchable_text: searchableText,
          });

        if (searchError) throw searchError;

        return { success: true };
      }),
  }),

  // Search procedures
  search: router({
    semantic: publicProcedure
      .input(z.object({
        query: z.string(),
        limit: z.number().min(1).max(20).default(5),
      }))
      .mutation(async ({ input }) => {
        // Generate embedding for query
        const queryEmbedding = await generateEmbedding(input.query);

        // Search using vector similarity
        const { data, error } = await supabase.rpc('match_meetings', {
          query_embedding: queryEmbedding,
          match_threshold: 0.7,
          match_count: input.limit,
        });

        if (error) throw error;
        return data;
      }),

    naturalLanguage: publicProcedure
      .input(z.object({
        query: z.string(),
      }))
      .mutation(async ({ input }) => {
        // First, do semantic search to get context
        const queryEmbedding = await generateEmbedding(input.query);

        const { data: meetings, error: searchError } = await supabase.rpc('match_meetings', {
          query_embedding: queryEmbedding,
          match_threshold: 0.6,
          match_count: 3,
        });

        if (searchError) throw searchError;

        // Build context from search results
        const context = meetings.map((m: any) => 
          `Meeting: ${m.title}\nDate: ${m.meeting_date}\nSummary: ${m.summary}\n`
        ).join('\n---\n');

        // Process query with LLM
        const answer = await processQuery(input.query, context);

        return {
          answer,
          sources: meetings,
        };
      }),
  }),

  // Stats
  stats: router({
    overview: publicProcedure.query(async () => {
      const [meetingsResult, summaryResult] = await Promise.all([
        supabase.from('meetings').select('id', { count: 'exact', head: true }),
        supabase.from('meeting_summaries').select('id', { count: 'exact', head: true }),
      ]);

      return {
        totalMeetings: meetingsResult.count || 0,
        summarizedMeetings: summaryResult.count || 0,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
