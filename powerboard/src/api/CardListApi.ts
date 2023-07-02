
import {authorizedApi} from "../hooks/withAxiosIntercepted";
import {CardListRequest} from "./CardListRequest";
export class CardListApi {
    static addCardList = async (request: CardListRequest, boardId: number | undefined) =>
        await authorizedApi.post("http://localhost:8080/api/card-list", request, {
            params: {
                boardId: boardId,
            },
        });
}