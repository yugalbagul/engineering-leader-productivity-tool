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
      // We'll display results in a modal or separate section
    },
  });

  // Calendar sync
  const syncMutation = trpc.ingestion.syncCalendar.useMutation({
    onSuccess: (data) => {
      alert(`Synced ${data.synced} meetings`);
      window.location.reload();
    },
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setShowResults(true);
    searchMutation.mutate({ query: searchQuery });
  };

  const handleSync = () => {
    syncMutation.mutate({ daysBack: 7 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            🚀 Engineering Leader Tool
          </h1>
          <button
            onClick={handleSync}
            disabled={syncMutation.isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {syncMutation.isPending ? 'Syncing...' : 'Sync Calendar'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Total Meetings
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats?.totalMeetings || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Summarized
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats?.summarizedMeetings || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">
              Coverage
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats?.totalMeetings
                ? Math.round((stats.summarizedMeetings / stats.totalMeetings) * 100)
                : 0}%
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm border mb-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            🔍 Search Your Meetings
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="What did I decide about X? Show me action items from meeting with Vivek..."
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            />
            <button
              onClick={handleSearch}
              disabled={searchMutation.isPending || !searchQuery.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {searchMutation.isPending ? 'Searching...' : 'Search'}
            </button>
          </div>

          {showResults && searchMutation.data && (
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <h3 className="font-medium text-slate-900 dark:text-white mb-2">Answer:</h3>
              <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                {searchMutation.data.answer}
              </p>
              {searchMutation.data.sources && searchMutation.data.sources.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">Sources:</h4>
                  <ul className="space-y-2">
                    {searchMutation.data.sources.map((source: any) => (
                      <li key={source.id} className="text-sm text-slate-600 dark:text-slate-400">
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
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              📅 Recent Meetings
            </h2>
          </div>

          {isLoading ? (
            <div className="p-6 text-center text-slate-600 dark:text-slate-400">
              Loading meetings...
            </div>
          ) : !meetings || meetings.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                No meetings yet. Sync your calendar to get started.
              </p>
              <button
                onClick={handleSync}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Sync Calendar Now
              </button>
            </div>
          ) : (
            <div className="divide-y dark:divide-slate-700">
              {meetings.map((meeting: any) => (
                <div key={meeting.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                      {meeting.title}
                    </h3>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(meeting.meeting_date).toLocaleDateString()}
                    </span>
                  </div>

                  {meeting.description && (
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3 line-clamp-2">
                      {meeting.description}
                    </p>
                  )}

                  {meeting.meeting_summaries && meeting.meeting_summaries.length > 0 ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                        AI Summary
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200 line-clamp-3">
                        {meeting.meeting_summaries[0].summary}
                      </p>
                      {meeting.meeting_summaries[0].action_items && meeting.meeting_summaries[0].action_items.length > 0 && (
                        <div className="mt-3">
                          <h5 className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">
                            Action Items:
                          </h5>
                          <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                            {meeting.meeting_summaries[0].action_items.slice(0, 3).map((item: any, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-500">•</span>
                                <span>{item.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500 dark:text-slate-500 italic">
                      No summary yet
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
