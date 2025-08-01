<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BbbEvent extends Model
{
    protected $fillable = [
        'event',
        'payload',
        'processed',
        'processed_at',
    ];

    protected $casts = [
        'payload' => 'array',
        'processed' => 'boolean',
        'processed_at' => 'datetime',
    ];
}