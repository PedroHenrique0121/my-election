import Input from "@/components/ui/inputs";
import { useForm } from "@inertiajs/react";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
        password: "",
    });

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        post("/login");
    }

    return (
        <main className="mx-auto mt-16 max-w-md p-6">
            <h1 className="mb-6 text-2xl font-bold">Sign in</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="mb-1 block">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        value={data.email}
                        onChange={(event) =>
                            setData("email", event.target.value)
                        }
                        required
                        className="w-full rounded border p-2"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="mb-1 block">
                        Password
                    </label>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={data.password}
                        onChange={(event) =>
                            setData("password", event.target.value)
                        }
                        required
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.password}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full rounded p-2 text-white bg-primary disabled:opacity-50"
                >
                    {processing ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </main>
    );
}
