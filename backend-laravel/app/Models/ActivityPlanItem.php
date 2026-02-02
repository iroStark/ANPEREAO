<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityPlanItem extends Model
{
    protected $fillable = [
        'activity_plan_id',
        'number',
        'activity',
        'date',
        'time',
        'location',
        'participants',
        'order_index',
        'parent_id',
    ];

    public function plan()
    {
        return $this->belongsTo(ActivityPlan::class, 'activity_plan_id');
    }
}
