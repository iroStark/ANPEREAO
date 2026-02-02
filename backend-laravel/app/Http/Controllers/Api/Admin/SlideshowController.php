<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Slideshow;
use Illuminate\Http\Request;

class SlideshowController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Slideshow::orderBy('order_index', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'imageUrl' => 'required|string',
            'title' => 'required|string',
            'subtitle' => 'nullable|string',
            'description' => 'nullable|string', // Frontend sends description, map to subtitle?
            'order' => 'required|integer',
            'isActive' => 'boolean',
        ]);

        $slideshow = Slideshow::create([
            'image_url' => $validated['imageUrl'],
            'title' => $validated['title'],
            'subtitle' => $validated['subtitle'] ?? $validated['description'] ?? '',
            'order_index' => $validated['order'],
            'active' => $validated['isActive'] ?? true,
        ]);

        return response()->json($slideshow, 201);
    }

    public function show(Slideshow $slideshow)
    {
        return $slideshow;
    }

    public function update(Request $request, Slideshow $slideshow)
    {
        $validated = $request->validate([
            'imageUrl' => 'sometimes|string',
            'title' => 'sometimes|string',
            'subtitle' => 'nullable|string',
            'order' => 'sometimes|integer',
            'isActive' => 'boolean',
        ]);

        $updateData = [];
        if (isset($validated['imageUrl']))
            $updateData['image_url'] = $validated['imageUrl'];
        if (isset($validated['title']))
            $updateData['title'] = $validated['title'];
        if (isset($validated['subtitle']))
            $updateData['subtitle'] = $validated['subtitle'];
        if (isset($validated['order']))
            $updateData['order_index'] = $validated['order'];
        if (isset($validated['isActive']))
            $updateData['active'] = $validated['isActive'];

        $slideshow->update($updateData);

        return response()->json($slideshow);
    }

    public function destroy(Slideshow $slideshow)
    {
        $slideshow->delete();
        return response()->json(null, 204);
    }
}
