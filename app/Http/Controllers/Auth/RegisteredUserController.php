<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255',
            'bbb_server' => 'required|string|url|max:255',
            'bbb_secret' => 'required|string|min:8|max:255',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Check for existing user with same email and bbb_server combination
        $existingUser = User::where('email', $request->email)
            ->where('bbb_server', $request->bbb_server)
            ->exists();

        if ($existingUser) {
            return back()->withErrors([
                'email' => 'A user with this email already exists for the specified BBB server.',
            ]);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'bbb_server' => rtrim($request->bbb_server, '/'), // Remove trailing slash if any
            'bbb_secret' => $request->bbb_secret,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard', absolute: false));
    }
}
