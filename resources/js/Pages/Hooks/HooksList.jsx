import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function HooksList() {
    const [hooks, setHooks] = useState([]);

    useEffect(() => {
        // Fetch hooks from the server
        fetch('/api/hooks')
            .then(response => response.json())
            .then(data => setHooks(data.hooks));
    }, []);

    return (
        <div>
            <Head title="Hooks List" />

            <h1 className="text-2xl font-bold">Hooks List</h1>

            <Link href="/hooks/create" className="text-blue-500">Create New Hook</Link>

            <ul>
                {hooks.map(hook => (
                    <li key={hook.id} className="border-b py-2">
                        <Link href={`/hooks/${hook.id}/edit`} className="text-blue-500">
                            {hook.event_type}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
