import {useCallback, useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BoardApi} from "../api/BoardApi";
import {toast} from "react-toastify";
import {BoardResponse} from "../api/BoardResponse";
import './BoardPage.css';
import AddListButton from "../components/AddListButton";
import CardList from "../components/CardList";
import {CardListResponse} from "../api/CardListResponse";
import {BoardContext} from "../context/BoardContext";

const BoardPage = () => {
    const { id } = useParams();
    const [board, setBoard] = useState<BoardResponse | null>(null);
    const [cardLists, setCardLists] = useState<CardListResponse[]>([]);
    const context = useContext(BoardContext)

    // const fetchBoard = useCallback(async () => {
    //     if (id) {
    //         try {
    //             const response = await BoardApi.getBoard({
    //                 boardId: id
    //             });
    //             setBoard(response.data);
    //             setCardLists(response.data.cardLists)
    //         } catch (error) {
    //             toast.error("Błąd serwera");
    //         }
    //     }
    // }, [id]);
    //
    // useEffect(() => {
    //     fetchBoard();
    // }, [fetchBoard]);

    useEffect(() => {
        console.log("CONTEXT PRINT= ", context.currentBoard);
    }, [context.currentBoard]);


    return (
        <>
            <h1>{context.currentBoard?.title}</h1>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {context.currentBoard?.cardLists.map((cardList, index) => (
                <CardList key={index} cardList={cardList}/>
            ))}
            <AddListButton boardId={context.currentBoard?.id}/>
        </div>
        </>
    )
}

export default BoardPage;