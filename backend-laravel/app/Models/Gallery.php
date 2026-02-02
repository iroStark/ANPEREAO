<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'date',
        'category',
        'views',
        'duration',
        'thumbnail',
        'thumbnail_url',
        'media_url',
        'published_at'
    ];

    protected $appends = ['mediaUrl', 'thumbnailUrl', 'isActive', 'publishedAt', 'createdAt', 'updatedAt'];

    protected $casts = [
        'published_at' => 'datetime',
        'views' => 'integer',
        'active' => 'boolean',
    ];

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

    public function getMediaUrlAttribute()
    {
        return $this->attributes['media_url'] ?? null;
    }

    public function setMediaUrlAttribute($value)
    {
        $this->attributes['media_url'] = $value;
    }

    public function getThumbnailUrlAttribute()
    {
        return $this->attributes['thumbnail'] ?? $this->attributes['thumbnail_url'] ?? null;
    }

    public function setThumbnailUrlAttribute($value)
    {
        $this->attributes['thumbnail'] = $value;
    }

    public function getIsActiveAttribute()
    {
        return true;
    }
}
