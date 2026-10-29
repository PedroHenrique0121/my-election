import AdminLayout from "@/layoutes/AdminLayout";
import { ReactNode } from "react";

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold">
                Welcome to the admin area!
            </h1>
        </div>
    );
}

Dashboard.layout = (page: ReactNode)=> <AdminLayout children={page} />
