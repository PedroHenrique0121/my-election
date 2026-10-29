<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\Candidacy;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CandidacyController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('admin/CandidacyRegister', [
            'campaigns' => Campaign::query()
                ->where('status', 'published')
                ->orderBy('title')
                ->get(['id', 'title']),
        ]);
    }

    public function searchUsers(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'search' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        $search = $validated['search'];

        $users = User::query()
            ->where('role', 'candidate')
            ->where(function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->orderBy('name')
            ->limit(10)
            ->get(['id', 'name', 'email']);

        return response()->json($users);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'campaign_id' => [
                'required',
                'integer',
                Rule::exists('campaigns', 'id')
                    ->where('status', 'published'),
            ],
            'user_id' => [
                'required',
                'integer',
                Rule::exists('users', 'id')
                    ->where('role', 'candidate'),
                Rule::unique('candidacies', 'user_id')
                    ->where('campaign_id', $request->input('campaign_id')),
            ],
            'number' => [
                'required',
                'integer',
                'min:1',
                Rule::unique('candidacies', 'number')
                    ->where('campaign_id', $request->input('campaign_id')),
            ],
            'proposal' => ['required', 'string', 'max:10000'],
            'image' => [
                'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ], [
            'campaign_id.required' => 'Selecione uma campanha.',
            'campaign_id.exists' => 'A campanha selecionada não está disponível.',
            'user_id.required' => 'Selecione um candidato.',
            'user_id.exists' => 'O candidato selecionado não é válido.',
            'user_id.unique' => 'Esse candidato já possui candidatura nesta campanha.',
            'number.required' => 'Informe o número da candidatura.',
            'number.unique' => 'Esse número já está sendo usado nesta campanha.',
            'proposal.required' => 'Informe a proposta do candidato.',
            'image.required' => 'Selecione uma foto para a candidatura.',
            'image.image' => 'O arquivo precisa ser uma imagem válida.',
            'image.mimes' => 'A foto deve estar no formato JPG, PNG ou WEBP.',
            'image.max' => 'A foto deve ter no máximo 2 MB.',
        ]);

        $imagePath = $request->file('image')->store(
            'candidacies',
            'public'
        );

        try {
            Candidacy::create([
                'campaign_id' => $validated['campaign_id'],
                'user_id' => $validated['user_id'],
                'number' => $validated['number'],
                'proposal' => $validated['proposal'],
                'image_path' => $imagePath,
            ]);
        } catch (\Throwable $exception) {
            Storage::disk('public')->delete($imagePath);

            throw $exception;
        }

        return redirect()
            ->route('admin.candidacies.create')
            ->with('success', 'Candidatura cadastrada com sucesso!');
    }

    public function searchByNumber(Campaign $campaign, string $number)
    {
        abort_unless(preg_match('/^\d{2}$/', $number), 404);

        $candidate = Candidacy::query()
            ->where('campaign_id', $campaign->id)
            ->where('number', $number)
            ->with('user:id,name')
            ->first();

        if (!$candidate) {
            return response()->json([
                'message' => 'Candidato não encontrado.',
            ], 404);
        }

        return response()->json([
            'id' => $candidate->id,
            'number' => $candidate->number,
            'image_path' => $candidate->image_path,
            'user' => [
                'name' => $candidate->user->name,
            ],
        ]);
    }
}
