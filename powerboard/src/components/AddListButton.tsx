import { Box, Button, TextField, Grid, Container } from '@mui/material';
import React, {SyntheticEvent, useContext, useEffect, useState} from "react";
import {CardListApi} from "../api/CardListApi";
import {toast} from "react-toastify";
import {BoardContext} from "../context/BoardContext";
import {CardListResponse} from "../api/models/CardListResponse";
import {sendMessageWithBoardUpdate} from "../message/MessageSender";

const AddNewCardList = () => {

    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const context = useContext(BoardContext);
    const [cardAdded, setCardAdded] = useState(false);
    const createCardList = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const newCardListResponse =  await CardListApi.addCardList({
                title: title
            }, context.currentBoard?.id);

            const newCardList: CardListResponse = {
                id: newCardListResponse.data.id,
                title: newCardListResponse.data.title,
                cards: []
            };

            if (context.currentBoard) {
                const updatedCardLists = [...context.currentBoard.cardLists, newCardList];

                context.currentBoardModifier({
                    ...context.currentBoard,
                    cardLists: updatedCardLists
                });
                sendMessageWithBoardUpdate({
                    id: context.currentBoard.id,
                    title: context.currentBoard.title,
                    users: context.currentBoard.users,
                    cardLists: updatedCardLists,
                    owner: context.currentBoard.owner,
                    imagePath: context.currentBoard.imagePath})
            }
            setCardAdded(true)
            toast.success("Cardlist added");
        } catch {
            toast.error("Server error");
        }
    };

    const handleButtonClick = () => {
        setShowForm(true);
    };
    const handleCancelClick = () => {
        setTitle('')
        setShowForm(false);
    };

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(event.target.value);
    };

    useEffect(() => {
        if (cardAdded) {
            setShowForm(false);
            setTitle("");
            setCardAdded(false);
        }
    }, [cardAdded]);

    return (
        <Container>
            <Box>
                {!showForm && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleButtonClick}
                        sx={{ width: '18rem', borderRadius: '0.5rem'}}
                    >
                        + Add list
                    </Button>
                )}
                {showForm && (
                    <Box component="form" onSubmit={createCardList} sx={{ width: '18rem' }}>
                        <Box mb={5}>
                            <TextField
                                type="text"
                                placeholder="Title"
                                value={title}
                                onChange={handleInputChange}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ display: 'flex' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ width: '10rem', borderRadius: '0.5rem' }}
                            >
                                Submit
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCancelClick}
                                sx={{ width: '10rem', borderRadius: '0.5rem' }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    )
}

export default AddNewCardList;