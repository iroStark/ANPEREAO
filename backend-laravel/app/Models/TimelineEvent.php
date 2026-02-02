<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimelineEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'event',
        'description',
        'details',
        'image_url',
        'order_index',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Accessor for frontend compatibility (imageUrl -> image_url)
    protected $appends = ['imageUrl', 'isActive', 'order'];

    public function getImageUrlAttribute()
    {
        return $this->image_url;
    }

    public function getIsActiveAttribute()
    {
        return $this->is_active;
    }

    public function getOrderAttribute()
    {
        return $this->order_index;
    }
}
