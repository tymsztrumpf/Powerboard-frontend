import {CardListResponse} from "./CardListResponse";
import {UserResponse} from "./UserResponse";

export type BoardResponse = {
    id: number;
    title: string;
    users: UserResponse[];
    cardLists: CardListResponse[];
    owner: UserResponse;
    imagePath: string;
}