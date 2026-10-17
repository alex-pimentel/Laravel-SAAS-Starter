<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class OnboardingChecklistController extends Controller
{
    /**
     * Return the current checklist step completion state for the authenticated user.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $workspace = $user->currentWorkspace;

        if ($user->onboarding_checklist_dismissed_at) {
            return response()->json(['dismissed' => true, 'steps' => []]);
        }

        $steps = [
            [
                'id' => 'complete_profile',
                'label' => __('onboarding.checklist.steps.profile.label'),
                'description' => __('onboarding.checklist.steps.profile.description'),
                'completed' => ! empty($user->bio),
                'href' => '/settings/profile',
            ],
            [
                'id' => 'enable_2fa',
                'label' => __('onboarding.checklist.steps.two_factor.label'),
                'description' => __('onboarding.checklist.steps.two_factor.description'),
                'completed' => $user->two_factor_confirmed_at !== null,
                'href' => '/settings/two-factor',
            ],
            [
                'id' => 'invite_member',
                'label' => __('onboarding.checklist.steps.invite_member.label'),
                'description' => __('onboarding.checklist.steps.invite_member.description'),
                'completed' => $workspace && $workspace->users()->count() > 1,
                'href' => '/team',
            ],
            [
                'id' => 'connect_billing',
                'label' => __('onboarding.checklist.steps.billing.label'),
                'description' => __('onboarding.checklist.steps.billing.description'),
                'completed' => $workspace && $workspace->subscribed('default'),
                'href' => '/billing',
            ],
        ];

        return response()->json([
            'dismissed' => false,
            'steps' => $steps,
            'completed' => collect($steps)->where('completed', true)->count(),
            'total' => count($steps),
        ]);
    }

    /**
     * Dismiss the onboarding checklist permanently.
     */
    public function dismiss(Request $request): RedirectResponse
    {
        $request->user()->forceFill([
            'onboarding_checklist_dismissed_at' => now(),
        ])->save();

        return back();
    }
}
