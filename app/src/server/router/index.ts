import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { query, queryOne, insert } from '../db';
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
        const meetings = await query(
          `SELECT
            m.*,
            json_agg(
              json_build_object(
                'id', ms.id,
                'summary', ms.summary,
                'key_topics', ms.key_topics,
                'action_items', ms.action_items,
                'decisions', ms.decisions,
                'created_at', ms.created_at
              ) FILTER (WHERE ms.id IS NOT NULL)
            ) as meeting_summaries,
            json_agg(
              json_build_object(
                'id', mn.id,
                'content', mn.content,
                'source_type', mn.source_type,
                'created_at', mn.created_at
              ) FILTER (WHERE mn.id IS NOT NULL)
            ) as meeting_notes
          FROM meetings m
          LEFT JOIN meeting_summaries ms ON m.id = ms.meeting_id
          LEFT JOIN meeting_notes mn ON m.id = mn.meeting_id
          GROUP BY m.id
          ORDER BY m.meeting_date DESC
          LIMIT $1 OFFSET $2`,
          [input.limit, input.offset]
        );

        // Transform JSON aggregations into arrays
        return meetings.map((m: any) => ({
          ...m,
          meeting_summaries: m.meeting_summaries[0] || null,
          meeting_notes: m.meeting_notes || [],
        }));
      }),

    get: publicProcedure
      .input(z.object({ id: z.string().uuid() }))
      .query(async ({ input }) => {
        const meeting = await queryOne(
          `SELECT
            m.*,
            json_agg(
              json_build_object(
                'id', ms.id,
                'summary', ms.summary,
                'key_topics', ms.key_topics,
                'action_items', ms.action_items,
                'decisions', ms.decisions
              ) FILTER (WHERE ms.id IS NOT NULL)
            ) as meeting_summaries,
            json_agg(
              json_build_object(
                'id', mn.id,
                'content', mn.content,
                'source_type', mn.source_type
              ) FILTER (WHERE mn.id IS NOT NULL)
            ) as meeting_notes
          FROM meetings m
          LEFT JOIN meeting_summaries ms ON m.id = ms.meeting_id
          LEFT JOIN meeting_notes mn ON m.id = mn.meeting_id
          WHERE m.id = $1
          GROUP BY m.id`,
          [input.id]
        );

        if (!meeting) {
          throw new Error('Meeting not found');
        }

        return {
          ...meeting,
          meeting_summaries: meeting.meeting_summaries[0] || null,
          meeting_notes: meeting.meeting_notes || [],
        };
      }),

    byDate: publicProcedure
      .input(z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
      }))
      .query(async ({ input }) => {
        const meetings = await query(
          `SELECT
            m.*,
            json_agg(
              json_build_object(
                'id', ms.id,
                'summary', ms.summary,
                'key_topics', ms.key_topics,
                'action_items', ms.action_items,
                'decisions', ms.decisions
              ) FILTER (WHERE ms.id IS NOT NULL)
            ) as meeting_summaries,
            json_agg(
              json_build_object(
                'id', mn.id,
                'content', mn.content
              ) FILTER (WHERE mn.id IS NOT NULL)
            ) as meeting_notes
          FROM meetings m
          LEFT JOIN meeting_summaries ms ON m.id = ms.meeting_id
          LEFT JOIN meeting_notes mn ON m.id = mn.meeting_id
          WHERE m.meeting_date >= $1 AND m.meeting_date <= $2
          GROUP BY m.id
          ORDER BY m.meeting_date DESC`,
          [input.startDate, input.endDate]
        );

        return meetings.map((m: any) => ({
          ...m,
          meeting_summaries: m.meeting_summaries[0] || null,
          meeting_notes: m.meeting_notes || [],
        }));
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
          const existing = await queryOne(
            'SELECT id FROM meetings WHERE source_event_id = $1',
            [event.id || '']
          );

          if (existing) {
            // Update existing meeting
            await query(
              `UPDATE meetings
               SET title = $1, description = $2, meeting_date = $3, duration_minutes = $4,
                   attendees = $5, source_calendar_id = $6, source_event_id = $7, updated_at = NOW()
               WHERE id = $8`,
              [
                meetingData.title,
                meetingData.description,
                meetingData.meeting_date,
                meetingData.duration_minutes,
                JSON.stringify(meetingData.attendees),
                meetingData.source_calendar_id,
                meetingData.source_event_id,
                existing.id,
              ]
            );
            syncedCount++;
          } else {
            // Create new meeting
            await insert(
              `INSERT INTO meetings (title, description, meeting_date, duration_minutes, attendees, source_calendar_id, source_event_id)
               VALUES ($1, $2, $3, $4, $5, $6, $7)
               RETURNING *`,
              [
                meetingData.title,
                meetingData.description,
                meetingData.meeting_date,
                meetingData.duration_minutes,
                JSON.stringify(meetingData.attendees),
                meetingData.source_calendar_id,
                meetingData.source_event_id,
              ]
            );
            syncedCount++;
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
        const meeting = await queryOne(
          'SELECT * FROM meetings WHERE id = $1',
          [input.meetingId]
        );

        if (!meeting) {
          throw new Error('Meeting not found');
        }

        // Fetch notes from Google Drive
        const notesContent = await fetchMeetingNotes(
          meeting.title,
          meeting.attendees
        );

        if (!notesContent) {
          return { success: false, message: 'No notes found' };
        }

        // Insert notes
        await insert(
          `INSERT INTO meeting_notes (meeting_id, content, source_type)
           VALUES ($1, $2, 'google_doc')
           RETURNING *`,
          [input.meetingId, notesContent]
        );

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
        await insert(
          `INSERT INTO meeting_summaries (meeting_id, summary, key_topics, action_items, decisions, embedding)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            input.meetingId,
            summary.summary,
            JSON.stringify(summary.key_topics),
            JSON.stringify(summary.action_items),
            JSON.stringify(summary.decisions),
            summaryEmbedding,
          ]
        );

        // Insert search index
        const searchableText = `${meeting.title}\n${notesContent}\n${summary.summary}`;
        await insert(
          `INSERT INTO meeting_search_index (meeting_id, content_embedding, searchable_text)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [input.meetingId, contentEmbedding, searchableText]
        );

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
        const results = await query(
          `SELECT
            m.id,
            m.title,
            m.meeting_date,
            COALESCE(ms.summary, '') as summary,
            1 - (msi.content_embedding <=> $1) as similarity
          FROM meetings m
          LEFT JOIN meeting_summaries ms ON m.id = ms.meeting_id
          INNER JOIN meeting_search_index msi ON m.id = msi.meeting_id
          WHERE 1 - (msi.content_embedding <=> $1) > 0.7
          ORDER BY msi.content_embedding <=> $1
          LIMIT $2`,
          [queryEmbedding, input.limit]
        );

        return results;
      }),

    naturalLanguage: publicProcedure
      .input(z.object({
        query: z.string(),
      }))
      .mutation(async ({ input }) => {
        // First, do semantic search to get context
        const queryEmbedding = await generateEmbedding(input.query);

        const meetings = await query(
          `SELECT m.id, m.title, m.meeting_date, COALESCE(ms.summary, '') as summary
           FROM meetings m
           LEFT JOIN meeting_summaries ms ON m.id = ms.meeting_id
           INNER JOIN meeting_search_index msi ON m.id = msi.meeting_id
           WHERE 1 - (msi.content_embedding <=> $1) > 0.6
           ORDER BY msi.content_embedding <=> $1
           LIMIT 3`,
          [queryEmbedding]
        );

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
        query('SELECT COUNT(*) as count FROM meetings'),
        query('SELECT COUNT(*) as count FROM meeting_summaries'),
      ]);

      return {
        totalMeetings: meetingsResult[0]?.count || 0,
        summarizedMeetings: summaryResult[0]?.count || 0,
      };
    }),
  }),
});

export type AppRouter = typeof appRouter;
