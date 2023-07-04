import "./AddNewCard.css"
import React, {useState} from "react";
import {CardListApi} from "../api/CardListApi";
import {toast} from "react-toastify";
import {CardApi} from "../api/CardApi";
import {useParams} from "react-router-dom";
import Button from "react-bootstrap/Button";
import {Form} from "react-bootstrap";

interface Props {
    cardListId: number
    boardId: number | undefined
}
const AddNewCard = ({ cardListId, boardId }: Props) => {
    const [title, setTitle] = useState('');
    const [showForm, setShowForm] = useState(false);

    const createCardList = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        console.log("cardList ID " + cardListId)
        try {
            await CardApi.addCard({
                title: title
            }, boardId, cardListId);
            console.log(boardId)
            console.log("cardList ID " + cardListId)
            toast.success("Dodano Karte");
        } catch {
            toast.error("Błąd serwera tutaj");
        }
    };

    const handleButtonClick = () => {
        setShowForm(true);
    };

    const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTitle(event.target.value);
    };

    return (
        <div className="add-card">
            {!showForm && (
                <Button variant="success" onClick={handleButtonClick} style={{ width: '18rem', borderRadius: '2rem'}}>
                    Add Card
                </Button>
            )}
            {showForm && (
                <Form onSubmit={createCardList}>
                    <Form.Group className="mb-5" controlId="formBasicEmail">
                        <Form.Control type="text" placeholder="Title" value={title} onChange={handleInputChange}/>
                    </Form.Group>
                    <Button variant="primary" type="submit" style={{ width: '18rem', borderRadius: '15px' }}>
                        Submit
                    </Button>
                </Form>
            )}
        </div>
    )
}

export default AddNewCard;