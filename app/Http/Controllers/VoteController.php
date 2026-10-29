<?php

namespace App\Http\Controllers;

use App\Models\Campaign;
use App\Models\CampaignVoter;
use App\Models\Candidacy;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VoteController extends Controller
{
    public function show(Campaign $campaign)
    {
        return Inertia::render('campaigns/Vote', [
            'campaign' => $campaign,
        ]);
    }

    public function store(Request $request, Campaign $campaign)
    {
        $data = $request->validate([
            'cpf' => ['required', 'string', 'regex:/^\d{11}$/'],
            'number' => ['required', 'digits:2'],
        ]);

        return DB::transaction(function () use ($data, $campaign) {
            $now = now();

            // Busca o eleitor pelo CPF.
            $voter = User::where('cpf', $data['cpf'])
                ->lockForUpdate()
                ->first();

            // Se não existir, cria um eleitor com dados fictícios.
            if (!$voter) {
                $voter = User::create([
                    'name' => 'Eleitor ' . substr($data['cpf'], -4),
                    'email' => 'eleitor_' . $data['cpf'] . '@example.com',
                    'cpf' => $data['cpf'],
                    'role' => 'voter',
                    'password' => Hash::make(Str::random(40)),
                ]);
            }

            // Busca a candidatura na campanha.
            $candidacy = Candidacy::where('campaign_id', $campaign->id)
                ->where('number', $data['number'])
                ->first();

            if (!$candidacy) {
                throw ValidationException::withMessages([
                    'number' => 'Candidatura não encontrada.',
                ]);
            }

            // Impede votos duplicados.
            $alreadyVoted = CampaignVoter::where(
                'campaign_id',
                $campaign->id
            )
                ->where('voter_id', $voter->id)
                ->exists();

            if ($alreadyVoted) {
                throw ValidationException::withMessages([
                    'cpf' => 'Este eleitor já votou nesta campanha.',
                ]);
            }

            // Registra a participação do eleitor.
            CampaignVoter::create([
                'campaign_id' => $campaign->id,
                'voter_id' => $voter->id,
                'voted_at' => $now,
            ]);

            // Registra o voto.
            Vote::create([
                'campaign_id' => $campaign->id,
                'candidacy_id' => $candidacy->id,
            ]);

            return redirect('/')
                ->with('success', 'Voto registrado com sucesso!');
        });
    }
}
