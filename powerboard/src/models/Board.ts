import {CardListResponse} from "../api/CardListResponse";
import {UserResponse} from "../api/UserResponse";

export type Board = {
    id: number,
    title: string,
    users: UserResponse[],
    cardLists: CardListResponse[]
}