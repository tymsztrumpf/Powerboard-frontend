import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BoardApi} from "../api/BoardApi";
import {toast} from "react-toastify";
import {BoardResponse} from "../api/BoardResponse";

const BoardPage = () => {
    const { id } = useParams();
    const [board, setBoard] = useState<BoardResponse | null>(null);

    const fetchBoard = useCallback(async () => {
        if (id) {
            try {
                const response = await BoardApi.getBoard({
                    boardId: id
                });
                setBoard(response.data);
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
        <h1>{board?.title}</h1>
    )
}

export default BoardPage;