<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    //
    protected $fillable = ['name', 'email', 'subject', 'message', 'status'];

    protected $appends = ['read']; // Include 'read' boolean in JSON response

    protected $casts = [
        'read' => 'boolean', // Although 'read' isn't a column, cast might be ignored or useful if we map it manually
    ];

    public function getReadAttribute()
    {
        return $this->status === 'read';
    }
}
