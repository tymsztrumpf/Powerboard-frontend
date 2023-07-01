import {useCallback, useEffect, useState} from "react";
import {BoardApi} from "../api/BoardApi";
import {Card} from 'react-bootstrap';
import {toast} from "react-toastify";
import TestImage from '../resources/img/test.jpg';
import {useNavigate} from "react-router-dom";
import BoardPage from "./BoardPage";
import {BoardResponse} from "../api/BoardResponse";

const BoardsPage = () => {
    const [boards, setBoards] = useState<BoardResponse[]>([]);
    const navigate = useNavigate();

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
                    <Card.Body onClick={() => navigate(`/board/${board.id}`)}>
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