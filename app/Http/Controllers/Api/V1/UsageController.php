<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Workspace;
use App\Services\ProductUsageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UsageController extends Controller
{
    public function __construct(
        protected ProductUsageService $usageService
    ) {}

    /**
     * @group Usage
     *
     * Product usage metering (video renders and agent generations).
     */
    /**
     * Usage summary for the authenticated workspace.
     *
     * @authenticated
     *
     * @response {
     *  "data": {
     *   "videos_per_month": {"label": "Vídeos renderizados", "count": 3, "limit": 30, "percentage": 10},
     *   "agent_generations_per_month": {"label": "Gerações do agente", "count": 12, "limit": -1, "percentage": 0}
     *  }
     * }
     */
    public function summary(Request $request): JsonResponse
    {
        $workspace = $this->workspace($request);

        return response()->json(['data' => $this->usageService->summary($workspace)]);
    }

    /**
     * Check whether the workspace can consume the given usage.
     *
     * @authenticated
     *
     * @bodyParam type string required One of: video_render, agent_generation.
     * @bodyParam quantity integer optional Quantity to check (default 1).
     *
     * @response {
     *  "data": {"allowed": true, "used": 3, "limit": 30, "remaining": 27}
     * }
     */
    public function check(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string'],
            'quantity' => ['nullable', 'integer', 'min:1'],
        ]);

        if (! $this->usageService->isKnownType($validated['type'])) {
            return response()->json(['message' => 'Unknown usage type.'], 422);
        }

        $workspace = $this->workspace($request);

        return response()->json([
            'data' => $this->usageService->check(
                $workspace,
                $validated['type'],
                (int) ($validated['quantity'] ?? 1)
            ),
        ]);
    }

    /**
     * Record a usage event for the workspace.
     *
     * @authenticated
     *
     * @bodyParam type string required One of: video_render, agent_generation.
     * @bodyParam quantity integer optional Quantity consumed (default 1).
     * @bodyParam metadata object optional Free-form metadata (e.g. render id).
     *
     * @response {
     *  "data": {"recorded": true, "usage": {"videos_per_month": {"count": 4, "limit": 30}}}
     * }
     */
    public function record(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', 'string'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'metadata' => ['nullable', 'array'],
        ]);

        if (! $this->usageService->isKnownType($validated['type'])) {
            return response()->json(['message' => 'Unknown usage type.'], 422);
        }

        $workspace = $this->workspace($request);

        $this->usageService->record(
            $workspace,
            $validated['type'],
            (int) ($validated['quantity'] ?? 1),
            $validated['metadata'] ?? []
        );

        return response()->json([
            'data' => [
                'recorded' => true,
                'usage' => $this->usageService->summary($workspace),
            ],
        ], 201);
    }

    private function workspace(Request $request): Workspace
    {
        return $request->attributes->get('workspace');
    }
}
