<?php

namespace App\Enums;

enum CampaignStatus: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Closed = 'closed';
    case InVote = 'in_vote';
}
