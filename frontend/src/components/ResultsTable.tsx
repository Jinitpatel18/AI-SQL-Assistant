interface Props {
    rows: Record<string, any>[];
    rowCount: number;
    truncated: boolean;
}

function ResultsTable({ rows, rowCount, truncated }: Props) {
    if (rows.length === 0) {
        return (
            <div className="text-text-muted text-sm text-center py-8">
                No rows returned.
            </div>
        );
    }

    const columns = Object.keys(rows[0]);

    return (
        <div>
            <div className="overflow-x-auto border border-border rounded-lg">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-bg-surface-hover">
                            {columns.map((col) => (
                                <th
                                    key={col}
                                    className="text-left px-4 py-2 font-mono text-text-muted uppercase text-xs tracking-wide border-b border-border"
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr
                                key={idx}
                                className="border-b border-border last:border-0 hover:bg-bg-surface-hover"
                            >
                                {columns.map((col) => (
                                    <td key={col} className="px-4 py-2 text-text-primary">
                                        {String(row[col])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="text-xs text-text-muted mt-2 font-mono">
                {rowCount} row{rowCount !== 1 ? 's' : ''}
                {truncated ? ' (truncated to 100)' : ''}
            </p>
        </div>
    );
}

export default ResultsTable;