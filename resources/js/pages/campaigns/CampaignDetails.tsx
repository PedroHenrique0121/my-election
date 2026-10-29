import { Link } from "@inertiajs/react";
import CandidacyCard from "@/components/CandidacyCard";
import { Participant } from "@/types/participant";
import { Campaign } from "@/types/campaign";

type Props = {
    campaign: Campaign;
    participants: Participant[];
};

export default function Show({ campaign, participants }: Props) {
    return (
        <main className="min-h-screen bg-slate-50">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                    <span aria-hidden="true">←</span>
                    Voltar para a página inicial
                </Link>

                <header className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                        Detalhes da campanha
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                        {campaign.title}
                    </h1>

                    {campaign.description && (
                        <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">
                            {campaign.description}
                        </p>
                    )}
                </header>

                <section className="mt-10">
                    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">
                                Participantes
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Conheça os participantes e suas propostas.
                            </p>
                        </div>

                        <span className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
                            {participants.length}{" "}
                            {participants.length === 1
                                ? "participante"
                                : "participantes"}
                        </span>
                    </div>

                    {participants.length > 0 ? (
                        <div className="flex flex-col gap-5">
                            {participants.map((participant) => (
                                <CandidacyCard
                                    key={participant.id}
                                    participant={participant}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                            <h3 className="text-lg font-semibold text-slate-800">
                                Nenhum participante ainda
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Os participantes desta campanha aparecerão aqui.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
