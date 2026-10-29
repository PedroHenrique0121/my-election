
import Button from "@/components/ui/Button";
import AdminLayout from "@/layoutes/AdminLayout";
import { Campaign } from "@/types/campaign";
import { Link } from "@inertiajs/react";
import type { ReactNode } from "react";

type PaginatedCampaigns = {
    data: Campaign[];
    current_page: number;
    last_page: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

type Props = {
    campaigns: PaginatedCampaigns;
};

const statusLabels: Record<Campaign["status"], string> = {
    draft: "Rascunho",
    published: "Publicada",
    closed: "Encerrada",
    in_vote: "Eem votação",
};

const statusStyles: Record<Campaign["status"], string> = {
    draft: "bg-amber-50 text-amber-700",
    published: "bg-emerald-50 text-emerald-700",
    closed: "bg-slate-100 text-slate-600",
    in_vote: "bg-blue text-white"
};

function formatDate(value: string | null) {
    if (!value) return "Não definida";

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function Campaigns({ campaigns }: Props) {
    return (
        <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Campanhas
                    </h1>

                    <p className="mt-2 text-sm text-slate-500">
                        Gerencie e acompanhe as campanhas cadastradas.
                    </p>
                </div>

                <Link href="/admin/campaigns/create">
                    <Button type="button">
                        + Nova campanha
                    </Button>
                </Link>
            </div>

            {/* Campaigns table */}
            <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h2 className="font-semibold text-slate-900">
                        Todas as campanhas
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        {campaigns.data.length} campanha(s) nesta página
                    </p>
                </div>

                {campaigns.data.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                        <h3 className="font-semibold text-slate-900">
                            Nenhuma campanha cadastrada
                        </h3>

                        <p className="mt-2 text-sm text-slate-500">
                            Cadastre a primeira campanha para começar.
                        </p>

                        <div className="mt-5">
                            <Link href="/admin/campaigns/create">
                                <Button type="button">
                                    Cadastrar campanha
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[800px] text-left text-sm">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">
                                            Campanha
                                        </th>

                                        <th className="px-6 py-3 font-medium">
                                            Status
                                        </th>

                                        <th className="px-6 py-3 font-medium">
                                            Início
                                        </th>

                                        <th className="px-6 py-3 font-medium">
                                            Encerramento
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-100">
                                    {campaigns.data.map((campaign) => (
                                        <tr
                                            key={campaign.id}
                                            className="hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    {campaign.image_path ? (
                                                        <img
                                                            src={`/storage/${campaign.image_path}`}
                                                            alt={campaign.title}
                                                            width={40}
                                                            height={40}
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                minWidth: "40px",
                                                                maxWidth: "40px",
                                                                minHeight: "40px",
                                                                maxHeight: "40px",
                                                                objectFit: "contain",
                                                                flexShrink: 0,
                                                            }}
                                                            className="rounded-md border border-slate-200"
                                                        />
                                                    ) : (
                                                        <div
                                                            style={{
                                                                width: "40px",
                                                                height: "40px",
                                                                minWidth: "40px",
                                                                maxWidth: "40px",
                                                                minHeight: "40px",
                                                                maxHeight: "40px",
                                                                flexShrink: 0,
                                                            }}
                                                            className="flex items-center justify-center rounded-md bg-slate-100 text-center text-[10px] text-slate-500"
                                                        >
                                                            Sem imagem
                                                        </div>
                                                    )}

                                                    <div className="min-w-0">
                                                        <p className="font-medium text-slate-900">
                                                            {campaign.title}
                                                        </p>

                                                        <p className="mt-1 max-w-sm truncate text-slate-500">
                                                            {campaign.description ||
                                                                "Sem descrição"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyles[campaign.status]}`}
                                                >
                                                    {statusLabels[campaign.status]}
                                                </span>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                                {formatDate(campaign.starts_at)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                                                {formatDate(campaign.ends_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {campaigns.last_page > 1 && (
                            <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-slate-500">
                                    Página {campaigns.current_page} de{" "}
                                    {campaigns.last_page}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {campaigns.links.map((link, index) => (
                                        <Link
                                            key={`${link.label}-${index}`}
                                            href={link.url ?? "#"}
                                            preserveScroll
                                            onClick={(event) => {
                                                if (!link.url) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            className={`rounded-md border px-3 py-2 text-sm ${
                                                link.active
                                                    ? "border-primary bg-primary text-white"
                                                    : link.url
                                                      ? "border-slate-200 text-slate-700 hover:bg-slate-50"
                                                      : "cursor-not-allowed border-slate-100 text-slate-300"
                                            }`}
                                        >
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: link.label,
                                                }}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

Campaigns.layout = (page: ReactNode) => (
    <AdminLayout children={page} />
);
