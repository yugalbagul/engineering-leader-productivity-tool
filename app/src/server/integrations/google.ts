import { execSync } from 'child_process';
import { Meeting } from '../db';

/**
 * Execute gog CLI command
 */
function runGogCommand(command: string): string {
  try {
    const output = execSync(command, {
      cwd: process.cwd(),
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });
    return output;
  } catch (error: any) {
    console.error(`Error running gog command: ${command}`, error.message);
    return '';
  }
}

/**
 * Fetch calendar events from Google Calendar using gog CLI
 */
export async function fetchCalendarEvents(daysBack: number = 7): Promise<any[]> {
  try {
    // Use gog calendar events command
    const output = runGogCommand('gog calendar events --days ' + daysBack);

    // Parse the output (this will depend on the actual format from gog CLI)
    // For now, we'll assume it returns JSON
    try {
      const events = JSON.parse(output);
      return events || [];
    } catch {
      // If not JSON, we'll need to parse text format
      // For now, return empty array and implement proper parsing later
      console.log('Calendar output is not JSON, needs custom parsing');
      return [];
    }
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return [];
  }
}

/**
 * Fetch meeting notes from Google Drive using gog CLI
 */
export async function fetchMeetingNotes(meetingTitle: string, attendees: string[]): Promise<string | null> {
  try {
    // Search for documents related to the meeting
    const keywords = [meetingTitle, ...attendees].slice(0, 2).join(' ');
    const output = runGogCommand(`gog drive search "${keywords}" --limit 5`);

    try {
      const results = JSON.parse(output);
      if (results && results.length > 0) {
        // Return the first document's content
        // We'll need to implement proper content extraction
        const docId = results[0].id;
        const content = runGogCommand(`gog drive get ${docId}`);
        return content;
      }
    } catch {
      console.log('Drive search output is not JSON');
    }

    return null;
  } catch (error) {
    console.error('Error fetching meeting notes:', error);
    return null;
  }
}

/**
 * Convert calendar event to meeting format
 */
export function eventToMeeting(event: any): Partial<Meeting> {
  return {
    title: event.summary || event.title || 'Untitled Meeting',
    description: event.description || null,
    meeting_date: event.start?.dateTime || event.start?.date || new Date().toISOString(),
    duration_minutes: event.end && event.start
      ? Math.round((new Date(event.end).getTime() - new Date(event.start).getTime()) / 60000)
      : null,
    attendees: event.attendees?.map((a: any) => a.email || a.displayName) || [],
    source_calendar_id: event.calendarId || null,
    source_event_id: event.id || null,
  };
}
