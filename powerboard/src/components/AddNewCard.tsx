import { Button, TextField, Box, Grid, FormHelperText } from '@mui/material';
import React, {useContext, useEffect, useState} from "react";
import {toast} from "react-toastify";
import {CardApi} from "../api/CardApi";
import {BoardContext} from "../context/BoardContext";
import {CardResponse} from "../api/models/CardResponse";

interface Props {
    cardListId: number
}
const AddNewCard = ({ cardListId }: Props) => {
    const [title, setTitle] = useState('');
    const [showForm, setShowForm] = useState(false);
    const context = useContext(BoardContext)
    const [cardAdded, setCardAdded] = useState(false);
    const createCard = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        try {
            const newCardResponse = await CardApi.addCard({
                title: title
            }, context.currentBoard?.id, cardListId);

            const newCard: CardResponse = {
                id: newCardResponse.data.id,
                title: newCardResponse.data.title
            };
            console.log("ID KARTRYYYYYYYYYYYYYY" + context.currentBoard?.cardLists)
            if(context.currentBoard) {
                const updatedCardList = context.currentBoard.cardLists.map(list => {
                    if (list.Id === cardListId) {
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
            toast.success("Dodano Karte");
        } catch {
            toast.error("Błąd serwera tutaj");
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
                    + Dodaj kartę
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
                    <FormHelperText>
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