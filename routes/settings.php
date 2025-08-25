<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('settings/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo');
    Route::delete('settings/profile/photo', [ProfileController::class, 'removePhoto'])->name('profile.photo.remove');
    Route::get('settings/profile/photo/history', [ProfileController::class, 'getPhotoHistory'])->name('profile.photo.history');
    Route::post('settings/profile/photo/set-current', [ProfileController::class, 'setPhotoAsCurrent'])->name('profile.photo.set-current');
    Route::post('settings/profile/photo/add-to-history', [ProfileController::class, 'addToHistory'])->name('profile.photo.add-to-history');
    Route::delete('settings/profile/photo/delete', [ProfileController::class, 'deletePhoto'])->name('profile.photo.delete');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});
