import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';

export default function HookLogs({ hookId }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        // Fetch logs for the specific hook
        fetch(`/api/hooks/${hookId}/logs`)
            .then(response => response.json())
            .then(data => setLogs(data.logs));
    }, [hookId]);

    return (
        <div>
            <Head title="Hook Logs" />

            <h1 className="text-2xl font-bold">Hook Logs</h1>

            <ul>
                {logs.map(log => (
                    <li key={log.id} className="border-b py-2">
                        <div className="text-sm text-gray-600">{log.timestamp}</div>
                        <div className="text-sm">{log.payload}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
