<?php

namespace App\Models;

use App\Enums\CampaignStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Campaign extends Model
{
    protected $fillable = [
        'title',
        'description',
        'image_path',
        'starts_at',
        'ends_at',
        'voting_starts_at',
        'voting_ends_at',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'voting_starts_at' => 'datetime',
            'voting_ends_at' => 'datetime',
            'status' => CampaignStatus::class,
        ];
    }

    public function candidacies(): HasMany
    {
        return $this->hasMany(Candidacy::class);
    }

    public function campaignVoters(): HasMany
    {
        return $this->hasMany(CampaignVoter::class);
    }
}
