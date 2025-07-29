import { Head, Link, router } from '@inertiajs/react';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ hooks, status }) {
    const handleDelete = (hook) => {
        if (confirm('Are you sure you want to delete this hook?')) {
            router.delete(route('hooks.destroy', hook.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Webhooks
                    </h2>
                    <Link
                        href={route('hooks.create')}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Hook
                    </Link>
                </div>
            }
        >
            <Head title="Webhooks" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {status && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-200 text-green-700 rounded">
                            {status}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {hooks.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Event Type
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Callback URL
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Meeting ID
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {hooks.data.map((hook) => (
                                                <tr key={hook.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {hook.event_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {hook.callback_url}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {hook.meeting_id || 'All Meetings'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${hook.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                            {hook.is_active ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link
                                                            href={route('hooks.edit', hook.id)}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                        >
                                                            <PencilIcon className="h-4 w-4 inline mr-1" />
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(hook)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            <TrashIcon className="h-4 w-4 inline mr-1" />
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    
                                    {/* Pagination */}
                                    {hooks.links.length > 3 && (
                                        <div className="px-6 py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-gray-700">
                                                    Showing <span className="font-medium">{hooks.from}</span> to{' '}
                                                    <span className="font-medium">{hooks.to}</span> of{' '}
                                                    <span className="font-medium">{hooks.total}</span> results
                                                </div>
                                                <div className="flex space-x-2">
                                                    {hooks.links.map((link, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => router.get(link.url || '#')}
                                                            className={`px-3 py-1 rounded-md ${
                                                                link.active
                                                                    ? 'bg-indigo-100 text-indigo-700'
                                                                    : 'text-gray-700 hover:bg-gray-100'
                                                            }`}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                            disabled={!link.url}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1}
                                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hooks</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Get started by creating a new webhook.
                                    </p>
                                    <div className="mt-6">
                                        <Link
                                            href={route('hooks.create')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                            New Hook
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
