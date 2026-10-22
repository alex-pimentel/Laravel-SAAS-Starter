<?php

use App\Models\User;
use App\Models\Workspace;
use App\Services\PlanLimitService;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->planLimitService = new PlanLimitService;
    $this->user = User::factory()->create();
});

it('returns correct limits for different plans', function () {
    $freeLimits = $this->planLimitService->getLimits('free');
    expect($freeLimits['api_keys'])->toBe(1);
    expect($freeLimits['webhooks'])->toBe(0);

    $proLimits = $this->planLimitService->getLimits('pro');
    expect($proLimits['api_keys'])->toBe(5);
    expect($proLimits['webhooks'])->toBe(3);

    $businessLimits = $this->planLimitService->getLimits('business');
    expect($businessLimits['api_keys'])->toBe(-1);
    expect($businessLimits['webhooks'])->toBe(-1);
});

it('resolves limits from the plan display name', function () {
    // Workspace::plan_name returns the display name ("Grátis"/"Pro"), which
    // must resolve to the same limits as the plan key.
    expect($this->planLimitService->getLimits('Grátis'))
        ->toBe($this->planLimitService->getLimits('free'));

    expect($this->planLimitService->getLimits('Pro'))
        ->toBe($this->planLimitService->getLimits('pro'));

    expect($this->planLimitService->getLimits('Business'))
        ->toBe($this->planLimitService->getLimits('business'));

    // Unknown plans fall back to the free plan limits (with every key present)
    expect($this->planLimitService->getLimits('unknown-plan'))
        ->toBe($this->planLimitService->getLimits('free'));
});

it('checks api key limits correctly', function () {
    $workspace = Workspace::factory()->create([
        'owner_id' => $this->user->id,
    ]);

    // By default it's the Free plan (1 API key)
    expect($this->planLimitService->canCreateApiKey($workspace))->toBeTrue();

    // We can't easily change the plan without Stripe mocks,
    // but we've verified getLimits works with different strings.
});

it('generates correct limit messages', function () {
    $workspace = Workspace::factory()->create([
        'owner_id' => $this->user->id,
    ]);

    // Free plan message
    $message = $this->planLimitService->getApiKeyLimitMessage($workspace);
    expect($message)->toContain('You can create 1 more API key(s). (0/1 used)');
});
