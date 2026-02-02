<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Legislation extends Model
{
    protected $fillable = [
        'title',
        'description',
        'category',
        'year',
        'icon',
        'content',
        'file_url',
        'published_at',
    ];

    // O Frontend espera 'fileUrl', então vamos adicionar esse atributo virtual
    protected $appends = ['fileUrl', 'publishedAt', 'createdAt', 'updatedAt'];

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
}
