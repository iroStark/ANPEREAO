<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityPlanItem;
use Illuminate\Http\Request;

class ActivityPlanItemController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'planId' => 'required|exists:activity_plans,id',
            'number' => 'required|integer',
            'activity' => 'required|string',
            'date' => 'nullable|string',
            'time' => 'nullable|string',
            'location' => 'nullable|string',
            'participants' => 'nullable|string',
            'order' => 'integer',
        ]);

        $data = [
            'activity_plan_id' => $validated['planId'],
            'number' => $validated['number'],
            'activity' => $validated['activity'],
            'date' => $validated['date'] ?? null,
            'time' => $validated['time'] ?? null,
            'location' => $validated['location'] ?? null,
            'participants' => $validated['participants'] ?? null,
            'order_index' => $validated['order'] ?? 0,
        ];

        $item = ActivityPlanItem::create($data);

        return response()->json($item, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $item = ActivityPlanItem::findOrFail($id);

        $validated = $request->validate([
            'number' => 'sometimes|integer',
            'activity' => 'sometimes|string',
            'date' => 'nullable|string',
            'time' => 'nullable|string',
            'location' => 'nullable|string',
            'participants' => 'nullable|string',
            'order' => 'integer',
        ]);

        $data = [];
        if (isset($validated['number']))
            $data['number'] = $validated['number'];
        if (isset($validated['activity']))
            $data['activity'] = $validated['activity'];
        if (array_key_exists('date', $validated))
            $data['date'] = $validated['date'];
        if (array_key_exists('time', $validated))
            $data['time'] = $validated['time'];
        if (array_key_exists('location', $validated))
            $data['location'] = $validated['location'];
        if (array_key_exists('participants', $validated))
            $data['participants'] = $validated['participants'];
        if (isset($validated['order']))
            $data['order_index'] = $validated['order'];

        $item->update($data);

        return response()->json($item);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $item = ActivityPlanItem::findOrFail($id);
        $item->delete();
        return response()->json(null, 204);
    }
}
