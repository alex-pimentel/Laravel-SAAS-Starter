<?php

use App\Models\User;
use App\Models\Workspace;
use App\Services\PlanLimitService;

beforeEach(function () {
    $this->service = new PlanLimitService;
    $this->user = User::factory()->create();
});

it('can get limits for different plans', function () {
    $freeLimits = $this->service->getLimits('free');
    $proLimits = $this->service->getLimits('pro');
    $businessLimits = $this->service->getLimits('business');

    expect($freeLimits['workspaces'])->toBe(1);
    expect($proLimits['workspaces'])->toBe(3);
    expect($businessLimits['team_members'])->toBe(-1);
});

it('defaults to free limits for unknown plans', function () {
    $limits = $this->service->getLimits('unknown_plan');

    expect($limits['workspaces'])->toBe(1);
    expect($limits['team_members'])->toBe(1);
});

it('calculates the maximum number of workspaces based on the highest plan', function () {
    expect($this->service->getMaxWorkspacesForUser($this->user))->toBe(1);

    $workspace = Workspace::factory()->create([
        'owner_id' => $this->user->id,
        'plan_override' => 'pro',
    ]);

    // Set the relation on user so it's not fetched from DB
    $this->user->setRelation('ownedWorkspaces', collect([$workspace]));

    expect($this->service->getMaxWorkspacesForUser($this->user))->toBe(3);
});

it('determines if a user can create another workspace', function () {
    expect($this->service->canCreateWorkspace($this->user))->toBeTrue();

    $workspace = Workspace::factory()->create(['owner_id' => $this->user->id]);
    $this->user->unsetRelation('ownedWorkspaces'); // Ensure count() hits DB or fresh relation

    expect($this->service->canCreateWorkspace($this->user))->toBeFalse();

    // Upgrade to Pro by overriding the plan and relation
    $workspace->update(['plan_override' => 'pro']);

    $this->user->setRelation('ownedWorkspaces', collect([$workspace->fresh()]));

    expect($this->service->canCreateWorkspace($this->user))->toBeTrue();
});

it('treats the business plan as unlimited workspaces', function () {
    $workspace = Workspace::factory()->create([
        'owner_id' => $this->user->id,
        'plan_override' => 'business',
    ]);

    $this->user->setRelation('ownedWorkspaces', collect([$workspace]));

    expect($this->service->getMaxWorkspacesForUser($this->user))->toBe(-1)
        ->and($this->service->canCreateWorkspace($this->user))->toBeTrue();
});

it('determines if a workspace can invite more team members', function () {
    $workspace = Workspace::factory()->create(['owner_id' => $this->user->id]);
    $workspace->users()->attach($this->user->id, ['role' => 'owner']);

    // Free plan: the owner fills the single seat — no invites allowed
    expect($this->service->canInviteTeamMember($workspace))->toBeFalse();

    // Pro plan: 5 seats, only the owner is a member
    $workspace->update(['plan_override' => 'pro']);

    expect($this->service->canInviteTeamMember($workspace->fresh()))->toBeTrue();
});
