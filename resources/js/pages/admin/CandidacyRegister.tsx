import { useEffect, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";

import Input from "@/components/ui/inputs";
import Button from "@/components/ui/Button";
import AdminLayout from "@/layoutes/AdminLayout";

type Campaign = {
    id: number;
    title: string;
};

type Candidate = {
    id: number;
    name: string;
    email: string;
};

type Props = {
    campaigns: Campaign[];
};

export default function CandidacyRegister({ campaigns }: Props) {
    const form = useForm({
        campaign_id: "",
        user_id: "",
        number: "",
        proposal: "",
        image: null as File | null,
    });

    const [search, setSearch] = useState("");
    const [selectedCandidate, setSelectedCandidate] =
        useState<Candidate | null>(null);
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [searching, setSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [searchError, setSearchError] = useState("");
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

    useEffect(() => {
        const term = search.trim();

        if (term.length < 2 || selectedCandidate) {
            setCandidates([]);
            setSearching(false);
            setSearchError("");
            return;
        }

        const controller = new AbortController();

        const timeout = window.setTimeout(async () => {
            setSearching(true);
            setSearchError("");

            try {
                const response = await fetch(
                    `/admin/candidacies/search-users?search=${encodeURIComponent(term)}`,
                    {
                        headers: {
                            Accept: "application/json",
                        },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    throw new Error("Não foi possível buscar os candidatos.");
                }

                const result: Candidate[] = await response.json();

                setCandidates(result);
                setShowResults(true);
            } catch (error) {
                if (error instanceof Error && error.name !== "AbortError") {
                    setSearchError(error.message);
                    setCandidates([]);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setSearching(false);
                }
            }
        }, 300);

        return () => {
            window.clearTimeout(timeout);
            controller.abort();
        };
    }, [search, selectedCandidate]);

    function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;
        form.setData("image", file);
    }

    function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;

        setSearch(value);
        setSelectedCandidate(null);
        form.setData("user_id", "");
        setShowResults(value.trim().length >= 2);
        setSearchError("");
    }

    function selectCandidate(candidate: Candidate) {
        setSelectedCandidate(candidate);
        setSearch(candidate.name);
        form.setData("user_id", String(candidate.id));
        setCandidates([]);
        setShowResults(false);
    }

    function removeImage() {
        form.setData("image", null);

        const fileInput = document.getElementById(
            "image",
        ) as HTMLInputElement | null;

        if (fileInput) {
            fileInput.value = "";
        }
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        form.post("/admin/candidacies", {
            forceFormData: true,
        });
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <p className="mb-2 text-sm text-slate-500">
                    Candidaturas / Nova candidatura
                </p>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Cadastrar candidatura
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Configure a campanha, selecione o candidato e informe os
                    dados da candidatura.
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
                            Defina a campanha e o candidato desta candidatura.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="campaign_id"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Campanha
                        </label>

                        <select
                            id="campaign_id"
                            value={form.data.campaign_id}
                            onChange={(event) =>
                                form.setData("campaign_id", event.target.value)
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                            required
                        >
                            <option value="">Selecione uma campanha</option>

                            {campaigns.map((campaign) => (
                                <option key={campaign.id} value={campaign.id}>
                                    {campaign.title}
                                </option>
                            ))}
                        </select>

                        {form.errors.campaign_id && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.errors.campaign_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="candidate_search"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Candidato
                        </label>

                        <div className="relative">
                            <Input
                                id="candidate_search"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder="Digite o nome ou e-mail do candidato..."
                                className="w-full"
                                autoComplete="off"
                            />

                            {showResults &&
                                !selectedCandidate &&
                                search.trim().length >= 2 && (
                                    <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                                        {searching && (
                                            <p className="p-3 text-sm text-slate-500">
                                                Buscando candidatos...
                                            </p>
                                        )}

                                        {!searching &&
                                            !searchError &&
                                            candidates.length === 0 && (
                                                <p className="p-3 text-sm text-slate-500">
                                                    Nenhum candidato encontrado.
                                                </p>
                                            )}

                                        {candidates.map((candidate) => (
                                            <button
                                                key={candidate.id}
                                                type="button"
                                                onClick={() =>
                                                    selectCandidate(candidate)
                                                }
                                                className="block w-full border-b border-slate-100 px-4 py-3 text-left last:border-0 hover:bg-slate-50"
                                            >
                                                <span className="block text-sm font-medium text-slate-800">
                                                    {candidate.name}
                                                </span>

                                                <span className="mt-0.5 block text-xs text-slate-500">
                                                    {candidate.email}
                                                </span>
                                            </button>
                                        ))}

                                        {searchError && (
                                            <p className="p-3 text-sm text-red-600">
                                                {searchError}
                                            </p>
                                        )}
                                    </div>
                                )}
                        </div>

                        {selectedCandidate && (
                            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-4 py-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-slate-800">
                                        {selectedCandidate.name}
                                    </p>

                                    <p className="truncate text-xs text-slate-500">
                                        {selectedCandidate.email}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCandidate(null);
                                        setSearch("");
                                        form.setData("user_id", "");
                                        setShowResults(false);
                                    }}
                                    className="shrink-0 text-sm font-medium text-primary hover:underline"
                                >
                                    Alterar
                                </button>
                            </div>
                        )}

                        <p className="mt-1.5 text-xs text-slate-500">
                            Digite pelo menos 2 caracteres para pesquisar.
                        </p>

                        {form.errors.user_id && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.errors.user_id}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="number"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Número da candidatura
                        </label>

                        <Input
                            id="number"
                            type="number"
                            value={form.data.number}
                            onChange={(event) =>
                                form.setData("number", event.target.value)
                            }
                            placeholder="Ex.: 13"
                            className="w-full"
                            required
                        />

                        {form.errors.number && (
                            <p className="mt-1.5 text-sm text-red-600">
                                {form.errors.number}
                            </p>
                        )}
                    </div>
                </section>

                {/* Imagem */}
                <section className="space-y-5 border-b border-slate-100 p-6 sm:p-8">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Foto da candidatura
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Escolha uma imagem para identificar visualmente o
                            candidato.
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
                                    alt="Prévia da foto da candidatura"
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
                                    PNG, JPG ou WebP · Máximo de 2 MB
                                </p>
                            </div>
                        )}

                        <input
                            id="image"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                            className="sr-only"
                            required
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
                                onClick={removeImage}
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

                {/* Proposta */}
                <section className="space-y-5 p-6 sm:p-8">
                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Proposta
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Descreva os objetivos e as propostas do candidato.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="proposal"
                            className="mb-2 block text-sm font-medium text-slate-700"
                        >
                            Descrição da proposta
                        </label>

                        <textarea
                            id="proposal"
                            value={form.data.proposal}
                            onChange={(event) =>
                                form.setData("proposal", event.target.value)
                            }
                            placeholder="Descreva o objetivo e as propostas do candidato..."
                            rows={5}
                            maxLength={10000}
                            required
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/10"
                        />

                        <div className="mt-1.5 flex items-start justify-between gap-3">
                            {form.errors.proposal ? (
                                <p className="text-sm text-red-600">
                                    {form.errors.proposal}
                                </p>
                            ) : (
                                <span />
                            )}

                            <p className="shrink-0 text-xs text-slate-400">
                                {form.data.proposal.length}/10000
                            </p>
                        </div>
                    </div>
                </section>

                {/* Ações */}
                <div className="flex flex-col-reverse gap-3 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p className="text-xs text-slate-500">
                        Confira os dados antes de cadastrar.
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

                        <Button
                            type="submit"
                            disabled={form.processing || !form.data.user_id}
                        >
                            {form.processing
                                ? "Salvando..."
                                : "Cadastrar candidatura"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

CandidacyRegister.layout = (page: ReactNode) => (
    <AdminLayout>{page}</AdminLayout>
);
