import type { HistoryItem } from '../types';

interface Props {
    history: HistoryItem[];
    onSelect: (item: HistoryItem) => void;
}

function HistorySidebar({ history, onSelect }: Props) {
    return (
        <div className="w-72 border-l border-border h-full overflow-y-auto">
            <p className="text-xs text-text-muted uppercase tracking-wide font-mono px-4 py-3 border-b border-border">
                History
            </p>
            {history.length === 0 ? (
                <p className="text-text-muted text-sm px-4 py-3">No queries yet.</p>
            ) : (
                <div>
                    {history.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item)}
                            className="w-full text-left px-4 py-3 border-b border-border hover:bg-bg-surface-hover transition-colors"
                        >
                            <p className="text-sm text-text-primary line-clamp-2">
                                {item.question}
                            </p>
                            <p className="text-xs text-text-muted mt-1 font-mono">
                                {new Date(item.createdAt).toLocaleString()}
                            </p>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default HistorySidebar;