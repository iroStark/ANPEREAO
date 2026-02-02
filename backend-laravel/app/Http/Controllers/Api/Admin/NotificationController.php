<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $notifications = $request->user()->notifications()
            ->orderBy('created_at', 'desc')
            ->take(50) // Limit to last 50 notifications
            ->get();

        return response()->json($notifications);
    }

    /**
     * Get the count of unread notifications.
     */
    public function unreadCount(Request $request)
    {
        $count = $request->user()->notifications()->where('read', false)->count();
        return response()->json(['count' => $count]);
    }

    /**
     * Mark notifications as read.
     */
    public function markRead(Request $request)
    {
        $user = $request->user();

        if ($request->has('id')) {
            // Mark specific notification as read
            $notification = $user->notifications()->where('id', $request->id)->first();
            if ($notification) {
                $notification->update(['read' => true]);
            }
        } else {
            // Mark all as read
            $user->notifications()->where('read', false)->update(['read' => true]);
        }

        return response()->json(['success' => true]);
    }
}
