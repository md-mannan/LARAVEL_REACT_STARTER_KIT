<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProfilePhotoHistory extends Model
{
    protected $table = 'profile_photo_history';
    
    protected $fillable = [
        'user_id',
        'photo_path',
        'photo_url',
        'used_from',
        'used_until',
        'is_current',
    ];

    protected $casts = [
        'used_from' => 'datetime',
        'used_until' => 'datetime',
        'is_current' => 'boolean',
    ];

    /**
     * Get the user that owns the profile photo.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the photo URL.
     */
    public function getPhotoUrlAttribute($value)
    {
        if ($this->photo_path) {
            return Storage::disk('public')->url($this->photo_path);
        }
        return $value;
    }
}
