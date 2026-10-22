<?php

use App\Models\User;
use App\Models\Workspace;
use Illuminate\Support\Facades\Notification;

use function Pest\Laravel\actingAs;

beforeEach(function () {
    $this->owner = User::factory()->create();
    $this->workspace = Workspace::factory()->create(['owner_id' => $this->owner->id]);
    $this->workspace->users()->attach($this->owner, ['role' => 'owner']);
    $this->owner->update(['current_workspace_id' => $this->workspace->id]);
});

it('reports the correct seat count', function () {
    // Owner is already attached (1 seat)
    expect($this->workspace->activeSeatCount())->toBe(1);

    $member = User::factory()->create();
    $this->workspace->users()->attach($member, ['role' => 'member']);

    expect($this->workspace->activeSeatCount())->toBe(2);
});

it('returns the correct seat limit for the free plan', function () {
    // Workspace defaults to Free plan (no Stripe subscription) — solo seat
    expect($this->workspace->seatLimit())->toBe(1);
});

it('has an available seat when under the limit', function () {
    // Pro plan: 5 seats, only the owner (1) is a member
    $this->workspace->update(['plan_override' => 'pro']);

    expect($this->workspace->fresh()->hasAvailableSeat())->toBeTrue();
});

it('has no available seat when at the free limit', function () {
    $member = User::factory()->create();
    $this->workspace->users()->attach($member, ['role' => 'member']);

    // 2 users on a 1-seat free plan — over the limit
    expect($this->workspace->fresh()->hasAvailableSeat())->toBeFalse();
});

it('blocks invitation when workspace is at the seat limit', function () {
    $member = User::factory()->create();
    $this->workspace->users()->attach($member, ['role' => 'member']);

    actingAs($this->owner)
        ->post('/team/invite', ['email' => 'new@example.com', 'role' => 'member'])
        ->assertRedirect()
        ->assertSessionHas('error');
});

it('allows invitation when under the seat limit', function () {
    Notification::fake();

    // Pro plan: 5 seats, only the owner (1) is a member
    $this->workspace->update(['plan_override' => 'pro']);

    actingAs($this->owner)
        ->post('/team/invite', ['email' => 'new@example.com', 'role' => 'member'])
        ->assertRedirect()
        ->assertSessionMissing('error');
});
