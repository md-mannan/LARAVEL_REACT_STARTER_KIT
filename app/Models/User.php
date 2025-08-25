<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the user's avatar URL.
     */
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar) {
            return Storage::disk('public')->url($this->avatar);
        }
        return null;
    }

    /**
     * The accessors to append to the model's array form.
     */
    protected $appends = ['avatar_url'];

    /**
     * Get the profile photo history for the user.
     */
    public function profilePhotoHistory()
    {
        return $this->hasMany(ProfilePhotoHistory::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get the current profile photo history record.
     */
    public function currentProfilePhoto()
    {
        return $this->hasOne(ProfilePhotoHistory::class)->where('is_current', true);
    }
}
