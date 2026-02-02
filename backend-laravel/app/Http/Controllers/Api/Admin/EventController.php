<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Event::orderBy('published_at', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'date' => 'required|string',
            'time' => 'required|string',
            'location' => 'required|string',
            'type' => 'required|string',
            'capacity' => 'nullable|string',
            'registrationUrl' => 'nullable|string',
        ]);

        $event = Event::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'location' => $validated['location'],
            'type' => $validated['type'],
            'capacity' => $validated['capacity'],
            'registration_url' => $validated['registrationUrl'],
            'published_at' => now(),
        ]);

        return response()->json($event, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Event::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'date' => 'sometimes|string',
            'time' => 'sometimes|string',
            'location' => 'sometimes|string',
            'type' => 'sometimes|string',
            'capacity' => 'nullable|string',
            'registrationUrl' => 'nullable|string',
        ]);

        $updateData = [];
        // Map fields
        if (isset($validated['title']))
            $updateData['title'] = $validated['title'];
        if (isset($validated['description']))
            $updateData['description'] = $validated['description'];
        if (isset($validated['date']))
            $updateData['date'] = $validated['date'];
        if (isset($validated['time']))
            $updateData['time'] = $validated['time'];
        if (isset($validated['location']))
            $updateData['location'] = $validated['location'];
        if (isset($validated['type']))
            $updateData['type'] = $validated['type'];
        if (isset($validated['capacity']))
            $updateData['capacity'] = $validated['capacity'];
        if (isset($validated['registrationUrl']))
            $updateData['registration_url'] = $validated['registrationUrl'];

        $event->update($updateData);

        return response()->json($event);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json(null, 204);
    }
}
