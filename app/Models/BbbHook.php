<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class BbbHook extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'callback_url',
        'meeting_id',
        'hook_id',
        'event_type',
        'is_active',
        'metadata',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_active' => 'boolean',
        'metadata' => 'array',
        'last_called_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The "booting" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Automatically set the user_id when creating a new hook
        static::creating(function ($hook) {
            if (auth()->check()) {
                $hook->user_id = $hook->user_id ?? auth()->id();
            }
        });
    }

    /**
     * Get the user that owns the hook.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class)->withDefault();
    }

    /**
     * Scope a query to only include active hooks.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include hooks for a specific meeting.
     */
    public function scopeForMeeting(Builder $query, ?string $meetingId): Builder
    {
        if (empty($meetingId)) {
            return $query->whereNull('meeting_id');
        }
        
        return $query->where(function ($q) use ($meetingId) {
            $q->whereNull('meeting_id')
              ->orWhere('meeting_id', $meetingId);
        });
    }

    /**
     * Get the display name for the event type.
     */
    public function getEventTypeNameAttribute(): string
    {
        $names = [
            'meeting-created' => 'Meeting Created',
            'meeting-ended' => 'Meeting Ended',
            'user-joined' => 'User Joined',
            'user-left' => 'User Left',
            'presentation-uploaded' => 'Presentation Uploaded',
            'recording-ready' => 'Recording Ready',
        ];

        return $names[$this->event_type] ?? ucfirst(str_replace('-', ' ', $this->event_type));
    }
}
