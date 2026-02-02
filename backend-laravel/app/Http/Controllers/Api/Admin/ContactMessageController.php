<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactMessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ContactMessage::orderBy('created_at', 'desc')->get();
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $message = ContactMessage::findOrFail($id);

        // Mark as read when viewed if not already
        if ($message->status === 'unread') {
            $message->status = 'read';
            $message->save();
        }

        return $message;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $message = ContactMessage::findOrFail($id);

        // Accept 'read' boolean from frontend, map to status
        $validated = $request->validate([
            'read' => 'sometimes|boolean',
            'status' => 'sometimes|in:read,unread'
        ]);

        if (isset($validated['read'])) {
            $message->status = $validated['read'] ? 'read' : 'unread';
        }

        if (isset($validated['status'])) {
            $message->status = $validated['status'];
        }

        $message->save();

        return response()->json($message);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $message = ContactMessage::findOrFail($id);
        $message->delete();
        return response()->json(null, 204);
    }
}
