import ApplicationLogo from "@/Components/ApplicationLogo";
import { Head } from '@inertiajs/react';
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import {
    HomeIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    Squares2X2Icon,
    ChartBarIcon,
    DocumentTextIcon,
    UsersIcon,
    XMarkIcon,
    Bars3Icon,
} from "@heroicons/react/24/outline";

const navigation = [
    {
        name: "Dashboard",
        href: route("dashboard"),
        icon: Squares2X2Icon,
        current: route().current("dashboard"),
    },
    {
        name: "Hooks",
        href: route("hooks.index"),
        icon: DocumentTextIcon,
        current: route().current("hooks.*"),
    },
    {
        name: "Events",
        href: route("events.index"),
        icon: ChartBarIcon,
        current: route().current("events.*"),
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentPath, setCurrentPath] = useState(window.location.pathname);

    // Update current path when route changes
    useEffect(() => {
        const handleRouteChange = () => {
            setCurrentPath(window.location.pathname);
        };

        window.addEventListener("popstate", handleRouteChange);
        return () => {
            window.removeEventListener("popstate", handleRouteChange);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile sidebar */}
            <div
                className={`fixed inset-0 z-40 lg:hidden ${
                    sidebarOpen ? "block" : "hidden"
                }`}
            >
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75"
                    onClick={() => setSidebarOpen(false)}
                ></div>
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white">
                    <div className="flex h-16 flex-shrink-0 items-center px-4 bg-indigo-600">
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo className="h-8 w-auto text-white" />
                            <span className="ml-2 text-xl font-bold text-white">
                                Your App
                            </span>
                        </Link>
                        <button
                            type="button"
                            className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="flex flex-1 flex-col overflow-y-auto">
                        <nav className="flex-1 space-y-1 px-2 py-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        currentPath === item.href
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                        "group flex items-center rounded-md px-3 py-3 text-sm font-medium"
                                    )}
                                >
                                    <item.icon
                                        className={classNames(
                                            currentPath === item.href
                                                ? "text-indigo-600"
                                                : "text-gray-400 group-hover:text-gray-500",
                                            "mr-3 h-6 w-6 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                        <div className="group block w-full flex-shrink-0">
                            <div className="flex items-center">
                                <div>
                                    <UserCircleIcon
                                        className="h-10 w-10 text-gray-400"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                                        {user.name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                    <div className="flex flex-1 flex-col overflow-y-auto">
                        <div className="flex h-16 flex-shrink-0 items-center px-4 bg-indigo-600">
                            <Link href="/" className="flex items-center">
                                <img
                                    className="h-8 w-auto"
                                    src="/images/bbb-logo.svg"
                                    alt="BBB Admin"
                                />
                                <span className="ml-2 text-xl font-bold text-white">
                                    BBB-Admin
                                </span>
                            </Link>
                        </div>
                        <nav className="flex-1 space-y-1 bg-white px-2 py-4">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={classNames(
                                        currentPath === item.href
                                            ? "bg-indigo-50 text-indigo-700"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                                        "group flex items-center rounded-md px-3 py-3 text-sm font-medium"
                                    )}
                                >
                                    <item.icon
                                        className={classNames(
                                            currentPath === item.href
                                                ? "text-indigo-600"
                                                : "text-gray-400 group-hover:text-gray-500",
                                            "mr-3 h-6 w-6 flex-shrink-0"
                                        )}
                                        aria-hidden="true"
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                        <div className="group block w-full flex-shrink-0">
                            <div className="flex items-center">
                                <div className="flex-shrink-0">
                                    <img
                                        className="h-8 w-auto"
                                        src="/images/bbb-logo.svg"
                                        alt="BBB Admin"
                                    />
                                </div>
                                <div className="ml-3 text-white text-xl font-semibold">
                                    BBB-Admin
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:pl-64">
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
                    <button
                        type="button"
                        className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1">
                            {header && (
                                <h1 className="text-xl font-semibold text-gray-900 my-auto">
                                    {header}
                                </h1>
                            )}
                        </div>
                        <div className="ml-4 flex items-center lg:ml-6">
                            {/* Profile dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        id="user-menu-button"
                                        aria-expanded="false"
                                        aria-haspopup="true"
                                    >
                                        <span className="sr-only">
                                            Open user menu
                                        </span>
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                            <UserCircleIcon className="h-6 w-6 text-indigo-600" />
                                        </div>
                                        <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline">
                                            {user.name}
                                        </span>
                                        <svg
                                            className="ml-1 h-5 w-5 text-gray-400 hidden md:block"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                            aria-hidden="true"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content width="48">
                                    <Dropdown.Link
                                        href={route("logout")}
                                        method="post"
                                        as="button"
                                        className="group flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
