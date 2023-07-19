import {useCallback, useContext, useEffect, useState} from "react";
import {BoardApi} from "../api/BoardApi";

import {toast} from "react-toastify";
import TestImage from '../resources/img/test.jpg';
import {useNavigate} from "react-router-dom";
import {BoardResponse} from "../api/models/BoardResponse";
import {BoardContext} from "../context/BoardContext";
import {Board} from "../models/Board";
import {Card, CardContent, CardMedia, Container, Grid, Typography} from "@mui/material";
import {UserContext} from "../context/UserContext";

const BoardsPage = () => {
    const [boards, setBoards] = useState<BoardResponse[]>([]);
    const navigate = useNavigate();
    const context = useContext(BoardContext)
    const handleBoardClick = (board: Board) => {
        context.currentBoardModifier({id: board.id, title: board.title, users: board.users, cardLists: board.cardLists, owner: board.owner})
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
        <Container>
            <Grid container spacing={7}>
                {boards.map((board, index) => (
                    <Grid item xs={12} key={index}>
                        <Card sx={{ width: '100%' }} onClick={() => handleBoardClick(board)}>
                            <CardMedia
                                component="img"
                                image={TestImage}
                                alt="Board image"
                                style={{ height: '11.25rem' }}
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary">
                                    {board.title}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}

export default BoardsPage;