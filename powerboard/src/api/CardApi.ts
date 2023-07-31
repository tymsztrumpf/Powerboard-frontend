import {CardListRequest} from "./models/CardListRequest";
import {authorizedApi} from "../hooks/withAxiosIntercepted";
import {CardRequest} from "./models/CardRequest";
import {CardSwapRequest} from "./models/CardSwapRequest";

export class CardApi {
    static addCard = async (request: CardRequest, boardId: number | undefined, cardListId: number | undefined ) =>
        await authorizedApi.post("http://localhost:8080/api/card", request, {
            params: {
                boardId: boardId,
                cardListId: cardListId
            },
        });
    static updateCard = async (request: CardRequest, cardId: number | undefined, cardListId: number | undefined, boardId: number | undefined) =>
        await authorizedApi.patch("http://localhost:8080/api/card", request, {
            params: {
                cardId: cardId,
                cardListId: cardListId,
                boardId: boardId
            },
        });
    static addUser = async (param: { cardId: number | undefined,  cardListId: number | undefined, boardId: number | undefined, userEmail: string | undefined; }) =>
        await authorizedApi.patch(`http://localhost:8080/api/card/add-user?cardId=${param.cardId}&cardListId=${param.cardListId}&boardId=${param.boardId}&userEmail=${param.userEmail}`);

    static swapCard = async (requests: CardSwapRequest[], boardId: number | undefined) =>
        await authorizedApi.patch("http://localhost:8080/api/card/swap", requests, {
            params: {
                boardId: boardId
            },
        });
}