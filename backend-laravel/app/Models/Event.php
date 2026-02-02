<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'date',
        'time',
        'location',
        'type',
        'capacity',
        'registration_url',
        'active',
        'published_at',
    ];

    protected $appends = ['registrationUrl', 'publishedAt', 'createdAt', 'updatedAt'];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function getRegistrationUrlAttribute()
    {
        return $this->attributes['registration_url'] ?? null;
    }

    public function getPublishedAtAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }

    public function getCreatedAtAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }

    public function getUpdatedAtAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }

    public function setRegistrationUrlAttribute($value)
    {
        $this->attributes['registration_url'] = $value;
    }
}
