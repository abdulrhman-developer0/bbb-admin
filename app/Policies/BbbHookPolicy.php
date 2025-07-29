<?php

namespace App\Policies;

use App\Models\BbbHook;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class BbbHookPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Any authenticated user can view their own hooks
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, BbbHook $hook): bool
    {
        // User can only view their own hooks
        return $user->id === $hook->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Any authenticated user can create hooks
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, BbbHook $hook): bool
    {
        // User can only update their own hooks
        return $user->id === $hook->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, BbbHook $hook): bool
    {
        // User can only delete their own hooks
        return $user->id === $hook->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, BbbHook $bbbHook): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, BbbHook $bbbHook): bool
    {
        return false;
    }
}
