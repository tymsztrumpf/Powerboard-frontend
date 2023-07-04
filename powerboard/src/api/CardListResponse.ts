import {CardResponse} from "./CardResponse";

export type CardListResponse = {
    Id: number
    title: string
    cards: CardResponse[]
}