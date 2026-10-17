<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/*
|--------------------------------------------------------------------------
| Workspace API v1 (authenticated via workspace API keys)
|--------------------------------------------------------------------------
|
| These routes are authenticated using the wsk_ workspace API keys
| generated in the workspace settings. Each route requires the
| api-key middleware with the appropriate scope.
|
*/
use App\Http\Controllers\Api\V1\UsageController;
use App\Http\Controllers\Api\V1\WorkspaceController;

Route::prefix('v1')->middleware('api-key:read')->group(function () {
    Route::get('/workspace', [WorkspaceController::class, 'show']);
    Route::get('/members', [WorkspaceController::class, 'members']);
    Route::get('/usage/summary', [UsageController::class, 'summary']);
    Route::post('/usage/check', [UsageController::class, 'check']);
});

Route::prefix('v1')->middleware('api-key:write')->group(function () {
    Route::post('/usage/record', [UsageController::class, 'record']);
});
