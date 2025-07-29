import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
            onError: (errors) => {
                console.error("Login errors:", errors);
            },
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form
                onSubmit={submit}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-4">
                    <InputLabel
                        htmlFor="email"
                        value="Username"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="email@example.com"
                        autoComplete="email"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError
                        message={errors.email}
                        className="text-red-500 text-xs italic mt-2"
                    />
                </div>

                <div className="mb-6">
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="block text-gray-700 text-sm font-bold mb-2"
                    />

                    <TextInput
                        id="password"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={data.password}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError
                        message={errors.password}
                        className="text-red-500 text-xs italic mt-2"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <PrimaryButton
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        disabled={processing}
                    >
                        Connect to BBB Server
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
