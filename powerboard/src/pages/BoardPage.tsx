import {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BoardApi} from "../api/BoardApi";
import {toast} from "react-toastify";
import {BoardResponse} from "../api/BoardResponse";
import {Card} from "react-bootstrap";
import './BoardPage.css';
import HoverableCardText from "../components/HoverableCardText";
import AddNewCard from "../components/AddNewCard";
import Button from "react-bootstrap/Button";
import AddListButton from "../components/AddListButton";

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

        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        <Card
            bg={"dark"}
            text={"white"}
            style={{ width: '18rem', borderRadius: '15px',  marginRight: '2em'}}
            className="mb-3"
        >
            <Card.Header>DO ZROBIENIA</Card.Header>
            <Card.Body>
                 <HoverableCardText  text={"TESTTESTTEST"} />
                <HoverableCardText  text={"TESTTESTTEST"} />
                <AddNewCard />
            </Card.Body>
        </Card>
            <Card
                bg={"dark"}
                text={"white"}
                style={{ width: '18rem', borderRadius: '15px' }}
                className="mb-3"
            >
                <Card.Header>DO ZROBIENIA</Card.Header>
                <Card.Body>
                    <HoverableCardText  text={"TESTTESTTEST"} />
                    <HoverableCardText  text={"TESTTESTTEST"} />
                    <AddNewCard />
                </Card.Body>
            </Card>

            <div style={{ width: '18rem', marginLeft: '1em' }}>
                <AddListButton  boardId={board?.id}/>
            </div>

        </div>

    )
}

export default BoardPage;