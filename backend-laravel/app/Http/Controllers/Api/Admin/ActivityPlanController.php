<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityPlan;
use Illuminate\Http\Request;

class ActivityPlanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return ActivityPlan::with(['items'])->orderBy('year', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|string|size:4',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'isActive' => 'boolean', // Frontend sends 'isActive'
        ]);

        // Map frontend camelCase to snake_case if needed, but model uses is_active
        $data = [
            'year' => $validated['year'],
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'is_active' => $request->input('isActive', true),
        ];

        $plan = ActivityPlan::create($data);

        return response()->json($plan, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return ActivityPlan::with(['items'])->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $plan = ActivityPlan::findOrFail($id);

        $validated = $request->validate([
            'year' => 'sometimes|string|size:4',
            'title' => 'sometimes|string',
            'description' => 'nullable|string',
            'isActive' => 'boolean',
        ]);

        $data = [];
        if (isset($validated['year']))
            $data['year'] = $validated['year'];
        if (isset($validated['title']))
            $data['title'] = $validated['title'];
        if (array_key_exists('description', $validated))
            $data['description'] = $validated['description'];
        if (isset($validated['isActive']))
            $data['is_active'] = $validated['isActive'];

        $plan->update($data);

        return response()->json($plan);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $plan = ActivityPlan::findOrFail($id);
        $plan->delete();
        return response()->json(null, 204);
    }
}
