import { useState } from 'react';

interface Props {
    onSubmit: (question: string) => void;
    loading: boolean;
}

function QueryInput({ onSubmit, loading }: Props) {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!question.trim()) return;
        onSubmit(question);
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2">
            <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about your data..."
                className="flex-1 bg-bg-surface border border-border rounded-lg px-4 py-3 text-text-primary focus:outline-none focus:border-accent"
            />
            <button
                type="submit"
                disabled={loading}
                className="bg-accent text-bg-base font-medium rounded-lg px-6 py-3 hover:bg-accent-dim transition-colors disabled:opacity-50 whitespace-nowrap"
            >
                {loading ? 'Thinking...' : 'Ask'}
            </button>
        </form>
    );
}

export default QueryInput;