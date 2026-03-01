import OpenAI from 'openai';

// Initialize OpenAI client (using ZAI API)
const apiKey = process.env.ZAI_API_KEY || '';

if (!apiKey) {
  throw new Error('Missing ZAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: 'https://api.zai.app/v1', // Using ZAI's OpenAI-compatible endpoint
});

export interface SummaryInput {
  title: string;
  attendees: string[];
  content: string;
}

export interface SummaryOutput {
  summary: string;
  key_topics: string[];
  action_items: Array<{
    text: string;
    assignee?: string;
    status: 'pending' | 'completed' | 'blocked';
  }>;
  decisions: string[];
}

/**
 * Generate a meeting summary using LLM
 */
export async function generateMeetingSummary(input: SummaryInput): Promise<SummaryOutput> {
  const systemPrompt = `You are an AI assistant that summarizes meetings for engineering leaders. Your task is to:
1. Create a concise summary (3-5 paragraphs) of the meeting
2. Extract key topics discussed
3. Identify action items with owners and status
4. List decisions made

Format your response as a JSON object with this structure:
{
  "summary": "concise summary",
  "key_topics": ["topic1", "topic2"],
  "action_items": [{"text": "item", "assignee": "name", "status": "pending"}],
  "decisions": ["decision1", "decision2"]
}`;

  const userPrompt = `Meeting Title: ${input.title}
Attendees: ${input.attendees.join(', ')}

Meeting Content:
${input.content}

Generate a summary of this meeting.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    const result = JSON.parse(content);

    return {
      summary: result.summary || 'No summary generated',
      key_topics: result.key_topics || [],
      action_items: result.action_items || [],
      decisions: result.decisions || [],
    };
  } catch (error) {
    console.error('Error generating meeting summary:', error);
    throw new Error('Failed to generate meeting summary');
  }
}

/**
 * Generate embeddings for semantic search
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0]?.embedding || [];
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Failed to generate embedding');
  }
}

/**
 * Process natural language query
 */
export async function processQuery(query: string, context: string): Promise<string> {
  const systemPrompt = `You are an AI assistant helping an engineering leader find information from their meeting notes.
Use the provided context to answer the question. If the answer is not in the context, say so.

Context:
${context}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || 'Unable to generate response';
  } catch (error) {
    console.error('Error processing query:', error);
    throw new Error('Failed to process query');
  }
}
