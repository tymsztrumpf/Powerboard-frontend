import "./AddNewCard.css"
import React, {useContext, useEffect, useState} from "react";
import {CardListApi} from "../api/CardListApi";
import {toast} from "react-toastify";
import {CardApi} from "../api/CardApi";
import {useNavigate, useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import {BoardContext} from "../context/BoardContext";
import {CardResponse} from "../api/CardResponse";

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
                title: newCardResponse.data.title
            };

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
        <div>
            {!showForm && (
                <Button variant="success" onClick={handleButtonClick} style={{ width: '16rem', borderRadius: '15px'}}>
                    + Dodaj karte
                </Button>
            )}
            {showForm && (
                <Form onSubmit={createCard}>
                    <Form.Group className="mb-5" controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Title" value={title} onChange={handleInputChange}/>
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                    <Button variant="primary" type="submit" style={{ width: '15rem', borderRadius: '0.5rem' }}>
                        Submit
                    </Button>
                    <Button onClick={handleCancelClick} variant="warning" type="button" style={{ width: '15rem', borderRadius: '0.5rem' }}>
                        Cancel
                    </Button>
                    </div>
                </Form>
            )}
        </div>
    )
}

export default AddNewCard;