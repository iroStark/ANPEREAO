<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Legislation;
use Illuminate\Http\Request;

class LegislationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Legislation::orderBy('created_at', 'desc')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string|max:100',
            'year' => 'required|string|max:4',
            'icon' => 'required|string|max:50',
            'content' => 'nullable|string',
            'file_url' => 'nullable|string',
            // 'fileUrl' is handled by frontend mapping, backend uses file_url
        ]);

        // Handle fileUrl from frontend if present
        if ($request->has('fileUrl')) {
            $validated['file_url'] = $request->input('fileUrl');
        }

        $legislation = Legislation::create($validated);

        return response()->json($legislation, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Legislation $legislation)
    {
        return $legislation;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Legislation $legislation)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string|max:100',
            'year' => 'sometimes|string|max:4',
            'icon' => 'sometimes|string|max:50',
            'content' => 'nullable|string',
            'file_url' => 'nullable|string',
        ]);

        if ($request->has('fileUrl')) {
            $validated['file_url'] = $request->input('fileUrl');
        }

        $legislation->update($validated);

        return response()->json($legislation);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Legislation $legislation)
    {
        $legislation->delete();
        return response()->json(null, 204);
    }
}
