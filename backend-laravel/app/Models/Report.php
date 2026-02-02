<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'status',
        'period',
        'file_url',
    ];

    protected $appends = [
        'fileUrl',
        'createdAt',
        'updatedAt'
    ];

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
}
