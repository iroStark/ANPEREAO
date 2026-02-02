<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'member_number',
        'full_name',
        'birth_date',
        'birth_place',
        'nationality',
        'gender',
        'marital_status',
        'id_document',
        'id_issue_date',
        'id_issue_place',
        'father_name',
        'mother_name',
        'occupation',
        'phone',
        'current_address',
        'municipality',
        'work_province',
        'email',
        'photo_url',
        'other_info',
        'registration_date',
        'status',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'id_issue_date' => 'date',
        'registration_date' => 'date',
    ];

    protected $appends = [
        'memberNumber',
        'fullName',
        'birthDate',
        'birthPlace',
        'maritalStatus',
        'idDocument',
        'idIssueDate',
        'idIssuePlace',
        'fatherName',
        'motherName',
        'currentAddress',
        'workProvince',
        'photoUrl',
        'otherInfo',
        'registrationDate',
        'createdAt',
        'updatedAt',
    ];

    public function getCreatedAtAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }

    public function getUpdatedAtAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }

    // Accessors for CamelCase
    public function getMemberNumberAttribute($value)
    {
        return $value ?? $this->attributes['member_number'] ?? null;
    }
    public function getFullNameAttribute($value)
    {
        return $value ?? $this->attributes['full_name'] ?? null;
    }
    public function getBirthDateAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }
    public function getBirthPlaceAttribute($value)
    {
        return $value ?? $this->attributes['birth_place'] ?? null;
    }
    public function getMaritalStatusAttribute($value)
    {
        return $value ?? $this->attributes['marital_status'] ?? null;
    }
    public function getIdDocumentAttribute($value)
    {
        return $value ?? $this->attributes['id_document'] ?? null;
    }
    public function getIdIssueDateAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }
    public function getIdIssuePlaceAttribute($value)
    {
        return $value ?? $this->attributes['id_issue_place'] ?? null;
    }
    public function getFatherNameAttribute($value)
    {
        return $value ?? $this->attributes['father_name'] ?? null;
    }
    public function getMotherNameAttribute($value)
    {
        return $value ?? $this->attributes['mother_name'] ?? null;
    }
    public function getCurrentAddressAttribute($value)
    {
        return $value ?? $this->attributes['current_address'] ?? null;
    }
    public function getWorkProvinceAttribute($value)
    {
        return $value ?? $this->attributes['work_province'] ?? null;
    }
    public function getPhotoUrlAttribute($value)
    {
        return $value ?? $this->attributes['photo_url'] ?? null;
    }
    public function getOtherInfoAttribute($value)
    {
        return $value ?? $this->attributes['other_info'] ?? null;
    }
    public function getRegistrationDateAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }
}
