import { User } from "./user";

export type Participant = {
    id: number;
    number: number;
    image_path: string;
    proposal: string;
    user: User;
};
