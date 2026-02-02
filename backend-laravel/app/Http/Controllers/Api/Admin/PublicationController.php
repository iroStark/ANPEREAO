<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Publication;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Support\DateHelper;

class PublicationController extends Controller
{
    public function index()
    {
        return Publication::orderBy('published_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'category' => 'required|string',
            'date' => 'nullable|string', // Display date string
            'fileUrl' => 'nullable|string',
            'downloadUrl' => 'nullable|string',
            'publishDate' => 'nullable|string', // Frontend might send this for published_at
        ]);

        $publication = Publication::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'date' => $validated['date'],
            'file_url' => $validated['fileUrl'],
            'download_url' => $validated['downloadUrl'],
            'published_at' => DateHelper::parsePortugueseDate($validated['publishDate'] ?? null),
        ]);

        return response()->json($publication, 201);
    }

    public function show($id)
    {
        return Publication::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'category' => 'sometimes|string',
            'date' => 'nullable|string',
            'fileUrl' => 'nullable|string',
            'downloadUrl' => 'nullable|string',
            'publishDate' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($validated['title']))
            $updateData['title'] = $validated['title'];
        if (isset($validated['description']))
            $updateData['description'] = $validated['description'];
        if (isset($validated['category']))
            $updateData['category'] = $validated['category'];
        if (isset($validated['date']))
            $updateData['date'] = $validated['date'];
        if (isset($validated['fileUrl']))
            $updateData['file_url'] = $validated['fileUrl'];
        if (isset($validated['downloadUrl']))
            $updateData['download_url'] = $validated['downloadUrl'];
        if (isset($validated['publishDate']))
            $updateData['published_at'] = DateHelper::parsePortugueseDate($validated['publishDate']);

        $publication->update($updateData);

        return response()->json($publication);
    }

    public function destroy($id)
    {
        $publication = Publication::findOrFail($id);
        $publication->delete();
        return response()->json(null, 204);
    }
}
