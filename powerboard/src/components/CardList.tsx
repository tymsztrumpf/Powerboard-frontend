import { Card, CardHeader, CardContent, TextField, Container } from '@mui/material';
import {CardListResponse} from "../api/CardListResponse";
import React, {useContext, useState} from "react";
import {CardListApi} from "../api/CardListApi";
import {BoardContext} from "../context/BoardContext";
import {toast} from "react-toastify";
import HoverableCardText from "./HoverableCardText";
import AddNewCard from "./AddNewCard";

interface Props {
    cardList: CardListResponse
}


const CardList = ({ cardList }: Props) => {

    const context = useContext(BoardContext)
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(cardList.title);
    const handleHeaderClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setNewTitle(event.target.value);
    };

    const handleBlur = async () => {
        try {
            await CardListApi.changeTitle({
                title: newTitle
            }, context.currentBoard?.id, cardList.Id);

            if(context.currentBoard) {
                const updatedCardList = context.currentBoard.cardLists.map(list => {
                    if (list.Id === cardList.Id) {
                        return {...list, title: newTitle};
                    } else return list
                })

                context.currentBoardModifier({
                    ...context.currentBoard,
                    cardLists: updatedCardList,
                });
            }
            toast.success("Card title updated");
        } catch (error) {
            toast.error("Something went wrong");
        }
        setIsEditing(false);
    };

    return (
        <Card sx={{ width: '18rem', borderRadius: '0.5rem', mb: 3, bgcolor: 'grey.900', color: 'white' }}>
            <CardHeader
                onClick={handleHeaderClick}
                title={
                    isEditing ? (
                        <TextField
                            sx={{ border: "none", bgcolor: "transparent", color: "white", height: "1rem" }}
                            type="text"
                            value={newTitle}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            autoFocus
                            fullWidth
                        />
                    ) : (
                        cardList.title
                    )
                }
            />
            <CardContent>
                {cardList.cards.map((card, index) => (
                    <HoverableCardText key={index} text={card.title} />
                ))}
                <AddNewCard cardListId={cardList.Id}/>
            </CardContent>
        </Card>
    )
}

export default CardList;