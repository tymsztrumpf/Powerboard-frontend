import {Stomp} from "@stomp/stompjs";
import SockJS from "sockjs-client";
import {Board} from "../models/Board";

export const sendMessage = (boardId: string) => {
    const message = boardId;
    const client = Stomp.over(new SockJS('http://localhost:8080/stomp'));
    client.connect({}, () => {
        client.send('/app/chat', {}, JSON.stringify({ message }));
        client.disconnect(() => {
        });
    });
};

export const sendMessageWithBoardUpdate = (boardState: Board) => {
    console.log(JSON.stringify(boardState))
    const client = Stomp.over(new SockJS('http://localhost:8080/stomp'));
    client.connect({}, () => {
        client.send('/app/chat', {}, JSON.stringify(boardState));
        client.disconnect(() => {
        });
    });
};