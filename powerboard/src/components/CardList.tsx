import {Card} from "react-bootstrap";
import HoverableCardText from "./HoverableCardText";
import AddNewCard from "./AddNewCard";
import {CardListResponse} from "../api/CardListResponse";
import React, {useContext, useEffect, useState} from "react";
import {Form} from "react-bootstrap";
import {CardListApi} from "../api/CardListApi";
import {BoardContext} from "../context/BoardContext";
import {toast} from "react-toastify";
import {CardResponse} from "../api/CardResponse";

interface Props {
    cardList: CardListResponse
}


const CardList = ({ cardList }: Props) => {
    const baseHeight = 12.5;
    const perCardHeight = 3.125;

    const context = useContext(BoardContext)
    const [isEditing, setIsEditing] = useState(false);
    const [newTitle, setNewTitle] = useState(cardList.title);
    const [totalHeight, setTotalHeight] = useState(`${baseHeight + (cardList.cards.length * perCardHeight)}rem`);
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
        setTotalHeight(`${baseHeight + (cardList.cards.length * perCardHeight)}rem`);
    }, [cardList.cards]);

    return (
        <Card bg="dark" text="white" style={{height: totalHeight, width: '18rem', borderRadius: '0.5rem' }} className="mb-3">
            <Card.Header onClick={handleHeaderClick}>
                {isEditing ? (
                        <Form.Control
                            style={{ border: "none", backgroundColor: "transparent", color: "white", height: "1rem" }}
                            type="text"
                            value={newTitle}
                            onChange={handleInputChange}
                            onBlur={handleBlur}
                            autoFocus
                        />
                ) : (
                    cardList.title
                )}
            </Card.Header>
            <Card.Body>
                {cardList.cards.map((card, index) => (
                    <HoverableCardText key={index} text={card.title} />
                ))}
                <AddNewCard cardListId={cardList.Id}/>
            </Card.Body>
        </Card>
    )
}

export default CardList;