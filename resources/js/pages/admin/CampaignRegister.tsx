import Input from "@/components/ui/inputs";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import AdminLayout from "@/layoutes/AdminLayout";
import { Option } from "@/types/option-type";
import { useForm } from "@inertiajs/react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";

type CampaignStatus = "draft" | "published" | "closed";

type Props = {
    statuses: Option[];
    campaign?: Campaign;
};

export default function CampaignRegister({ statuses, campaign }: Props) {
    const form = useForm({
        title: campaign?.title || "",
        description: campaign?.description || "",
        image:  null as File | null,
        starts_at: campaign?.starts_at ||  "",
        ends_at: "",
        voting_starts_at: "",
        voting_ends_at: "",
        status: "draft" as CampaignStatus,
    });

    const [imagePreview, setImagePreview] = useState<string | null>(null);

    useEffect(() => {
        if (!form.data.image) {
            setImagePreview(null);
            return;
        }

        const previewUrl = URL.createObjectURL(form.data.image);
        setImagePreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [form.data.image]);

    function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;
        form.setData("image", file);
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post("/admin/campaigns", {
            forceFormData: true,
        });
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <p className="mb-2 text-sm text-slate-500">
                    Campanhas / Nova campanha
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Cadastrar campanha
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Configure as informações, a imagem e os períodos da campanha
                    e da votação.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
                {/* Informações gerais */}
                <section className="space-y-5 border-b border-slate-100 p-6 sm:p-8">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Informações gerais
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Defina o nome e a descrição da campanha.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="title"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Título
                        </label>

                        <Input
                            id="title"
                            value={form.data.title}
                            onChange={(event) =>
                                form.setData("title", event.target.value)
                            }
                            placeholder="Ex.: Eleição do conselho estudantil"
                            className="w-full"
                            required
                        />

                        {form.errors.title && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.errors.title}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Descrição
                        </label>

                        <textarea
                            id="description"
                            value={form.data.description}
                            onChange={(event) =>
                                form.setData("description", event.target.value)
                            }
                            placeholder="Descreva o objetivo desta campanha..."
                            rows={4}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />

                        {form.errors.description && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.errors.description}
                            </p>
                        )}
                    </div>
                </section>

                {/* Imagem da campanha */}
                <section className="space-y-5 border-b border-slate-100 p-6 sm:p-8">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Imagem da campanha
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Escolha uma imagem para identificar visualmente a
                            campanha.
                        </p>
                    </div>

                    <label
                        htmlFor="image"
                        className="group flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-primary hover:bg-blue-50/40"
                    >
                        {imagePreview ? (
                            <div className="w-full p-3">
                                <img
                                    src={imagePreview}
                                    alt="Prévia da imagem da campanha"
                                    className="max-h-72 w-full rounded-lg object-contain"
                                />

                                <p className="mt-3 text-center text-sm font-medium text-primary">
                                    Clique para trocar a imagem
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center px-6 py-10 text-center">
                                <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-white text-primary shadow-sm ring-1 ring-slate-200">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.7"
                                        className="size-7"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="18"
                                            height="18"
                                            rx="3"
                                        />
                                        <circle cx="8.5" cy="8.5" r="1.5" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="m21 15-5-5L5 21"
                                        />
                                    </svg>
                                </div>

                                <p className="text-sm font-semibold text-slate-800">
                                    Clique para selecionar uma imagem
                                </p>

                                <p className="mt-2 text-xs text-slate-500">
                                    PNG, JPG ou WebP
                                </p>
                            </div>
                        )}

                        <input
                            id="image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                            className="sr-only"
                        />
                    </label>

                    {form.data.image && (
                        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium text-slate-800">
                                    {form.data.image.name}
                                </p>

                                <p className="text-xs text-slate-500">
                                    {(
                                        form.data.image.size /
                                        1024 /
                                        1024
                                    ).toFixed(2)}{" "}
                                    MB
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    form.setData("image", null);

                                    const fileInput = document.getElementById(
                                        "image",
                                    ) as HTMLInputElement | null;

                                    if (fileInput) {
                                        fileInput.value = "";
                                    }
                                }}
                                className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700"
                            >
                                Remover
                            </button>
                        </div>
                    )}

                    {form.errors.image && (
                        <p className="text-sm text-red-600">
                            {form.errors.image}
                        </p>
                    )}
                </section>

                {/* Período da campanha, votação e status */}
                <section className="space-y-6 p-6 sm:p-8">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Períodos e publicação
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Configure o período da campanha e quando a votação
                            estará disponível.
                        </p>
                    </div>

                    {/* Período geral */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-slate-800">
                            Período da campanha
                        </h3>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="starts_at"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Data de início
                                </label>

                                <Input
                                    id="starts_at"
                                    type="datetime-local"
                                    value={form.data.starts_at}
                                    onChange={(event) =>
                                        form.setData(
                                            "starts_at",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full"
                                />

                                {form.errors.starts_at && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {form.errors.starts_at}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="ends_at"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Data de encerramento
                                </label>

                                <Input
                                    id="ends_at"
                                    type="datetime-local"
                                    value={form.data.ends_at}
                                    onChange={(event) =>
                                        form.setData(
                                            "ends_at",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full"
                                />

                                {form.errors.ends_at && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {form.errors.ends_at}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Período de votação */}
                    <div className="space-y-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-5">
                        <div>
                            <h3 className="font-semibold text-slate-900">
                                Período de votação
                            </h3>

                            <p className="mt-1 text-sm text-slate-600">
                                Defina quando os eleitores poderão registrar
                                seus votos.
                            </p>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="voting_starts_at"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Início da votação
                                </label>

                                <Input
                                    id="voting_starts_at"
                                    type="datetime-local"
                                    value={form.data.voting_starts_at}
                                    onChange={(event) =>
                                        form.setData(
                                            "voting_starts_at",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full"
                                />

                                {form.errors.voting_starts_at && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {form.errors.voting_starts_at}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="voting_ends_at"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Encerramento da votação
                                </label>

                                <Input
                                    id="voting_ends_at"
                                    type="datetime-local"
                                    value={form.data.voting_ends_at}
                                    onChange={(event) =>
                                        form.setData(
                                            "voting_ends_at",
                                            event.target.value,
                                        )
                                    }
                                    className="w-full"
                                />

                                {form.errors.voting_ends_at && (
                                    <p className="mt-1.5 text-sm text-red-600">
                                        {form.errors.voting_ends_at}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label
                            htmlFor="status"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Status
                        </label>

                        <Select
                            id="status"
                            value={form.data.status}
                            onChange={(event) =>
                                form.setData(
                                    "status",
                                    event.target.value as CampaignStatus,
                                )
                            }
                            options={statuses}
                            className="w-full"
                            required
                        />

                        {form.errors.status && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.errors.status}
                            </p>
                        )}
                    </div>
                </section>

                {/* Ações */}
                <div className="flex flex-col-reverse gap-3 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p className="text-xs text-slate-500">
                        A imagem e as datas são opcionais neste formulário.
                    </p>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <Button
                            type="button"
                            variant="secondary"
                            disabled={form.processing}
                            onClick={() => window.history.back()}
                        >
                            Cancelar
                        </Button>

                        <Button type="submit" disabled={form.processing}>
                            {form.processing
                                ? "Salvando..."
                                : "Cadastrar campanha"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

CampaignRegister.layout = (page: ReactNode) => <AdminLayout children={page} />;
