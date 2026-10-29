<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CampaignStatus;
use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CampaignController extends Controller
{
    public function show(Campaign $campaign)
    {

        $participants = $campaign->candidacies()
            ->with('user:id,name')
            ->orderBy('number')
            ->get([
                'id',
                'campaign_id',
                'user_id',
                'number',
                'image_path',
                'proposal',
            ]);

        return Inertia::render('campaigns/CampaignDetails', [
            'campaign' => $campaign->only([
                'id',
                'title',
                'description',
                'starts_at',
                'ends_at',
                'status'
            ]),
            'participants' => $participants,
        ]);
    }

    public function index(): Response
    {
        return Inertia::render('admin/Campaigns', [
            'campaigns' => Campaign::query()
                ->latest()
                ->paginate(10),
        ]);
    }


    public function home()
    {
        $campaigns = Campaign::query()
            ->where('status', '!=', CampaignStatus::Draft->value)
            ->latest()
            ->get([
                'id',
                'title',
                'description',
                'image_path',
                'starts_at',
                'ends_at',
                'status',
            ]);

        return Inertia::render('Home', [
            'campaigns' => $campaigns,
        ]);
    }


    public function create(): Response
    {
        return Inertia::render('admin/CampaignRegister', [
            'statuses' => array_map(
                fn(CampaignStatus $status) => [
                    'value' => $status->value,
                    'label' => match ($status) {
                        CampaignStatus::Draft => 'Rascunho',
                        CampaignStatus::Published => 'Publicada',
                        CampaignStatus::InVote => 'Em votação',
                        CampaignStatus::Closed => 'Encerrada',
                    },
                ],
                CampaignStatus::cases(),
            ),
        ]);
    }


    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'voting_starts_at' => ['nullable', 'date'],
            'voting_ends_at' => [
                'nullable',
                'date',
                'after_or_equal:voting_starts_at',
            ],
            'status' => ['required', Rule::enum(CampaignStatus::class)],
        ]);

        $image = $data['image'] ?? null;
        unset($data['image']);

        if ($image) {
            $data['image_path'] = $image->store('campaigns', 'public');
        }

        Campaign::create($data);

        return to_route('admin.campaigns.index')
            ->with('success', 'Campanha criada com sucesso.');
    }



    public function results(\App\Models\Campaign $campaign)
    {
        abort_unless($campaign->status === \App\Enums\CampaignStatus::Closed, 404);

        $results = \App\Models\Candidacy::query()
            ->where('campaign_id', $campaign->id)
            ->with('user:id,name')
            ->withCount('votes')
            ->orderByDesc('votes_count')
            ->get();

        return \Inertia\Inertia::render('campaigns/Results', [
            'campaign' => $campaign,
            'results' => $results,
        ]);
    }
}
