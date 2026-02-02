<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    //
    protected $fillable = [
        'title',
        'message',
        'type',
        'read',
        'is_read', // Added for compatibility if needed
        'link',
        'related_id',
        'user_id'
    ];

    protected $casts = [
        'read' => 'boolean',
        'is_read' => 'boolean',
    ];

    protected $appends = ['isRead', 'createdAt', 'updatedAt', 'relatedId'];

    public function getIsReadAttribute()
    {
        return $this->read ?? $this->is_read ?? false;
    }

    public function getCreatedAtAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }

    public function getUpdatedAtAttribute($value)
    {
        return $value ? $this->asDateTime($value)->toISOString() : null;
    }

    public function getRelatedIdAttribute($value)
    {
        return $value ?? $this->attributes['related_id'] ?? null;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
