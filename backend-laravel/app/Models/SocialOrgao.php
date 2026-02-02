<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SocialOrgao extends Model
{
    protected $fillable = [
        'name',
        'position',
        'organ_type',
        'bio',
        'photo_url',
        'email',
        'phone',
        'order_index',
        'active'
    ];

    protected $appends = ['organType', 'photoUrl', 'orderIndex', 'isActive'];

    public function getOrganTypeAttribute($value)
    {
        return $value ?? $this->attributes['organ_type'] ?? null;
    }

    public function getPhotoUrlAttribute($value)
    {
        return $value ?? $this->attributes['photo_url'] ?? null;
    }

    public function getOrderIndexAttribute($value)
    {
        return $value ?? $this->attributes['order_index'] ?? 0;
    }

    public function getIsActiveAttribute($value)
    {
        return (bool) ($value ?? $this->attributes['active'] ?? false);
    }
}
