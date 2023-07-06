import {useCallback, useContext, useEffect, useState} from "react";
import {BoardApi} from "../api/BoardApi";
import {Card} from 'react-bootstrap';
import {toast} from "react-toastify";
import TestImage from '../resources/img/test.jpg';
import {useNavigate} from "react-router-dom";
import {BoardResponse} from "../api/BoardResponse";
import {BoardContext} from "../context/BoardContext";
import {Board} from "../models/Board";

const BoardsPage = () => {
    const [boards, setBoards] = useState<BoardResponse[]>([]);
    const navigate = useNavigate();
    const context = useContext(BoardContext)
    const handleBoardClick = (board: Board) => {
        context.currentBoardModifier({id: board.id, title: board.title, cardLists: board.cardLists})
        navigate(`/board/${board.id}`);
    }

    const fetchBoards = useCallback(async () => {
        try {
            const response = await BoardApi.getBoards();
            setBoards(response.data);
        } catch (error) {
            toast.error("Błąd serwera");
        }
    }, []);

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards])


    if (boards.length === 0) {
        return <p>You don't have any boards</p>
    }


    return (
        <div>
            {boards.map((board, index) => (
                <Card key={index}>
                    <Card.Img variant="top" src={TestImage} style={{ width: 'auto', height: '180px' }} />
                    <Card.Body onClick={() => handleBoardClick(board)}>
                        <Card.Text>
                            {board.title}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}
        </div>
    )
}

export default BoardsPage;