import { Head, Link } from '@inertiajs/react';
import { ArrowLeftIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ hook }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleString();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('hooks.index')}
                            className="mr-4 text-gray-500 hover:text-gray-700"
                        >
                            <ArrowLeftIcon className="h-5 w-5" />
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Webhook Details
                        </h2>
                    </div>
                    <div className="flex space-x-2">
                        <Link
                            href={route('hooks.edit', hook.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <PencilIcon className="h-3 w-3 mr-1" />
                            Edit
                        </Link>
                        <Link
                            href={route('hooks.destroy', hook.id)}
                            method="delete"
                            as="button"
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            onBefore={() => confirm('Are you sure you want to delete this webhook?')}
                        >
                            <TrashIcon className="h-3 w-3 mr-1" />
                            Delete
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Webhook - ${hook.id}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Webhook Information
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Details about this webhook configuration.
                                    </p>
                                </div>
                                <div className="border-t border-gray-200">
                                    <dl>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Status
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    hook.is_active 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {hook.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Event Type
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {hook.event_type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Callback URL
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 break-all sm:mt-0 sm:col-span-2">
                                                <a 
                                                    href={hook.callback_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    {hook.callback_url}
                                                </a>
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Meeting ID
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {hook.meeting_id || 'All Meetings'}
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Webhook ID
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 font-mono sm:mt-0 sm:col-span-2">
                                                {hook.hook_id || 'N/A'}
                                            </dd>
                                        </div>
                                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Created At
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {formatDate(hook.created_at)}
                                            </dd>
                                        </div>
                                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Last Updated
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                {formatDate(hook.updated_at)}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            {hook.metadata && (
                                <div className="mt-8">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                                        Metadata
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-md overflow-auto">
                                        <pre className="text-sm text-gray-800">
                                            {JSON.stringify(hook.metadata, null, 2)}
                                        </pre>
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
