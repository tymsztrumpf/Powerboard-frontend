import {CardListRequest} from "./models/CardListRequest";
import {authorizedApi} from "../hooks/withAxiosIntercepted";
import {CardRequest} from "./models/CardRequest";

export class CardApi {
    static addCard = async (request: CardRequest, boardId: number | undefined, cardListId: number | undefined ) =>
        await authorizedApi.post("http://localhost:8080/api/card", request, {
            params: {
                boardId: boardId,
                cardListId: cardListId
            },
        });
}