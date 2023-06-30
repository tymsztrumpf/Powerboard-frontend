import {useCallback, useEffect, useState} from "react";
import {BoardApi} from "../api/BoardApi";
import {Card} from 'react-bootstrap';
import {toast} from "react-toastify";
import TestImage from '../resources/img/test.jpg';

type Board = {
    title: string;
};

const BoardsPage = () => {
    const [boards, setBoards] = useState<Board[]>([]);

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
                    <Card.Body>
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