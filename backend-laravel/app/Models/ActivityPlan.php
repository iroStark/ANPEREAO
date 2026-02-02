<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityPlan extends Model
{
    protected $fillable = [
        'year',
        'title',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(ActivityPlanItem::class)->orderBy('order_index')->orderBy('number');
    }
}
