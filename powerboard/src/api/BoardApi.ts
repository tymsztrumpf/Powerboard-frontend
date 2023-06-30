import {authorizedApi} from "../hooks/withAxiosIntercepted";
import {BoardRequest} from "./BoardRequest";

export class BoardApi {
    static createBoard = async (request: BoardRequest) =>
        await authorizedApi.post("http://localhost:8080/api/board", request);
    static getBoards = async () =>
        await authorizedApi.get("http://localhost:8080/api/board");
}