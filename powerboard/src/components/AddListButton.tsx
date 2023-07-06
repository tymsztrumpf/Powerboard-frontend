import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";
import React, {SyntheticEvent, useContext, useEffect, useState} from "react";
import {BoardApi} from "../api/BoardApi";
import {CardListApi} from "../api/CardListApi";
import {toast} from "react-toastify";
import {BoardContext} from "../context/BoardContext";
import {CardResponse} from "../api/CardResponse";
import {CardListResponse} from "../api/CardListResponse";


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
                Id: newCardListResponse.data.id,
                title: newCardListResponse.data.title,
                cards: []
            };

            if (context.currentBoard) {
                const updatedCardLists = [...context.currentBoard.cardLists, newCardList];

                context.currentBoardModifier({
                    ...context.currentBoard,
                    cardLists: updatedCardLists
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
                <Button variant="success" onClick={handleButtonClick} style={{ width: '18rem', borderRadius: '0.5rem'}}>
                    + Dodaj kolejną listę
                </Button>
            )}
            {showForm && (
                <Form onSubmit={createCardList} style={{ width: '18rem' }}>
                    <Form.Group className="mb-5" controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Title" value={title} onChange={handleInputChange}/>
                    </Form.Group>
                    <div className="d-flex justify-content-between">
                        <Button variant="primary" type="submit" style={{ width: '10rem', borderRadius: '0.5rem' }}>
                            Submit
                        </Button>
                        <Button onClick={handleCancelClick} variant="warning" type="button" style={{ width: '10rem', borderRadius: '0.5rem' }}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            )}
        </div>
    )
}

export default AddNewCardList;