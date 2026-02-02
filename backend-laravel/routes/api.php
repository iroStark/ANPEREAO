<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\Admin\LegislationController;
use App\Http\Controllers\Api\Admin\SlideshowController;
use App\Http\Controllers\Api\Admin\GalleryController;
use App\Http\Controllers\Api\Admin\SocialOrgaoController;
use App\Http\Controllers\Api\Admin\UploadController;
use App\Http\Controllers\Api\Admin\MemberController;
use App\Http\Controllers\Api\Admin\ReportController;
use App\Http\Controllers\Api\Admin\ActivityPlanController;
use App\Http\Controllers\Api\Admin\ActivityPlanItemController;
use App\Http\Controllers\Api\Admin\ContactMessageController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\EventController;
use App\Http\Controllers\Api\Admin\NotificationController;
use App\Http\Controllers\Api\Admin\PublicationController;

Route::get('/login', function () {
    return response()->json(['error' => 'Unauthenticated.'], 401);
})->name('login');

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public Routes
Route::get('/slideshow', [PublicController::class, 'getSlideshow']);
Route::get('/members', [PublicController::class, 'getMembers']);
Route::post('/members/register', [PublicController::class, 'registerMember']); // Public Registration
Route::get('/social-organs', [SocialOrgaoController::class, 'index']);
Route::get('/gallery', [GalleryController::class, 'index']);
Route::get('/timeline-events', [PublicController::class, 'getTimelineEvents']); // Public Timeline
Route::get('/activity-plan', [PublicController::class, 'getActivityPlan']);
Route::get('/activity-plan/{id}', [PublicController::class, 'getActivityPlanById']);
Route::get('/events', [EventController::class, 'index']);
Route::get('/reports', [PublicController::class, 'getReports']);
Route::get('/legislation', [PublicController::class, 'getLegislation']);
Route::get('/legislation/{id}', [PublicController::class, 'getLegislationById']);
Route::get('/publications', [PublicController::class, 'getPublications']);
Route::get('/settings/{key}', [PublicController::class, 'getSetting']);
Route::post('/contact', [PublicController::class, 'submitContact']);

// Admin Authentication
Route::post('/auth/login', [AdminController::class, 'login']);
Route::post('/auth/logout', [AdminController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/auth/me', [AdminController::class, 'me'])->middleware('auth:sanctum');

// Protected Admin Routes
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::get('/stats', [AdminController::class, 'getStats']);
    Route::post('/upload', UploadController::class);

    // CRUD Operations
    Route::apiResource('members', MemberController::class);
    Route::apiResource('slideshow', SlideshowController::class);
    Route::apiResource('timeline-events', \App\Http\Controllers\Api\Admin\TimelineEventController::class); // Admin Timeline CRUD
    Route::apiResource('reports', ReportController::class);
    Route::apiResource('legislation', LegislationController::class);
    Route::apiResource('gallery', GalleryController::class);
    Route::apiResource('social-orgaos', SocialOrgaoController::class);
    Route::apiResource('activity-plan', ActivityPlanController::class);
    Route::apiResource('activity-plan-items', ActivityPlanItemController::class);
    Route::apiResource('contact-messages', ContactMessageController::class);
    Route::apiResource('users', UserController::class);
    Route::apiResource('events', EventController::class);
    Route::apiResource('publications', PublicationController::class);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/read', [NotificationController::class, 'markRead']);
});
