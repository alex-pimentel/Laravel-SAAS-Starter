<?php

use App\Models\UsageEvent;
use App\Models\User;
use App\Models\Workspace;
use App\Models\WorkspaceApiKey;
use App\Services\ProductUsageService;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->workspace = Workspace::factory()->create(['owner_id' => $this->user->id]);
    $this->workspace->addUser($this->user, 'owner');
    $this->service = app(ProductUsageService::class);
});

it('records usage and counts it for the current month', function () {
    $this->service->record($this->workspace, ProductUsageService::TYPE_VIDEO_RENDER);
    $this->service->record($this->workspace, ProductUsageService::TYPE_VIDEO_RENDER, 2);

    expect($this->service->usedThisMonth($this->workspace, ProductUsageService::TYPE_VIDEO_RENDER))->toBe(3);
});

it('ignores usage recorded in previous months', function () {
    UsageEvent::create([
        'workspace_id' => $this->workspace->id,
        'type' => ProductUsageService::TYPE_VIDEO_RENDER,
        'quantity' => 5,
        'occurred_at' => now()->subMonthNoOverflow()->startOfMonth(),
    ]);

    expect($this->service->usedThisMonth($this->workspace, ProductUsageService::TYPE_VIDEO_RENDER))->toBe(0);
});

it('reads quotas from the workspace plan', function () {
    expect($this->service->quota($this->workspace, ProductUsageService::TYPE_VIDEO_RENDER))->toBe(3)
        ->and($this->service->quota($this->workspace, ProductUsageService::TYPE_AGENT_GENERATION))->toBe(10);

    $pro = Workspace::factory()->create(['plan_override' => 'pro']);
    expect($this->service->quota($pro, ProductUsageService::TYPE_VIDEO_RENDER))->toBe(30)
        ->and($this->service->quota($pro, ProductUsageService::TYPE_AGENT_GENERATION))->toBe(-1);

    $business = Workspace::factory()->create(['plan_override' => 'business']);
    expect($this->service->quota($business, ProductUsageService::TYPE_VIDEO_RENDER))->toBe(150);
});

it('checks the quota before consuming', function () {
    $this->service->record($this->workspace, ProductUsageService::TYPE_VIDEO_RENDER, 3);

    $check = $this->service->check($this->workspace, ProductUsageService::TYPE_VIDEO_RENDER);

    expect($check['allowed'])->toBeFalse()
        ->and($check['used'])->toBe(3)
        ->and($check['limit'])->toBe(3)
        ->and($check['remaining'])->toBe(0);

    $unlimited = Workspace::factory()->create(['plan_override' => 'pro']);
    $unlimitedCheck = $this->service->check($unlimited, ProductUsageService::TYPE_AGENT_GENERATION);

    expect($unlimitedCheck['allowed'])->toBeTrue()
        ->and($unlimitedCheck['remaining'])->toBe(-1);
});

it('summarises product usage with labels and percentage', function () {
    $this->service->record($this->workspace, ProductUsageService::TYPE_VIDEO_RENDER);

    $summary = $this->service->summary($this->workspace);

    expect($summary)->toHaveKeys(['videos_per_month', 'agent_generations_per_month'])
        ->and($summary['videos_per_month']['count'])->toBe(1)
        ->and($summary['videos_per_month']['limit'])->toBe(3)
        ->and($summary['videos_per_month']['percentage'])->toBe(33)
        ->and($summary['videos_per_month']['label'])->toBeString()->not->toBeEmpty();
});

it('includes product usage in the workspace overview', function () {
    $this->service->record($this->workspace, ProductUsageService::TYPE_VIDEO_RENDER);

    $overview = $this->workspace->fresh()->usageOverview();

    expect($overview)->toHaveKey('videos_per_month')
        ->and($overview['videos_per_month']['count'])->toBe(1)
        ->and($overview['videos_per_month']['limit'])->toBe(3);
});

it('returns the usage summary through the api', function () {
    $key = WorkspaceApiKey::generateKey($this->workspace, $this->user, 'Usage', ['read']);

    $this->getJson('/api/v1/usage/summary', [
        'Authorization' => 'Bearer '.$key['plainTextKey'],
    ])->assertOk()
        ->assertJsonStructure([
            'data' => [
                'videos_per_month' => ['label', 'count', 'limit', 'percentage'],
                'agent_generations_per_month' => ['label', 'count', 'limit', 'percentage'],
            ],
        ]);
});

it('checks usage through the api', function () {
    $key = WorkspaceApiKey::generateKey($this->workspace, $this->user, 'Usage', ['read']);

    $this->postJson('/api/v1/usage/check', ['type' => ProductUsageService::TYPE_VIDEO_RENDER], [
        'Authorization' => 'Bearer '.$key['plainTextKey'],
    ])->assertOk()
        ->assertJsonPath('data.allowed', true)
        ->assertJsonPath('data.limit', 3);
});

it('records usage through the api with write scope', function () {
    $key = WorkspaceApiKey::generateKey($this->workspace, $this->user, 'Usage', ['write']);

    $this->postJson('/api/v1/usage/record', [
        'type' => ProductUsageService::TYPE_VIDEO_RENDER,
        'metadata' => ['render_id' => 'abc-123'],
    ], [
        'Authorization' => 'Bearer '.$key['plainTextKey'],
    ])->assertCreated()
        ->assertJsonPath('data.recorded', true)
        ->assertJsonPath('data.usage.videos_per_month.count', 1);

    expect(UsageEvent::query()->where('workspace_id', $this->workspace->id)->count())->toBe(1);
});

it('rejects recording usage without the write scope', function () {
    $key = WorkspaceApiKey::generateKey($this->workspace, $this->user, 'Usage', ['read']);

    $this->postJson('/api/v1/usage/record', ['type' => ProductUsageService::TYPE_VIDEO_RENDER], [
        'Authorization' => 'Bearer '.$key['plainTextKey'],
    ])->assertForbidden();
});

it('rejects unknown usage types', function () {
    $key = WorkspaceApiKey::generateKey($this->workspace, $this->user, 'Usage', ['read']);

    $this->postJson('/api/v1/usage/check', ['type' => 'unknown_type'], [
        'Authorization' => 'Bearer '.$key['plainTextKey'],
    ])->assertUnprocessable();
});
