
import { useState } from "react";
import { Link } from "@inertiajs/react";
import { format } from "date-fns";
import { Campaign } from "@/types/campaign";

type Props = {
    campaigns: Campaign[];
};

export default function CampaignCarousel({ campaigns }: Props) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (campaigns.length === 0) {
        return (
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-slate-900">
                    Campanhas em destaque
                </h2>
                <p className="mt-3 text-slate-500">
                    Não há campanhas disponíveis no momento.
                </p>
            </section>
        );
    }

    const campaign = campaigns[activeIndex];
    const status = String(campaign.status).toLowerCase();

    function previous() {
        setActiveIndex((current) =>
            current === 0 ? campaigns.length - 1 : current - 1,
        );
    }

    function next() {
        setActiveIndex((current) =>
            current === campaigns.length - 1 ? 0 : current + 1,
        );
    }

    return (
        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Em destaque
                </span>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">
                    Conheça as campanhas
                </h2>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-slate-950 shadow-xl">
                <div className="grid min-h-[400px] md:grid-cols-2">
                    <div className="relative min-h-64 bg-slate-800 md:order-2 md:min-h-[440px]">
                        {campaign.image_path ? (
                            <img
                                src={`/storage/${campaign.image_path}`}
                                alt={campaign.title}
                                className="absolute inset-0 h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full min-h-64 items-center justify-center text-slate-400">
                                Sem imagem disponível
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                    </div>

                    <div className="flex flex-col justify-center p-7 text-white sm:p-10 lg:p-14">
                        <p className="text-sm font-medium text-blue-300">
                            Campanha {activeIndex + 1} de {campaigns.length}
                        </p>

                        <h3 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">
                            {campaign.title}
                        </h3>

                        <p className="mt-4 line-clamp-4 leading-7 text-slate-300">
                            {campaign.description ||
                                "Conheça os objetivos e as propostas desta campanha."}
                        </p>

                        {campaign.ends_at && (
                            <p className="mt-4 text-sm text-slate-400">
                                Encerramento:{" "}
                                {format(new Date(campaign.ends_at), "dd/MM/yyyy")}
                            </p>
                        )}

                        <div className="mt-8">
                            {status === "published" && (
                                <Link
                                    href={`/campaigns/${campaign.id}`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-blue-50"
                                >
                                    Ver participantes →
                                </Link>
                            )}

                            {status === "in_vote" && (
                                <Link
                                    href={`/campaigns/${campaign.id}/vote`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
                                >
                                    Votar →
                                </Link>
                            )}

                            {status === "closed" && (
                                <Link
                                    href={`/campaigns/${campaign.id}/results`}
                                    className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-blue-50"
                                >
                                    Ver resultados →
                                </Link>
                            )}

                            {!["published", "in_vote", "closed"].includes(status) && (
                                <p className="text-sm text-amber-300">
                                    Status da campanha: {status}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {campaigns.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={previous}
                            aria-label="Campanha anterior"
                            className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-slate-900 shadow hover:bg-white sm:left-5"
                        >
                            ←
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            aria-label="Próxima campanha"
                            className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-slate-900 shadow hover:bg-white sm:right-5"
                        >
                            →
                        </button>
                    </>
                )}
            </div>

            {campaigns.length > 1 && (
                <div className="mt-5 flex justify-center gap-2">
                    {campaigns.map((item, index) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Mostrar campanha ${index + 1}`}
                            aria-current={index === activeIndex ? "true" : undefined}
                            className={`h-2.5 rounded-full transition-all ${
                                index === activeIndex
                                    ? "w-8 bg-primary"
                                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                            }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
