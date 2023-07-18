import {Card, CardContent, CardHeader, TextField} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {CardListResponse} from "../api/models/CardListResponse";
import {BoardContext} from "../context/BoardContext";
import {toast} from "react-toastify";
import AddNewCard from "./AddNewCard";
import {CardListApi} from "../api/CardListApi";
import {CardResponse} from "../api/models/CardResponse";
import SortableCard from "./SortableCard";
interface Props {
    cardList: CardListResponse
}

const CardList = ({ cardList }: Props) => {

    const context = useContext(BoardContext)
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(cardList.title);
    const [cards, setCards] = useState(cardList.cards || []);
    const [activeItem, setActiveItem] = useState<CardResponse>()
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

    useEffect(() => {
        setCards(cardList.cards || []);
    }, [cardList]);

    return (
        <Card sx={{ width: '18rem', borderRadius: '0.5rem', mb: 3,  minHeight: '2rem'}}>
            <CardHeader
                onClick={handleHeaderClick}
                title={
                    isEditing ? (
                        <TextField
                            sx={{ border: "none", backgroundColor: "transparent",  height: "1rem" }}
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
                {cards.map((card, index) => (
                    card.id
                        ? <SortableCard key={card.id.toString()} id={card.id.toString()} text={card.title} cardList={cardList}/>
                        : <></>
                ))}
                <AddNewCard cardListId={cardList.Id}/>
            </CardContent>
        </Card>
    )
}

export default CardList;