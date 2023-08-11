import { Button, TextField, Box, Grid, FormHelperText } from '@mui/material';
import React, {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import {CardApi} from "../api/CardApi";
import {BoardContext} from "../context/BoardContext";
import {CardResponse} from "../api/models/CardResponse";
import {CardListResponse} from "../api/models/CardListResponse";

interface Props {
    cardList: CardListResponse
}
const AddNewCard = ({ cardList }: Props) => {
    const [title, setTitle] = useState('');
    const [showForm, setShowForm] = useState(false);
    const context = useContext(BoardContext)
    const [cardAdded, setCardAdded] = useState(false);
    const createCard = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const newCardResponse = await CardApi.addCard({
                title: title,
                cardListId: cardList.Id,
                description: null,
            }, context.currentBoard?.id, cardList.Id);

            const newCard: CardResponse = {
                id:newCardResponse.data.id,
                title: newCardResponse.data.title,
                description: newCardResponse.data.description,
                executors: newCardResponse.data.executors,
                orderNum: newCardResponse.data.orderNum,
                cardList: cardList
            };

            if(context.currentBoard) {
                const updatedCardList = context.currentBoard.cardLists.map(list => {
                    if (list.Id === cardList.Id) {
                        return {...list, cards: [...list.cards, newCard]};
                    }
                    else return list
                })

                context.currentBoardModifier({
                    ...context.currentBoard,
                    cardLists: updatedCardList,
                });
            }
            setCardAdded(true)
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
        <Box>
            {!showForm ? (
                <Button data-no-dnd="true"
                        variant="contained"
                        color="primary"
                        onClick={handleButtonClick}
                        sx={{ width: '16rem', borderRadius: '0.5rem'}}
                >
                    + Add card
                </Button>
            ) : (
                <Box component="form" onSubmit={createCard} sx={{ width: '16rem' }}>
                    <TextField data-no-dnd="true"
                               type="text"
                               placeholder="Title"
                               value={title}
                               onChange={handleInputChange}
                               fullWidth
                               required
                               margin="normal"
                    />
                    <FormHelperText component="div">
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Button data-no-dnd="true"
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        sx={{ width: '7.5rem', borderRadius: '0.5rem' }}
                                >
                                    Submit
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button data-no-dnd="true"
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleCancelClick}
                                        sx={{ width: '7.5rem', borderRadius: '0.5rem' }}
                                >
                                    Cancel
                                </Button>
                            </Grid>
                        </Grid>
                    </FormHelperText>
                </Box>
            )}
        </Box>
    )
}

export default AddNewCard;