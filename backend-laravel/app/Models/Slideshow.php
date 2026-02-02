<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Slideshow extends Model
{
    protected $table = 'slideshows';

    protected $fillable = ['image_url', 'title', 'subtitle', 'order_index', 'active'];

    protected $appends = ['imageUrl', 'isActive', 'order', 'description'];

    public function getImageUrlAttribute($value)
    {
        return $value ?? $this->attributes['image_url'] ?? null;
    }

    public function getIsActiveAttribute($value)
    {
        return (bool) ($value ?? $this->attributes['active'] ?? false);
    }

    public function getOrderAttribute($value)
    {
        return $value ?? $this->attributes['order_index'] ?? 0;
    }

    public function getDescriptionAttribute($value)
    {
        return $value ?? $this->attributes['subtitle'] ?? ''; // Map subtitle to description if needed, or empty
    }
}
