import {Board} from "./Board";
import {CardListResponse} from "../api/models/CardListResponse";

export type BoardContextType = {
    currentBoard: Board | null
    currentCardList: CardListResponse | null
    currentBoardModifier: (board: Board | null) => void
    updateCardLists: (newCardLists: CardListResponse[]) => void
    currentCardListModifier: (cardList: CardListResponse | null) => void
}