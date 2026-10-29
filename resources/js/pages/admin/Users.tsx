
import AdminLayout from '@/layoutes/AdminLayout';
import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

type User = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'candidate' | 'voter';
    created_at: string;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedUsers = {
    data: User[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
};

type UsersProps = {
    users: PaginatedUsers;
};

const roleLabels: Record<User['role'], string> = {
    admin: 'Administrator',
    candidate: 'Candidate',
    voter: 'Voter',
};

export default function Users({ users }: UsersProps) {
    return (
        <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Users
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {users.total} registered users
                    </p>
                </div>

                <Link
                    href="/admin/users/create"
                    className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                    Register User
                </Link>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-5 py-3 font-medium">Name</th>
                            <th className="px-5 py-3 font-medium">Email</th>
                            <th className="px-5 py-3 font-medium">Role</th>
                            <th className="px-5 py-3 font-medium">Created at</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {users.data.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-5 py-4 font-medium text-gray-900">
                                    {user.name}
                                </td>
                                <td className="px-5 py-4 text-gray-600">
                                    {user.email}
                                </td>
                                <td className="px-5 py-4">
                                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                                        {roleLabels[user.role]}
                                    </span>
                                </td>
                                <td className="px-5 py-4 text-gray-600">
                                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                                </td>
                            </tr>
                        ))}

                        {users.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-5 py-10 text-center text-gray-500"
                                >
                                    No users registered.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-500">
                    Page {users.current_page} of {users.last_page}
                </p>

                <div className="flex flex-wrap gap-1">
                    {users.links.map((link, index) => (
                        <Link
                            key={`${link.label}-${index}`}
                            href={link.url ?? '#'}
                            preserveScroll
                            aria-disabled={!link.url}
                            className={`rounded-md border px-3 py-2 text-sm ${
                                link.active
                                    ? 'border-gray-900 bg-gray-900 text-white'
                                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                            } ${!link.url ? 'pointer-events-none opacity-40' : ''}`}
                        >
                            <span
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

Users.layout = (page: ReactNode)=> <AdminLayout children={page} />
