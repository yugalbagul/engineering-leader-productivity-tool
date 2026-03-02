'use client';

import { trpc } from '@/lib/trpc';
import { useState } from 'react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Fetch meetings
  const { data: meetings, isLoading } = trpc.meetings.list.useQuery(
    { limit: 20 },
    { enabled: !showResults }
  );

  // Fetch stats
  const { data: stats } = trpc.stats.overview.useQuery();

  // Natural language search
  const searchMutation = trpc.search.naturalLanguage.useMutation({
    onSuccess: (data) => {
      console.log('Search results:', data);
    },
  });

  // Calendar sync
  const syncMutation = trpc.ingestion.syncCalendar.useMutation({
    onSuccess: (data) => {
      alert(`Synced ${data.synced} meetings`);
      window.location.reload();
    },
    onError: (error) => {
      console.error('Sync error:', error);
      alert('Failed to sync calendar. Check console for details.');
    },
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setShowResults(true);
    searchMutation.mutate({ query: searchQuery });
  };

  const handleSync = () => {
    console.log('Syncing calendar...');
    syncMutation.mutate({ daysBack: 7 });
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        color: '#475569',
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #f8fafc, #e2e8f0)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid #e2e8f0',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ height: '4rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
            🚀 Engineering Leader Tool
          </h1>
          <button
            onClick={handleSync}
            disabled={syncMutation.isPending}
            style={{
              padding: '0.5rem 1rem',
              background: '#2563eb',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: syncMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: syncMutation.isPending ? 0.5 : 1,
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {syncMutation.isPending ? 'Syncing...' : 'Sync Calendar'}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 0' }}>
        {/* Stats */}
        <div style={{ marginBottom: '2rem', display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.25rem' }}>
              Total Meetings
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#0f172a' }}>
              {stats?.totalMeetings || 0}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.25rem' }}>
              Summarized
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#2563eb' }}>
              {stats?.summarizedMeetings || 0}
            </div>
          </div>
          <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.25rem' }}>
              Coverage
            </div>
            <div style={{ fontSize: '1.875rem', fontWeight: 700, color: '#16a34a' }}>
              {stats?.totalMeetings
                ? Math.round((stats.summarizedMeetings / stats.totalMeetings) * 100)
                : 0}%
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ background: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', marginBottom: '1rem' }}>
            🔍 Search Your Meetings
          </h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="What did I decide about X? Show me action items from meeting with Vivek..."
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem',
                fontSize: '1rem',
              }}
            />
            <button
              onClick={handleSearch}
              disabled={searchMutation.isPending || !searchQuery.trim()}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#2563eb',
                color: 'white',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: (searchMutation.isPending || !searchQuery.trim()) ? 'not-allowed' : 'pointer',
                opacity: (searchMutation.isPending || !searchQuery.trim()) ? 0.5 : 1,
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              {searchMutation.isPending ? 'Searching...' : 'Search'}
            </button>
          </div>

          {showResults && searchMutation.data && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem' }}>
              <h3 style={{ fontWeight: 500, color: '#0f172a', marginBottom: '0.5rem' }}>Answer:</h3>
              <p style={{ color: '#334155', whiteSpace: 'pre-wrap' }}>
                {searchMutation.data.answer}
              </p>
              {searchMutation.data.sources && searchMutation.data.sources.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <h4 style={{ fontWeight: 500, color: '#0f172a', marginBottom: '0.5rem' }}>Sources:</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {searchMutation.data.sources.map((source: any) => (
                      <li key={source.id} style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '0.25rem' }}>
                        {source.title} - {new Date(source.meeting_date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Meetings List */}
        <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0' }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
              📅 Recent Meetings
            </h2>
          </div>

          {!meetings || meetings.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ color: '#475569', marginBottom: '1rem' }}>
                No meetings yet. Sync your calendar to get started.
              </p>
              <button
                onClick={handleSync}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#2563eb',
                  color: 'white',
                  borderRadius: '0.5rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Sync Calendar Now
              </button>
            </div>
          ) : (
            meetings.map((meeting: any) => (
              <div key={meeting.id} style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 500, color: '#0f172a', margin: 0 }}>
                    {meeting.title}
                  </h3>
                  <span style={{ fontSize: '0.875rem', color: '#475569' }}>
                    {new Date(meeting.meeting_date).toLocaleDateString()}
                  </span>
                </div>

                {meeting.description && (
                  <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    {meeting.description}
                  </p>
                )}

                {meeting.meeting_summaries && meeting.meeting_summaries.length > 0 ? (
                  <div style={{ background: '#eff6ff', borderRadius: '0.5rem', padding: '1rem', marginTop: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1d4ed8', marginBottom: '0.5rem' }}>
                      AI Summary
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#1e40af', marginBottom: '0.5rem' }}>
                      {meeting.meeting_summaries[0].summary}
                    </p>
                    {meeting.meeting_summaries[0].action_items && meeting.meeting_summaries[0].action_items.length > 0 && (
                      <div>
                        <h5 style={{ fontSize: '0.75rem', fontWeight: 500, color: '#1d4ed8', marginBottom: '0.25rem' }}>
                          Action Items:
                        </h5>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.75rem', color: '#1e40af' }}>
                          {meeting.meeting_summaries[0].action_items.slice(0, 3).map((item: any, idx: number) => (
                            <li key={idx} style={{ marginBottom: '0.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                              <span>•</span>
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    No summary yet
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
