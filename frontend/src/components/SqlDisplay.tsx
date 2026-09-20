interface Props {
    sql: string;
}

function SqlDisplay({ sql }: Props) {
    return (
        <div className="bg-bg-base border border-border rounded-lg p-4">
            <p className="text-xs text-text-muted mb-2 font-mono uppercase tracking-wide">
                Generated SQL
            </p>
            <pre className="font-mono text-sm text-accent overflow-x-auto whitespace-pre-wrap">
                {sql}
            </pre>
        </div>
    );
}

export default SqlDisplay;