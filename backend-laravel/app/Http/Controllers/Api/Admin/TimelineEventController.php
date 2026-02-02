<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\TimelineEvent;
use Illuminate\Http\Request;

class TimelineEventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TimelineEvent::orderBy('year', 'desc')->orderBy('order_index', 'asc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|string',
            'event' => 'required|string',
            'description' => 'required|string',
            'details' => 'nullable|string',
            'imageUrl' => 'nullable|string',
            'order' => 'integer',
            'isActive' => 'boolean',
        ]);

        $data = [
            'year' => $validated['year'],
            'event' => $validated['event'],
            'description' => $validated['description'],
            'details' => $validated['details'] ?? null,
            'image_url' => $validated['imageUrl'] ?? null,
            'order_index' => $validated['order'] ?? 0,
            'is_active' => $request->input('isActive', true),
        ];

        $timelineEvent = TimelineEvent::create($data);

        return response()->json($timelineEvent, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return TimelineEvent::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $timelineEvent = TimelineEvent::findOrFail($id);

        $validated = $request->validate([
            'year' => 'sometimes|string',
            'event' => 'sometimes|string',
            'description' => 'sometimes|string',
            'details' => 'nullable|string',
            'imageUrl' => 'nullable|string',
            'order' => 'integer',
            'isActive' => 'boolean',
        ]);

        $data = [];
        if (isset($validated['year']))
            $data['year'] = $validated['year'];
        if (isset($validated['event']))
            $data['event'] = $validated['event'];
        if (isset($validated['description']))
            $data['description'] = $validated['description'];
        if (array_key_exists('details', $validated))
            $data['details'] = $validated['details'];
        if (array_key_exists('imageUrl', $validated))
            $data['image_url'] = $validated['imageUrl'];
        if (isset($validated['order']))
            $data['order_index'] = $validated['order'];
        if (isset($validated['isActive']))
            $data['is_active'] = $validated['isActive'];

        $timelineEvent->update($data);

        return response()->json($timelineEvent);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $timelineEvent = TimelineEvent::findOrFail($id);
        $timelineEvent->delete();

        return response()->json(null, 204);
    }
}
