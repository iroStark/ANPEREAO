<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Support\DateHelper;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Member::orderBy('full_name', 'asc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'memberNumber' => 'required|string',
            'fullName' => 'required|string',
            'birthDate' => 'required|string',
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
            'email' => 'required|email|unique:members,email',
            'photoUrl' => 'nullable|string',
            'otherInfo' => 'nullable|string',
            'registrationDate' => 'nullable|string',
            'status' => 'required|in:active,inactive,pending',
        ]);

        $member = Member::create([
            'member_number' => $validated['memberNumber'],
            'full_name' => $validated['fullName'],
            'birth_date' => DateHelper::parsePortugueseDate($validated['birthDate']),
            'birth_place' => $validated['birthPlace'],
            'nationality' => $validated['nationality'],
            'gender' => $validated['gender'],
            'marital_status' => $validated['maritalStatus'],
            'id_document' => $validated['idDocument'],
            'id_issue_date' => DateHelper::parsePortugueseDate($validated['idIssueDate']),
            'id_issue_place' => $validated['idIssuePlace'],
            'father_name' => $validated['fatherName'],
            'mother_name' => $validated['motherName'],
            'occupation' => $validated['occupation'],
            'phone' => $validated['phone'],
            'current_address' => $validated['currentAddress'],
            'municipality' => $validated['municipality'],
            'work_province' => $validated['workProvince'],
            'email' => $validated['email'],
            'photo_url' => $validated['photoUrl'] ?? null,
            'other_info' => $validated['otherInfo'] ?? null,
            'registration_date' => DateHelper::parsePortugueseDate($validated['registrationDate'] ?? null),
            'status' => $validated['status'],
        ]);

        return response()->json($member, 201);
    }

    public function show($id)
    {
        return Member::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $member = Member::findOrFail($id);

        $validated = $request->validate([
            'memberNumber' => 'sometimes|string',
            'fullName' => 'sometimes|string',
            'birthDate' => 'sometimes|string',
            'birthPlace' => 'sometimes|string',
            'nationality' => 'sometimes|string',
            'gender' => 'sometimes|string',
            'maritalStatus' => 'sometimes|string',
            'idDocument' => 'sometimes|string',
            'idIssueDate' => 'sometimes|string',
            'idIssuePlace' => 'sometimes|string',
            'fatherName' => 'sometimes|string',
            'motherName' => 'sometimes|string',
            'occupation' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'currentAddress' => 'sometimes|string',
            'municipality' => 'sometimes|string',
            'workProvince' => 'sometimes|string',
            'email' => 'sometimes|email|unique:members,email,' . $id,
            'photoUrl' => 'nullable|string',
            'otherInfo' => 'nullable|string',
            'registrationDate' => 'nullable|string',
            'status' => 'sometimes|in:active,inactive,pending',
        ]);

        $updateData = [];
        $map = [
            'memberNumber' => 'member_number',
            'fullName' => 'full_name',
            'birthDate' => 'birth_date',
            'birthPlace' => 'birth_place',
            'nationality' => 'nationality',
            'gender' => 'gender',
            'maritalStatus' => 'marital_status',
            'idDocument' => 'id_document',
            'idIssueDate' => 'id_issue_date',
            'idIssuePlace' => 'id_issue_place',
            'fatherName' => 'father_name',
            'motherName' => 'mother_name',
            'occupation' => 'occupation',
            'phone' => 'phone',
            'currentAddress' => 'current_address',
            'municipality' => 'municipality',
            'workProvince' => 'work_province',
            'email' => 'email',
            'photoUrl' => 'photo_url',
            'otherInfo' => 'other_info',
            'registrationDate' => 'registration_date',
            'status' => 'status',
        ];

        foreach ($map as $front => $back) {
            if (array_key_exists($front, $validated)) {
                $value = $validated[$front];
                if (in_array($front, ['birthDate', 'idIssueDate', 'registrationDate']) && $value) {
                    $value = DateHelper::parsePortugueseDate($value);
                }
                $updateData[$back] = $value;
            }
        }

        $member->update($updateData);

        return response()->json($member);
    }

    public function destroy($id)
    {
        $member = Member::findOrFail($id);
        $member->delete();
        return response()->json(null, 204);
    }
}
