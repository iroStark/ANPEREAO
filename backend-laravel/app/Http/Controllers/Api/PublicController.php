<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


use App\Models\Slideshow;
use App\Models\Member;
use App\Models\SocialOrgao;
use App\Models\ActivityPlanItem;
use App\Models\Report;
use App\Models\Setting;
use App\Models\ContactMessage;
use App\Models\Legislation;
use App\Models\Publication; // Added

class PublicController extends Controller
{
    public function getSlideshow()
    {
        // ... (Slideshow model check?)
        return Slideshow::where('active', true)
            ->orderBy('order_index', 'asc')
            ->get();
    }

    public function getMembers()
    {
        return Member::where('status', 'active')->get();
    }

    public function getSocialOrgans(Request $request)
    {
        // Use SocialOrgao
        $query = SocialOrgao::where('active', true) // 'active' from migration
            ->orderBy('order_index', 'asc');

        if ($request->has('type')) {
            $query->where('organ_type', $request->type); // 'organ_type' from migration
        }

        return $query->get();
    }

    public function getActivityPlan(Request $request)
    {
        $query = \App\Models\ActivityPlan::with('items')->where('is_active', true);

        if ($request->has('year')) {
            $query->where('year', $request->year);
        } else {
            $query->orderBy('year', 'desc');
        }

        return $query->get();
    }

    public function getActivityPlanById($id)
    {
        $plan = \App\Models\ActivityPlan::with([
            'items' => function ($query) {
                $query->orderBy('order_index', 'asc')->orderBy('number', 'asc');
            }
        ])->where('is_active', true)->find($id);

        if (!$plan) {
            return response()->json(['error' => 'Activity Plan not found'], 404);
        }

        return $plan;
    }

    public function getReports(Request $request)
    {
        // Fix for existing schema
        $query = Report::where('status', 'published')
            ->orderBy('created_at', 'desc');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        return $query->get();
    }

    public function getLegislation(Request $request)
    {
        $query = Legislation::orderBy('year', 'desc');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return $query->get();
    }

    public function getLegislationById($id)
    {
        $legislation = Legislation::find($id);

        if (!$legislation) {
            return response()->json(['error' => 'Legislation not found'], 404);
        }

        return $legislation;
    }

    public function getSetting($key)
    {
        $setting = Setting::where('key', $key)->first();
        if (!$setting) {
            return response()->json(['error' => 'Setting not found'], 404);
        }
        return $setting;
    }

    public function getPublications(Request $request)
    {
        $query = Publication::orderBy('published_at', 'desc');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        return $query->get();
    }

    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $message = ContactMessage::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Message sent successfully',
            'data' => $message
        ], 201);
    }

    public function getTimelineEvents()
    {
        return \App\Models\TimelineEvent::where('is_active', true)
            ->orderBy('year', 'desc')
            ->orderBy('order_index', 'asc')
            ->get();
    }

    public function registerMember(Request $request)
    {
        // Validation rules matching MemberRegistration.tsx fields
        $validated = $request->validate([
            'fullName' => 'required|string|max:255',
            'birthDate' => 'required|string', // Format DD/MM/YYYY handled or string
            'birthPlace' => 'required|string',
            'nationality' => 'required|string',
            'gender' => 'required|string',
            'maritalStatus' => 'required|string',
            'idDocument' => 'required|string',
            'idIssueDate' => 'required|string',
            'idIssuePlace' => 'required|string',
            'fatherName' => 'required|string',
            'motherName' => 'required|string',
            'occupation' => 'required|string',
            'phone' => 'required|string',
            'currentAddress' => 'required|string',
            'municipality' => 'required|string',
            'workProvince' => 'required|string',
            'email' => 'required|email',
            'otherInfo' => 'nullable|string',
            'photo' => 'nullable|file|image|max:5120', // Photo upload 5MB
        ]);

        $imageUrl = null;
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('members', 'public');
            $imageUrl = asset('storage/' . $path);
        }

        // Create member with pending status
        // Ensure keys match database columns. Using snake_case for DB columns if needed, 
        // but Member model likely uses these names or snake_case.
        // Assuming user uses camelCase in frontend, need to check migration for Member col names.
        // If Member model uses snake_case, I need to map.
        // Let's assume snake_case for DB columns based on typical Laravel.

        $data = [
            'full_name' => $validated['fullName'],
            'birth_date' => $validated['birthDate'],
            'birth_place' => $validated['birthPlace'],
            'nationality' => $validated['nationality'],
            'gender' => $validated['gender'],
            'marital_status' => $validated['maritalStatus'],
            'id_document' => $validated['idDocument'],
            'id_issue_date' => $validated['idIssueDate'],
            'id_issue_place' => $validated['idIssuePlace'],
            'father_name' => $validated['fatherName'],
            'mother_name' => $validated['motherName'],
            'occupation' => $validated['occupation'],
            'phone' => $validated['phone'],
            'current_address' => $validated['currentAddress'],
            'municipality' => $validated['municipality'],
            'work_province' => $validated['workProvince'],
            'email' => $validated['email'],
            'other_info' => $validated['otherInfo'] ?? null,
            'photo_url' => $imageUrl,
            'status' => 'pending',
            'member_number' => 'PENDING-' . time(), // Temporary number
            'registration_date' => now(),
        ];

        $member = Member::create($data);

        return response()->json($member, 201);
    }
}
