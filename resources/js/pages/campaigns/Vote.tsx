
import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

type Candidate = {
    id: number;
    number: string | number;
    image_path: string | null;
    user: {
        name: string;
    };
};

type Campaign = {
    id: number;
    title: string;
};

type Props = {
    campaign: Campaign;
};

export default function Vote({ campaign }: Props) {
    const [digits, setDigits] = useState(['', '']);
    const [cpf, setCpf] = useState('');
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const number = digits.join('');

    function handleDigitChange(index: number, value: string) {
        const digit = value.replace(/\D/g, '').slice(-1);

        setDigits((current) =>
            current.map((item, i) => (i === index ? digit : item)),
        );

        setCandidate(null);
        setError('');
        setSuccess('');

        if (digit && index === 0) {
            inputRefs.current[1]?.focus();
        }
    }

    useEffect(() => {
        if (number.length !== 2) {
            setCandidate(null);
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        async function searchCandidate() {
            setLoading(true);
            setError('');

            try {
                const response = await fetch(
                    `/campaigns/${campaign.id}/candidates/${number}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                        signal: controller.signal,
                    },
                );

                if (!response.ok) {
                    setCandidate(null);
                    setError(
                        response.status === 404
                            ? 'Candidato não encontrado nesta campanha.'
                            : 'Não foi possível consultar o candidato.',
                    );
                    return;
                }

                const data: Candidate = await response.json();
                setCandidate(data);
            } catch (exception) {
                if (
                    exception instanceof Error &&
                    exception.name !== 'AbortError'
                ) {
                    setCandidate(null);
                    setError('Erro ao consultar o candidato.');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        searchCandidate();

        return () => controller.abort();
    }, [number, campaign.id]);

    function handleConfirmVote() {
        const cleanCpf = cpf.replace(/\D/g, '');

        if (!candidate) {
            setError('Selecione um candidato antes de votar.');
            return;
        }

        if (cleanCpf.length !== 11) {
            setError('Informe os 11 números do CPF do eleitor.');
            return;
        }

        setError('');
        setSuccess('');
        setSubmitting(true);

        router.post(
            `/campaigns/${campaign.id}/vote`,
            {
                cpf: cleanCpf,
                number,
            },
            {
                onSuccess: () => {
                    setSuccess('Voto registrado com sucesso!');
                    setDigits(['', '']);
                    setCandidate(null);
                    setCpf('');
                },
                onError: (errors) => {
                    setError(
                        errors.cpf ||
                            errors.number ||
                            'Não foi possível registrar o voto.',
                    );
                },
                onFinish: () => {
                    setSubmitting(false);
                },
            },
        );
    }

    return (
        <>
            <Head title={`Urna - ${campaign.title}`} />

            <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
                <section className="w-full max-w-2xl overflow-hidden rounded-xl border border-gray-300 bg-white shadow-lg">
                    <header className="bg-green-700 px-6 py-4 text-white">
                        <h1 className="text-xl font-bold">
                            URNA ELETRÔNICA
                        </h1>

                        <p className="text-sm">{campaign.title}</p>
                    </header>

                    <div className="grid gap-6 p-6 sm:grid-cols-[1fr_220px]">
                        <div className="flex min-h-64 flex-col justify-center border border-gray-300 bg-gray-50 p-5">
                            <label
                                htmlFor="cpf"
                                className="mb-2 text-sm font-medium text-gray-800"
                            >
                                CPF do eleitor
                            </label>

                            <input
                                id="cpf"
                                type="text"
                                inputMode="numeric"
                                autoComplete="off"
                                maxLength={11}
                                value={cpf}
                                onChange={(event) => {
                                    setCpf(
                                        event.target.value
                                            .replace(/\D/g, '')
                                            .slice(0, 11),
                                    );
                                    setError('');
                                    setSuccess('');
                                }}
                                placeholder="Digite os 11 números"
                                className="mb-6 w-full rounded border border-gray-400 bg-white px-3 py-2 text-gray-900 outline-none focus:border-green-600"
                            />

                            <p className="mb-4 text-lg font-medium text-gray-900">
                                Digite o número do candidato
                            </p>

                            <div className="flex gap-2">
                                {digits.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(element) => {
                                            inputRefs.current[index] = element;
                                        }}
                                        aria-label={`Dígito ${index + 1}`}
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(event) =>
                                            handleDigitChange(
                                                index,
                                                event.target.value,
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === 'Backspace' &&
                                                !digits[index] &&
                                                index > 0
                                            ) {
                                                inputRefs.current[
                                                    index - 1
                                                ]?.focus();
                                            }
                                        }}
                                        className="h-12 w-12 border-2 border-gray-800 bg-white text-center text-xl font-bold text-gray-900 outline-none focus:border-green-600"
                                    />
                                ))}
                            </div>

                            <p className="mt-4 text-sm text-gray-500">
                                Número: {number || '--'}
                            </p>

                            {loading && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Buscando candidato...
                                </p>
                            )}

                            {error && (
                                <p
                                    role="alert"
                                    className="mt-2 text-sm text-red-600"
                                >
                                    {error}
                                </p>
                            )}

                            {success && (
                                <p
                                    role="status"
                                    className="mt-2 text-sm text-green-700"
                                >
                                    {success}
                                </p>
                            )}

                            {candidate && (
                                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3">
                                    <p className="text-xs font-semibold uppercase text-green-700">
                                        Candidato encontrado
                                    </p>

                                    <p className="mt-1 font-bold text-gray-900">
                                        {candidate.user.name}
                                    </p>
                                </div>
                            )}
                        </div>

                        <aside className="flex flex-col items-center justify-center rounded-lg bg-gray-900 p-5 text-white">
                            {candidate?.image_path ? (
                                <img
                                    src={`/storage/${candidate.image_path}`}
                                    alt={candidate.user.name}
                                    className="mb-4 size-28 rounded-full object-cover"
                                />
                            ) : (
                                <div className="mb-4 flex size-28 items-center justify-center rounded-full bg-gray-700 text-4xl">
                                    👤
                                </div>
                            )}

                            <p className="text-center text-sm text-gray-300">
                                {candidate
                                    ? `Número ${candidate.number}`
                                    : 'Foto do candidato'}
                            </p>

                            <p className="mt-2 text-center font-semibold">
                                {candidate
                                    ? candidate.user.name
                                    : 'Aguardando número'}
                            </p>
                        </aside>
                    </div>

                    <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-6 py-4">
                        <p className="text-sm text-gray-500">
                            Confira os dados antes de confirmar seu voto.
                        </p>

                        <button
                            type="button"
                            disabled={
                                !candidate ||
                                loading ||
                                submitting ||
                                cpf.replace(/\D/g, '').length !== 11
                            }
                            onClick={handleConfirmVote}
                            className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                        >
                            {submitting
                                ? 'REGISTRANDO...'
                                : 'CONFIRMAR VOTO'}
                        </button>
                    </footer>
                </section>
            </main>
        </>
    );
}
