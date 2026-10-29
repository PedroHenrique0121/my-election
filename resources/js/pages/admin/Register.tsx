import Input from "@/components/ui/inputs";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import AdminLayout from "@/layoutes/AdminLayout";
import { Option } from "@/types/option-type";
import { useForm } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";

type UserRole = "admin" | "candidate" | "voter";

export default function Register() {
    const form = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "voter" as UserRole,
    });

    const roles: Option[] = [
        { label: "Administrador", value: "admin" },
        { label: "Eleitor", value: "voter" },
        { label: "Candidato", value: "candidate" },
    ];

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        form.post("/admin/users");
    }

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Page header */}
            <div>
                <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                    <span>Usuários</span>
                    <span>/</span>
                    <span className="text-primary">Novo usuário</span>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Cadastrar usuário
                </h1>

                <p className="mt-2 text-sm text-slate-500">
                    Preencha os dados abaixo para adicionar um novo usuário à
                    plataforma.
                </p>
            </div>

            {/* Form card */}
            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
                {/* Personal information */}
                <div className="border-b border-slate-100 p-6 sm:p-8">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="size-5"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m6-10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-3v6m3-3h-6"
                                />
                            </svg>
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Informações do usuário
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Dados básicos para identificação e acesso.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Nome completo
                            </label>

                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={(event) =>
                                    form.setData("name", event.target.value)
                                }
                                placeholder="Ex.: João da Silva"
                                autoComplete="name"
                                className="w-full"
                                required
                            />

                            {form.errors.name && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                E-mail
                            </label>

                            <Input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={(event) =>
                                    form.setData("email", event.target.value)
                                }
                                placeholder="usuario@exemplo.com"
                                autoComplete="email"
                                className="w-full"
                                required
                            />

                            {form.errors.email && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {form.errors.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Access information */}
                <div className="border-b border-slate-100 p-6 sm:p-8">
                    <div className="mb-6 flex items-start gap-4">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="size-5"
                            >
                                <rect
                                    width="16"
                                    height="11"
                                    x="4"
                                    y="10"
                                    rx="2"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"
                                />
                            </svg>
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Segurança e acesso
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Defina a senha e o nível de acesso do usuário.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Senha
                            </label>

                            <Input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={(event) =>
                                    form.setData("password", event.target.value)
                                }
                                placeholder="Digite uma senha"
                                autoComplete="new-password"
                                className="w-full"
                                required
                            />

                            {form.errors.password && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {form.errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Confirmar senha
                            </label>

                            <Input
                                id="password_confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={(event) =>
                                    form.setData(
                                        "password_confirmation",
                                        event.target.value,
                                    )
                                }
                                placeholder="Repita a senha"
                                autoComplete="new-password"
                                className="w-full"
                                required
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label
                                htmlFor="role"
                                className="mb-2 block text-sm font-medium text-slate-700"
                            >
                                Perfil de acesso
                            </label>

                            <Select
                                id="role"
                                value={form.data.role}
                                onChange={(event) =>
                                    form.setData(
                                        "role",
                                        event.target.value as UserRole,
                                    )
                                }
                                options={roles}
                                className="w-full"
                                required
                            />

                            {form.errors.role && (
                                <p className="mt-1.5 text-sm text-red-600">
                                    {form.errors.role}
                                </p>
                            )}

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                O perfil selecionado determina as permissões
                                disponíveis para esse usuário.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p className="text-xs text-slate-500">
                        Todos os campos são obrigatórios.
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
                                ? "Cadastrando..."
                                : "Cadastrar usuário"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}

Register.layout = (page: ReactNode) => <AdminLayout children={page} />;
