import React from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";

const EventItem = ({ event }) => {
    const [expanded, setExpanded] = useState(false);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-4">
            <div
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                onClick={() => setExpanded(!expanded)}
            >
                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        {event.event || "Unknown Event"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {formatDate(event.created_at)}
                    </p>
                </div>
                <svg
                    className={`w-5 h-5 text-gray-500 transform transition-transform ${
                        expanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
            {expanded && (
                <div className="p-4 border-t border-gray-200">
                    <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-96">
                        {JSON.stringify(event.payload, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default function EventsIndex({ events }) {
    const [polling, setPolling] = useState(false);
    const { url } = usePage();

    // Handle polling
    const togglePolling = () => {
        setPolling(!polling);
        if (!polling) {
            // If we're turning polling on, refresh immediately
            router.reload();
        }
    };

    // Set up polling effect
    React.useEffect(() => {
        if (!polling) return;

        const interval = setInterval(() => {
            router.reload({ only: ["events"] });
        }, 10000);

        return () => clearInterval(interval);
    }, [polling, url]);

    return (
        <AuthenticatedLayout>
            <Head title="BBB Events" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    BigBlueButton Events
                                </h2>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setPolling(!polling)}
                                        className={`px-4 py-2 text-sm font-medium rounded-md ${
                                            polling
                                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }`}
                                    >
                                        {polling ? "Live: ON" : "Live: OFF"}
                                    </button>
                                    <button
                                        onClick={() => fetchEvents(page)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {events.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">
                                        No events found.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4">
                                        {events.data.map((event) => (
                                            <EventItem
                                                key={event.id}
                                                event={event}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between mt-6">
                                        {events.prev_page_url ? (
                                            <Link
                                                href={events.prev_page_url}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-50"
                                            >
                                                Previous
                                            </Link>
                                        ) : (
                                            <span className="px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                                                Previous
                                            </span>
                                        )}

                                        <div className="text-sm text-gray-700">
                                            Page {events.current_page} of{" "}
                                            {events.last_page}
                                        </div>

                                        {events.next_page_url ? (
                                            <Link
                                                href={events.next_page_url}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 rounded-md hover:bg-blue-50"
                                            >
                                                Next
                                            </Link>
                                        ) : (
                                            <span className="px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
                                                Next
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
