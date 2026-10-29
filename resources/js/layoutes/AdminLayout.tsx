import type { ReactNode } from "react";
import { Link, router, usePage } from "@inertiajs/react";

type AdminLayoutProps = {
    children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { url } = usePage();

    function handleLogout() {
        router.post("/logout");
    }

    const linkClass = (active: boolean) =>
        `rounded-lg px-3 py-2 text-sm font-medium transition ${
            active
                ? "bg-blue-50 text-primary"
                : "text-slate-600 hover:bg-slate-50 hover:text-primary"
        }`;

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
                    <Link
                        href="/admin/users"
                        className="text-lg font-bold text-primary"
                    >
                        Admin Panel
                    </Link>

                    <nav className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/admin/users"
                            className={linkClass(
                                url.startsWith("/admin/users") &&
                                url !== "/admin/users/create"
                            )}
                        >
                            Usuários
                        </Link>

                        <Link
                            href="/admin/users/create"
                            className={linkClass(
                                url === "/admin/users/create"
                            )}
                        >
                            Cadastrar usuário
                        </Link>

                        <Link
                            href="/admin/campaigns"
                            className={linkClass(
                                url === "/admin/campaigns"
                            )}
                        >
                            Campanhas
                        </Link>

                        <Link
                            href="/admin/campaigns/create"
                            className={linkClass(
                                url === "/admin/campaigns/create"
                            )}
                        >
                            Nova campanha
                        </Link>

                        <Link
                            href="/admin/candidacies/create"
                            className={linkClass(
                                url.startsWith("/admin/candidacies")
                            )}
                        >
                            Nova candidatura
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                            Sair
                        </button>
                    </nav>
                </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                {children}
            </main>
        </div>
    );
}
