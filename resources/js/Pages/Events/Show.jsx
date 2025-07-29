import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ event }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center">
                    <Link
                        href={route('events.index')}
                        className="mr-4 text-gray-500 hover:text-gray-700"
                    >
                        <ArrowLeftIcon className="h-5 w-5" />
                    </Link>
                    <h2 className="text-xl font-semibold text-gray-800">
                        Event Details
                    </h2>
                </div>
            }
        >
            <Head title={`Event #${event.id}`} />

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white border-b border-gray-200">
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-gray-900">
                                Event Type: {event.event_type || 'N/A'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Created at: {event.created_at}
                            </p>
                        </div>

                        <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-700 mb-2">
                                Payload:
                            </h4>
                            <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
                                {JSON.stringify(event.payload, null, 2)}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
