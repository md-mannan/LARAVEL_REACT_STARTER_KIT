<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\ProfilePhotoHistory;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $photoHistory = $user->profilePhotoHistory()->orderBy('created_at', 'desc')->get();
        
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'userData' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'avatar_url' => $user->avatar_url,
            ],
            'photoHistory' => $photoHistory,
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return to_route('profile.edit');
    }

    /**
     * Update the user's profile photo.
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'profile_photo' => ['required', 'image', 'max:2048'], // 2MB max
        ]);

        $user = $request->user();
        
        // If user has a current avatar, move it to history
        if ($user->avatar) {
            $this->moveCurrentPhotoToHistory($user);
        }
        
        // Store new profile photo
        $path = $request->file('profile_photo')->store('profile-photos', 'public');
        
        // Update user avatar directly (no duplicate history)
        $user->avatar = $path;
        $user->save();
        
        return back()->with('status', 'Profile photo updated successfully!');
    }

    /**
     * Remove the user's profile photo.
     */
    public function removePhoto(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        if ($user->avatar) {
            // Mark current photo as not current in history
            ProfilePhotoHistory::where('user_id', $user->id)
                ->where('is_current', true)
                ->update([
                    'is_current' => false,
                    'used_until' => now(),
                ]);
            
            // Remove avatar reference from user
            $user->avatar = null;
            $user->save();
            
            return back()->with('status', 'Profile photo removed successfully!');
        }
        
        return back()->with('status', 'No profile photo to remove.');
    }

    /**
     * Move current photo to history.
     */
    private function moveCurrentPhotoToHistory($user): void
    {
        // Only create history if the photo was used for more than 1 day
        // This prevents creating history for quick changes
        $currentHistory = ProfilePhotoHistory::where('user_id', $user->id)
            ->where('is_current', true)
            ->first();
            
        if ($currentHistory) {
            // Mark current as not current
            $currentHistory->update([
                'is_current' => false,
                'used_until' => now(),
            ]);
            
            // Only add to history if it was used for more than 1 hour
            $usageTime = now()->diffInHours($currentHistory->used_from);
            if ($usageTime >= 1) {
                // Create history record for the old photo
                ProfilePhotoHistory::create([
                    'user_id' => $user->id,
                    'photo_path' => $user->avatar,
                    'used_from' => $currentHistory->used_from,
                    'used_until' => now(),
                    'is_current' => false,
                ]);
            }
        }
    }

    /**
     * Get user's profile photo history.
     */
    public function getPhotoHistory(Request $request): Response
    {
        $user = $request->user();
        $photoHistory = $user->profilePhotoHistory()->with('user')->get();

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
            'userData' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'avatar_url' => $user->avatar_url,
            ],
            'photoHistory' => $photoHistory,
        ]);
    }

    /**
     * Set a previous photo as current profile photo.
     */
    public function setPhotoAsCurrent(Request $request): RedirectResponse
    {
        $request->validate([
            'photo_id' => ['required', 'exists:profile_photo_history,id'],
        ]);

        $user = $request->user();
        $photoHistory = ProfilePhotoHistory::findOrFail($request->photo_id);

        // Ensure the photo belongs to the user
        if ($photoHistory->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Move current photo to history (only if it was used for significant time)
        if ($user->avatar) {
            $this->moveCurrentPhotoToHistory($user);
        }

        // Set the selected photo as current
        $photoHistory->update([
            'is_current' => true,
            'used_from' => now(),
            'used_until' => null,
        ]);

        // Update user avatar
        $user->avatar = $photoHistory->photo_path;
        $user->save();

        return back()->with('status', 'Profile photo restored successfully!');
    }

    /**
     * Manually add current photo to history (for keeping important photos).
     */
    public function addToHistory(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        if (!$user->avatar) {
            return back()->with('error', 'No current profile photo to add to history.');
        }

        // Check if already in history
        $exists = ProfilePhotoHistory::where('user_id', $user->id)
            ->where('photo_path', $user->avatar)
            ->exists();
            
        if ($exists) {
            return back()->with('info', 'Photo is already in your history.');
        }

        // Add current photo to history
        ProfilePhotoHistory::create([
            'user_id' => $user->id,
            'photo_path' => $user->avatar,
            'used_from' => now()->subDays(1), // Approximate
            'used_until' => now(),
            'is_current' => false,
        ]);

        return back()->with('status', 'Photo added to history successfully!');
    }

    /**
     * Delete a photo from history.
     */
    public function deletePhoto(Request $request): RedirectResponse
    {
        $request->validate([
            'photo_id' => ['required', 'exists:profile_photo_history,id'],
        ]);

        $user = $request->user();
        $photoHistory = ProfilePhotoHistory::findOrFail($request->photo_id);

        // Ensure the photo belongs to the user
        if ($photoHistory->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }

        // Don't allow deletion of current profile photo
        if ($photoHistory->is_current) {
            return back()->with('error', 'Cannot delete your current profile photo. Please change it first.');
        }

        // Delete the file from storage if it exists
        if ($photoHistory->photo_path && Storage::disk('public')->exists($photoHistory->photo_path)) {
            Storage::disk('public')->delete($photoHistory->photo_path);
        }

        // Delete the history record
        $photoHistory->delete();

        return back()->with('status', 'Photo deleted from history successfully!');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
