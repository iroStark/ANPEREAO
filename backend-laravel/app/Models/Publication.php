<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'date',
        'file_url',
        'download_url',
        'published_at'
    ];

    protected $appends = ['fileUrl', 'downloadUrl', 'publishedAt', 'createdAt', 'updatedAt'];

    protected $casts = [
        'published_at' => 'datetime',
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

    public function getFileUrlAttribute()
    {
        return $this->attributes['file_url'] ?? null;
    }

    public function setFileUrlAttribute($value)
    {
        $this->attributes['file_url'] = $value;
    }

    public function getDownloadUrlAttribute()
    {
        return $this->attributes['download_url'] ?? null;
    }

    public function setDownloadUrlAttribute($value)
    {
        $this->attributes['download_url'] = $value;
    }
}
