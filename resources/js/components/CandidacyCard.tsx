import { Participant } from "@/types/participant";

type Props = {
    participant: Participant;
};

export default function CandidacyCard({ participant }: Props) {
    return (
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
            <div className="flex flex-col sm:flex-row">
                <div className="flex shrink-0 items-center justify-center bg-slate-50 p-5 sm:w-56">
                    <img
                        src={`/storage/${participant.image_path}`}
                        alt={`Imagem de ${participant.user.name}`}
                        className="h-48 w-48 rounded-full object-cover sm:h-52 sm:w-52"
                    />
                </div>

                <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Participante
                            </p>
                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                                {participant.user.name}
                            </h2>
                        </div>

                        <span className="inline-flex shrink-0 items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
                            Nº {participant.number}
                        </span>
                    </div>

                    <div className="mt-5 border-t border-slate-100 pt-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                            Proposta
                        </h3>

                        <p className="mt-2 whitespace-pre-line break-words leading-7 text-slate-700">
                            {participant.proposal}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}
