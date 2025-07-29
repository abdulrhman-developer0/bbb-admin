import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function CreateHook() {
    const { data, setData, post, processing, errors } = useForm({
        callback_url: '',
        meeting_id: '',
        event_type: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/api/hooks');
    };

    return (
        <div>
            <Head title="Create Hook" />

            <h1 className="text-2xl font-bold">Create New Hook</h1>

            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label htmlFor="callback_url" className="block">Callback URL</label>
                    <input
                        type="url"
                        id="callback_url"
                        value={data.callback_url}
                        onChange={e => setData('callback_url', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.callback_url && <div className="text-red-500">{errors.callback_url}</div>}
                </div>

                <div>
                    <label htmlFor="meeting_id" className="block">Meeting ID</label>
                    <input
                        type="text"
                        id="meeting_id"
                        value={data.meeting_id}
                        onChange={e => setData('meeting_id', e.target.value)}
                        className="mt-1 block w-full"
                    />
                    {errors.meeting_id && <div className="text-red-500">{errors.meeting_id}</div>}
                </div>

                <div>
                    <label htmlFor="event_type" className="block">Event Type</label>
                    <select
                        id="event_type"
                        value={data.event_type}
                        onChange={e => setData('event_type', e.target.value)}
                        className="mt-1 block w-full"
                    >
                        <option value="">Select an event type</option>
                        <option value="meeting-created">Meeting Created</option>
                        <option value="meeting-ended">Meeting Ended</option>
                        <option value="user-joined">User Joined</option>
                        <option value="user-left">User Left</option>
                        <option value="presentation-uploaded">Presentation Uploaded</option>
                        <option value="recording-ready">Recording Ready</option>
                    </select>
                    {errors.event_type && <div className="text-red-500">{errors.event_type}</div>}
                </div>

                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded" disabled={processing}>
                    Create Hook
                </button>
            </form>
        </div>
    );
}
