import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';
import { ListPlus, History, Clock, CheckCircle2 } from 'lucide-react';

interface TopicSidebarProps {
  roomId: Id<'rooms'>;
  facilitatorId: string;
  identityId: string;
}

export function TopicSidebar({
  roomId,
  facilitatorId,
  identityId,
}: TopicSidebarProps) {
  const topics = useQuery(api.topics.listByRoom, { roomId });
  const isFacilitator = facilitatorId === identityId;

  const pendingTopics =
    topics?.filter((t) => t.status === 'pending' || t.status === 'active') ||
    [];
  const completedTopics = topics?.filter((t) => t.status === 'completed') || [];

  return (
    <aside className="w-80 flex flex-col h-full border-l border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-[var(--bg-secondary)] z-10">
        <div className="flex items-center gap-2">
          <ListPlus className="w-5 h-5 text-[var(--text-secondary)]" />
          <h2 className="font-semibold text-[var(--text-primary)]">
            Topic Queue
          </h2>
        </div>
        {isFacilitator && (
          <button
            className="p-1.5 rounded-sm bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors"
            aria-label="Add Topic"
          >
            <ListPlus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Pending Topics */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[var(--text-tertiary)]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              Pending
            </h3>
          </div>
          <div className="space-y-2">
            {pendingTopics.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] italic py-2">
                No topics in queue
              </p>
            ) : (
              pendingTopics
                .sort((a, b) => a.order - b.order)
                .map((topic) => (
                  <div
                    key={topic._id}
                    className={`p-3 rounded-md border flex items-center gap-3 transition-all ${
                      topic.status === 'active'
                        ? 'border-[var(--accent)] bg-[var(--bg-tertiary)] shadow-[var(--shadow-sm)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-primary)]'
                    }`}
                  >
                    <span
                      className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                        topic.status === 'active'
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                      }`}
                    >
                      {topic.order}
                    </span>
                    <span
                      className={`text-sm flex-1 truncate ${
                        topic.status === 'active'
                          ? 'text-[var(--text-primary)] font-medium'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {topic.title}
                    </span>
                    {topic.status === 'active' && (
                      <div className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
                    )}
                  </div>
                ))
            )}
          </div>
        </section>

        {/* History */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-[var(--text-tertiary)]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-tertiary)]">
              History
            </h3>
          </div>
          <div className="space-y-2">
            {completedTopics.length === 0 ? (
              <p className="text-sm text-[var(--text-tertiary)] italic py-2">
                Empty history
              </p>
            ) : (
              completedTopics
                .sort((a, b) => b.order - a.order)
                .map((topic) => (
                  <div
                    key={topic._id}
                    className="p-3 rounded-md border border-transparent bg-[var(--bg-primary)] opacity-80 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                    <span className="text-sm text-[var(--text-secondary)] flex-1 truncate">
                      {topic.title}
                    </span>
                    {topic.finalEstimate && (
                      <span className="text-sm font-mono font-bold text-[var(--accent)]">
                        {topic.finalEstimate}
                      </span>
                    )}
                  </div>
                ))
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
