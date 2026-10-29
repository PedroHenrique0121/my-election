import { Head, Link } from "@inertiajs/react";
import { Campaign } from "@/types/campaign";

type CandidateResult = {
    id: number;
    number: string | number;
    image_path: string | null;
    user: {
        name: string;
    };
    votes_count: number;
};

type Props = {
    campaign: Campaign;
    results: CandidateResult[];
};

export default function Results({ campaign, results }: Props) {
    const totalVotes = results.reduce(
        (total, candidate) => total + candidate.votes_count,
        0,
    );

    return (
        <>
            <Head title={`Resultados - ${campaign.title}`} />

            <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl">
                    <Link
                        href={`/campaigns/${campaign.id}`}
                        className="text-sm font-medium text-blue-700 hover:underline"
                    >
                        ← Voltar para a campanha
                    </Link>

                    <header className="mt-6 rounded-2xl bg-slate-950 p-8 text-white shadow-lg sm:p-10">
                        <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">
                            Apuração oficial
                        </p>

                        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
                            Resultados da votação
                        </h1>

                        <p className="mt-3 text-slate-300">{campaign.title}</p>

                        <div className="mt-6 border-t border-white/15 pt-5">
                            <p className="text-sm text-slate-400">
                                Total de votos
                            </p>
                            <p className="mt-1 text-3xl font-bold">
                                {totalVotes}
                            </p>
                        </div>
                    </header>

                    <section className="mt-8">
                        <h2 className="mb-4 text-xl font-bold text-slate-900">
                            Classificação dos candidatos
                        </h2>

                        {results.length === 0 ? (
                            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                                Nenhuma candidatura encontrada nesta campanha.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {results.map((candidate, index) => {
                                    const percentage =
                                        totalVotes > 0
                                            ? (candidate.votes_count /
                                                  totalVotes) *
                                              100
                                            : 0;

                                    return (
                                        <article
                                            key={candidate.id}
                                            className={`rounded-2xl border bg-white p-5 shadow-sm sm:p-6 ${
                                                index === 0
                                                    ? "border-amber-300 ring-1 ring-amber-200"
                                                    : "border-slate-200"
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-700">
                                                    {index + 1}º
                                                </div>

                                                {candidate.image_path ? (
                                                    <img
                                                        src={`/storage/${candidate.image_path}`}
                                                        alt={
                                                            candidate.user.name
                                                        }
                                                        className="size-16 shrink-0 rounded-xl object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-2xl">
                                                        👤
                                                    </div>
                                                )}

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Número{" "}
                                                        {candidate.number}
                                                    </p>

                                                    <h3 className="mt-1 truncate text-lg font-bold text-slate-900">
                                                        {candidate.user.name}
                                                    </h3>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-2xl font-bold tabular-nums text-slate-900">
                                                        {candidate.votes_count}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {candidate.votes_count ===
                                                        1
                                                            ? "voto"
                                                            : "votos"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <div className="mb-2 flex justify-between text-sm text-slate-500">
                                                    <span>
                                                        Percentual dos votos
                                                    </span>
                                                    <span className="font-semibold text-slate-700">
                                                        {percentage.toLocaleString(
                                                            "pt-BR",
                                                            {
                                                                maximumFractionDigits: 1,
                                                                minimumFractionDigits: 1,
                                                            },
                                                        )}
                                                        %
                                                    </span>
                                                </div>

                                                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            index === 0
                                                                ? "bg-amber-500"
                                                                : "bg-blue-600"
                                                        }`}
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>

                    <p className="mt-8 text-center text-sm text-slate-500">
                        Os percentuais são calculados com base no total de votos
                        registrados nesta campanha.
                    </p>
                </div>
            </main>
        </>
    );
}
