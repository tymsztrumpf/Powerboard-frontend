import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {Board} from "../models/Board";

export const sendMessageWithBoardUpdate = (boardState: Board) => {
    const client = Stomp.over(new SockJS('http://localhost:8080/stomp'));
    client.connect({}, () => {
        client.send('/app/chat', {}, JSON.stringify(boardState));
        client.disconnect(() => {
        });
    });
};
