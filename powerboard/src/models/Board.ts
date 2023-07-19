import {CardListResponse} from "../api/models/CardListResponse";
import {UserResponse} from "../api/models/UserResponse";

export type Board = {
    id: number,
    title: string,
    users: UserResponse[],
    cardLists: CardListResponse[],
    owner: UserResponse
}