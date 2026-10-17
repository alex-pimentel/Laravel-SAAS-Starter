<?php

namespace App\Services;

use App\Models\UsageEvent;
use App\Models\Workspace;
use Illuminate\Support\Carbon;

class ProductUsageService
{
    public const TYPE_VIDEO_RENDER = 'video_render';

    public const TYPE_AGENT_GENERATION = 'agent_generation';

    /**
     * Metered product usage types mapped to their plan limit key.
     *
     * @var array<string, string>
     */
    public const TYPE_LIMITS = [
        self::TYPE_VIDEO_RENDER => 'videos_per_month',
        self::TYPE_AGENT_GENERATION => 'agent_generations_per_month',
    ];

    /**
     * Record a usage event for the workspace.
     */
    public function record(Workspace $workspace, string $type, int $quantity = 1, array $metadata = []): UsageEvent
    {
        return UsageEvent::create([
            'workspace_id' => $workspace->id,
            'type' => $type,
            'quantity' => max(1, $quantity),
            'metadata' => $metadata ?: null,
            'occurred_at' => now(),
        ]);
    }

    /**
     * Quantity consumed in the current calendar month.
     */
    public function usedThisMonth(Workspace $workspace, string $type): int
    {
        return (int) UsageEvent::query()
            ->where('workspace_id', $workspace->id)
            ->where('type', $type)
            ->where('occurred_at', '>=', Carbon::now()->startOfMonth())
            ->sum('quantity');
    }

    /**
     * Plan quota for the usage type (-1 means unlimited).
     */
    public function quota(Workspace $workspace, string $type): int
    {
        $limitKey = self::TYPE_LIMITS[$type] ?? null;

        if (! $limitKey) {
            return -1;
        }

        $plan = $workspace->plan_key;
        $limits = config("billing.plans.{$plan}.limits", []);

        return array_key_exists($limitKey, $limits) ? (int) $limits[$limitKey] : -1;
    }

    /**
     * Whether the workspace may consume the given quantity.
     *
     * @return array{allowed: bool, used: int, limit: int, remaining: int}
     */
    public function check(Workspace $workspace, string $type, int $quantity = 1): array
    {
        $used = $this->usedThisMonth($workspace, $type);
        $limit = $this->quota($workspace, $type);
        $remaining = $limit === -1 ? -1 : max(0, $limit - $used);

        return [
            'allowed' => $limit === -1 || $used + max(1, $quantity) <= $limit,
            'used' => $used,
            'limit' => $limit,
            'remaining' => $remaining,
        ];
    }

    /**
     * Usage summary for the workspace (metered product types).
     *
     * @return array<string, array{label: string, count: int, limit: int, percentage: int}>
     */
    public function summary(Workspace $workspace): array
    {
        $summary = [];

        foreach (self::TYPE_LIMITS as $type => $limitKey) {
            $count = $this->usedThisMonth($workspace, $type);
            $limit = $this->quota($workspace, $type);

            $summary[$limitKey] = [
                'label' => __("usage.{$type}"),
                'count' => $count,
                'limit' => $limit,
                'percentage' => $limit === -1 ? 0 : min(100, (int) round(($count / max(1, $limit)) * 100)),
            ];
        }

        return $summary;
    }

    /**
     * Whether the given string is a metered usage type.
     */
    public function isKnownType(string $type): bool
    {
        return array_key_exists($type, self::TYPE_LIMITS);
    }
}
