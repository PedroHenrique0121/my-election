export type Campaign = {
    id: number;
    title: string;
    description: string | null;
    image_path: string | null;
    starts_at: string | null;
    ends_at: string | null;
    status: "draft" | "published" | "closed" | "in_vote";
};
