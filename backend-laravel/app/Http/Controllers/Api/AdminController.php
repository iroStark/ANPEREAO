<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Member;
use App\Models\Report;
use App\Models\ContactMessage;

class AdminController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => 'required', // Laravel uses 'email' by default usually, but we can customize
            'password' => 'required',
        ]);

        // Attempt login using 'username' column instead of email if your DB uses username
        // Adjust 'username' to 'email' if you prefer email login
        if (Auth::attempt(['username' => $credentials['username'], 'password' => $credentials['password']])) {
            $user = Auth::user();

            /** @var \App\Models\User $user */
            $token = $user->createToken('admin-token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'user' => $user
            ]);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()]);
    }

    public function getStats()
    {
        return response()->json([
            'members' => Member::count(),
            'reports' => Report::count(),
            'messages' => ContactMessage::count(),
        ]);
    }
}
