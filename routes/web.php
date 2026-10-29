
<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CampaignController;
use App\Http\Controllers\Admin\CandidacyController;
use App\Http\Controllers\VoteController;

Route::get('/', [CampaignController::class, 'home']);
Route::get('/campaigns/{campaign}', [
    CampaignController::class,
    'show',
])->name('campaigns.show');
Route::get('/campaigns/{campaign}/vote', [
    VoteController::class,
    'show',
])->name('campaigns.vote');

Route::post('/campaigns/{campaign}/vote', [
    VoteController::class,
    'store',
])->name('campaigns.vote.store');

Route::get('/campaigns/{campaign}/results', [
    CampaignController::class,
    'results',
])->name('campaigns.results');

Route::get(
    '/campaigns/{campaign}/candidates/{number}',
    [CandidacyController::class, 'searchByNumber']
)->name('campaigns.candidates.search');

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/users', [UserController::class, 'index'])
        ->name('admin.users.index');
    Route::middleware(['auth', 'admin'])->get('/admin', function () {
        return Inertia::render('admin/Dashboard');
    });
    Route::get('/admin/users/create', [UserController::class, 'create'])
        ->name('admin.users.create');

    Route::post('/admin/users', [UserController::class, 'store'])
        ->name('admin.users.store');

    Route::get('/admin/campaigns', [CampaignController::class, 'index'])
        ->name('admin.campaigns.index');

    Route::get('/admin/campaigns/create', [CampaignController::class, 'create'])
        ->name('admin.campaigns.create');

    Route::post('/admin/campaigns', [CampaignController::class, 'store'])
        ->name('admin.campaigns.store');

    Route::get(
        '/admin/candidacies/create',
        [CandidacyController::class, 'create']
    )->name('admin.candidacies.create');

    Route::get(
        '/admin/candidacies/search-users',
        [CandidacyController::class, 'searchUsers']
    )->name('admin.candidacies.search-users');

    Route::post(
        '/admin/candidacies',
        [CandidacyController::class, 'store']
    )->name('admin.candidacies.store');
});
