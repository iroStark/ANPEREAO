<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Report::orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'type' => 'required|in:monthly,quarterly,annual,special',
            'status' => 'required|in:draft,published,archived',
            'period' => 'required|string',
            'fileUrl' => 'nullable|string',
        ]);

        $report = Report::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'status' => $validated['status'],
            'period' => $validated['period'],
            'file_url' => $validated['fileUrl'] ?? null,
        ]);

        return response()->json($report, 201);
    }

    public function show($id)
    {
        return Report::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $report = Report::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'type' => 'sometimes|in:monthly,quarterly,annual,special',
            'status' => 'sometimes|in:draft,published,archived',
            'period' => 'sometimes|string',
            'fileUrl' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($validated['title']))
            $updateData['title'] = $validated['title'];
        if (isset($validated['description']))
            $updateData['description'] = $validated['description'];
        if (isset($validated['type']))
            $updateData['type'] = $validated['type'];
        if (isset($validated['status']))
            $updateData['status'] = $validated['status'];
        if (isset($validated['period']))
            $updateData['period'] = $validated['period'];
        if (isset($validated['fileUrl']))
            $updateData['file_url'] = $validated['fileUrl'];

        $report->update($updateData);

        return response()->json($report);
    }

    public function destroy($id)
    {
        $report = Report::findOrFail($id);
        $report->delete();
        return response()->json(null, 204);
    }
}
