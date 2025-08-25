<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('auth', function () {
            if (Auth::check()) {
                $user = Auth::user();
                                   return [
                       'user' => [
                           'id' => $user->id,
                           'name' => $user->name,
                           'email' => $user->email,
                           'avatar' => $user->avatar,
                           'avatar_url' => $user->avatar_url,
                           'email_verified_at' => $user->email_verified_at,
                       ],
                       'photoHistory' => $user->profilePhotoHistory()->orderBy('created_at', 'desc')->get(),
                   ];
            }
            return ['user' => null];
        });
    }
}
