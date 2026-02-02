<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Support\DateHelper;

class GalleryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Gallery::orderBy('published_at', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'type' => 'required|in:image,video',
            'mediaUrl' => 'required|string',
            'thumbnailUrl' => 'nullable|string',
            'category' => 'required|string',
            'date' => 'nullable|string', // Frontend sends '23-Jan-1984', Laravel's 'date' validator might fail it
        ]);

        $gallery = Gallery::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'media_url' => $validated['mediaUrl'], // Map mediaUrl -> media_url
            'thumbnail_url' => $validated['thumbnailUrl'],
            'category' => $validated['category'],
            'published_at' => DateHelper::parsePortugueseDate($validated['date'] ?? null),
        ]);

        return response()->json($gallery, 201);
    }

    public function show(Gallery $gallery)
    {
        return $gallery;
    }

    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'nullable|string',
            'type' => 'sometimes|in:image,video',
            'mediaUrl' => 'sometimes|string',
            'thumbnailUrl' => 'nullable|string',
            'category' => 'sometimes|string',
            'date' => 'nullable|string',
        ]);

        $updateData = [];
        if (isset($validated['title']))
            $updateData['title'] = $validated['title'];
        if (isset($validated['description']))
            $updateData['description'] = $validated['description'];
        if (isset($validated['type']))
            $updateData['type'] = $validated['type'];
        if (isset($validated['mediaUrl']))
            $updateData['media_url'] = $validated['mediaUrl'];
        if (isset($validated['thumbnailUrl']))
            $updateData['thumbnail_url'] = $validated['thumbnailUrl'];
        if (isset($validated['category']))
            $updateData['category'] = $validated['category'];
        if (isset($validated['date']))
            $updateData['published_at'] = DateHelper::parsePortugueseDate($validated['date']);

        $gallery->update($updateData);

        return response()->json($gallery);
    }

    public function destroy(Gallery $gallery)
    {
        $gallery->delete();
        return response()->json(null, 204);
    }

}
