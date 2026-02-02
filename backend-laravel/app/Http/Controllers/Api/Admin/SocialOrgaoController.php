<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\SocialOrgao;
use Illuminate\Http\Request;

class SocialOrgaoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SocialOrgao::orderBy('order_index', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'position' => 'required|string',
            'organType' => 'required|string',
            'bio' => 'nullable|string',
            'photoUrl' => 'nullable|string',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'orderIndex' => 'required|integer',
            'isActive' => 'boolean',
        ]);

        $orgao = SocialOrgao::create([
            'name' => $validated['name'],
            'position' => $validated['position'],
            'organ_type' => $validated['organType'], // Map organType -> organ_type
            'bio' => $validated['bio'],
            'photo_url' => $validated['photoUrl'], // Map photoUrl -> photo_url
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'order_index' => $validated['orderIndex'], // Map orderIndex -> order_index
            'active' => $validated['isActive'] ?? true,
        ]);

        return response()->json($orgao, 201);
    }

    public function show(SocialOrgao $socialOrgao)
    {
        return $socialOrgao;
    }

    public function update(Request $request, SocialOrgao $socialOrgao)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'position' => 'sometimes|string',
            'organType' => 'sometimes|string',
            'bio' => 'nullable|string',
            'photoUrl' => 'nullable|string', // Allow empty string
            'email' => 'nullable|email', // Allow null
            'phone' => 'nullable|string',
            'orderIndex' => 'sometimes|integer',
            'isActive' => 'boolean',
        ]);

        $updateData = [];
        if (isset($validated['name']))
            $updateData['name'] = $validated['name'];
        if (isset($validated['position']))
            $updateData['position'] = $validated['position'];
        if (isset($validated['organType']))
            $updateData['organ_type'] = $validated['organType'];
        if (isset($validated['bio']))
            $updateData['bio'] = $validated['bio'];
        if (array_key_exists('photoUrl', $validated))
            $updateData['photo_url'] = $validated['photoUrl'];
        if (array_key_exists('email', $validated))
            $updateData['email'] = $validated['email'];
        if (array_key_exists('phone', $validated))
            $updateData['phone'] = $validated['phone'];
        if (isset($validated['orderIndex']))
            $updateData['order_index'] = $validated['orderIndex'];
        if (isset($validated['isActive']))
            $updateData['active'] = $validated['isActive'];

        $socialOrgao->update($updateData);

        return response()->json($socialOrgao);
    }

    public function destroy(SocialOrgao $socialOrgao)
    {
        $socialOrgao->delete();
        return response()->json(null, 204);
    }

}
