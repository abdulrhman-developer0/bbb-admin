import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ eventTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        callback_url: '',
        meeting_id: '',
        event_type: 'meeting-created',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('hooks.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    <Link
                        href={route('hooks.index')}
                        className="mr-4 text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Create New Webhook
                    </h2>
                </div>
            }
        >
            <Head title="Create Webhook" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit} className="space-y-6">
                                <div>
                                    <label htmlFor="event_type" className="block text-sm font-medium text-gray-700">
                                        Event Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="event_type"
                                        name="event_type"
                                        value={data.event_type}
                                        onChange={(e) => setData('event_type', e.target.value)}
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                    >
                                        {Object.entries(eventTypes).map(([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.event_type && (
                                        <p className="mt-1 text-sm text-red-600">{errors.event_type}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="callback_url" className="block text-sm font-medium text-gray-700">
                                        Callback URL <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="url"
                                            id="callback_url"
                                            name="callback_url"
                                            value={data.callback_url}
                                            onChange={(e) => setData('callback_url', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="https://example.com/webhook"
                                        />
                                        {errors.callback_url && (
                                            <p className="mt-1 text-sm text-red-600">{errors.callback_url}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="meeting_id" className="block text-sm font-medium text-gray-700">
                                        Meeting ID (leave empty for all meetings)
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            id="meeting_id"
                                            name="meeting_id"
                                            value={data.meeting_id}
                                            onChange={(e) => setData('meeting_id', e.target.value)}
                                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                                            placeholder="meeting-123"
                                        />
                                        {errors.meeting_id && (
                                            <p className="mt-1 text-sm text-red-600">{errors.meeting_id}</p>
                                        )}
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        If specified, this webhook will only trigger for the specified meeting ID.
                                    </p>
                                </div>

                                <div className="pt-5">
                                    <div className="flex justify-end">
                                        <Link
                                            href={route('hooks.index')}
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Cancel
                                        </Link>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                                        >
                                            {processing ? 'Creating...' : 'Create Webhook'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
