import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BoardApi} from "../api/BoardApi";
import {toast} from "react-toastify";
import {BoardResponse} from "../api/BoardResponse";
import './BoardPage.css';
import AddListButton from "../components/AddListButton";
import CardList from "../components/CardList";
import {CardListResponse} from "../api/CardListResponse";

const BoardPage = () => {
    const { id } = useParams();
    const [board, setBoard] = useState<BoardResponse | null>(null);
    const [cardLists, setCardLists] = useState<CardListResponse[]>([]);

    const fetchBoard = useCallback(async () => {
        if (id) {
            try {
                const response = await BoardApi.getBoard({
                    boardId: id
                });
                setBoard(response.data);
                setCardLists(response.data.cardLists)
                console.log(board)
            } catch (error) {
                toast.error("Błąd serwera");
            }
        }
    }, [id]);

    useEffect(() => {
        fetchBoard();
    }, [fetchBoard]);


    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            {cardLists.map((cardList, index) => (
                <CardList key={index} boardId={board?.id} cardList={cardList}/>
            ))}
            <AddListButton boardId={board?.id}/>
        </div>
    )
}

export default BoardPage;