import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { askQuestionApi } from '../api/queryApi';
import { getHistoryApi } from '../api/historyApi';
import QueryInput from '../components/QueryInput';
import SqlDisplay from '../components/SqlDisplay';
import ResultsTable from '../components/ResultsTable';
import HistorySidebar from '../components/HistorySidebar';
import type { QueryResponse, HistoryItem } from '../types';

function Dashboard() {
    const { user, logout } = useAuth();
    const [currentResult, setCurrentResult] = useState<QueryResponse | null>(null);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loadHistory = async () => {
        try {
            const res = await getHistoryApi();
            setHistory(res.data);
        } catch (err) {
            console.error('Failed to load history');
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const handleAsk = async (question: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await askQuestionApi(question);
            setCurrentResult(res.data);
            loadHistory(); // Naya history refresh karo
        } catch (err: any) {
            setError(err.response?.data?.error || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleHistorySelect = (item: HistoryItem) => {
        setCurrentResult({
            question: item.question,
            generatedSql: item.generatedSql,
            result: item.result,
        });
    };

    return (
        <div className="min-h-screen bg-bg-base flex flex-col">
            {/* Top bar */}
            <div className="border-b border-border px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-lg font-semibold text-text-primary">
                        AI SQL Assistant
                    </h1>
                    <p className="text-xs text-text-muted font-mono">
                        {user?.name} · {user?.email}
                    </p>
                </div>
                <button
                    onClick={logout}
                    className="text-sm text-text-muted hover:text-danger transition-colors"
                >
                    Log out
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Main workspace */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <QueryInput onSubmit={handleAsk} loading={loading} />

                        {error && (
                            <div className="text-danger text-sm bg-danger/10 border border-danger/30 rounded px-3 py-2">
                                {error}
                            </div>
                        )}

                        {currentResult && (
                            <div className="space-y-4">
                                <p className="text-text-primary">
                                    <span className="text-text-muted text-sm">Question:</span>{' '}
                                    {currentResult.question}
                                </p>
                                <SqlDisplay sql={currentResult.generatedSql} />
                                <ResultsTable
                                    rows={currentResult.result.rows}
                                    rowCount={currentResult.result.rowCount}
                                    truncated={currentResult.result.truncated}
                                />
                            </div>
                        )}

                        {!currentResult && !error && (
                            <div className="text-center py-16">
                                <p className="text-text-muted">
                                    Ask a question about your database in plain English.
                                </p>
                                <p className="text-text-muted text-sm font-mono mt-1">
                                    e.g. "Show me total order amount for each customer"
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* History sidebar */}
                <HistorySidebar history={history} onSelect={handleHistorySelect} />
            </div>
        </div>
    );
}

export default Dashboard;