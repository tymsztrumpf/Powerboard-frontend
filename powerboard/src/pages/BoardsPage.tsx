import {useCallback, useContext, useEffect, useState} from "react";
import {BoardApi} from "../api/BoardApi";

import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import {BoardResponse} from "../api/models/BoardResponse";
import {BoardContext} from "../context/BoardContext";
import {Board} from "../models/Board";
import {Card, CardContent, CardMedia, Grid, Typography} from "@mui/material";
import {StyledContainer, Loader, LoaderContainer} from "./BoardsPage.style";
import './BoardsPage.css'
const BoardsPage = () => {
    const [boards, setBoards] = useState<BoardResponse[]>([]);
    const navigate = useNavigate();
    const context = useContext(BoardContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleBoardClick = (board: Board) => {
        context.currentBoardModifier({id: board.id, title: board.title, users: board.users, cardLists: board.cardLists, owner: board.owner, imagePath: board.imagePath})
        navigate(`/board/${board.id}`);
    }

    const fetchBoards = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await BoardApi.getBoards();
            setBoards(response.data);
            setIsLoading(false);
        } catch (error) {
            toast.error("Server error");
        }

    }, []);

    useEffect(() => {
        fetchBoards();
    }, [fetchBoards])

    if (boards.length === 0) {
        return (
        <>
        {isLoading ?
            <LoaderContainer>
            <Loader />
            </LoaderContainer>
            : (
               <p className="empty">You don't have any boards</p>
            )}
        </>
    )
    }

    return (
                <StyledContainer>
                    <Grid container spacing={7}>
                        {boards.map((board, index) => (
                            <Grid item xs={12} key={index}>
                                <Card sx={{ width: '100%' }} onClick={() => handleBoardClick(board)}>
                                    <CardMedia
                                        component="img"
                                        image={board.imagePath}
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
                </StyledContainer>
    )
}

export default BoardsPage;