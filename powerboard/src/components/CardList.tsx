import {Card} from "react-bootstrap";
import HoverableCardText from "./HoverableCardText";
import AddNewCard from "./AddNewCard";
import {CardListResponse} from "../api/CardListResponse";
import {useEffect, useState} from "react";


interface Props {
    cardList: CardListResponse
}


const CardList = ({ cardList }: Props) => {
    const baseHeight = 12.5;
    const perCardHeight = 3.125;

    const [totalHeight, setTotalHeight] = useState(`${baseHeight + (cardList.cards.length * perCardHeight)}rem`);

    useEffect(() => {
        setTotalHeight(`${baseHeight + (cardList.cards.length * perCardHeight)}rem`);
    }, [cardList.cards]);

    return (
        <Card bg="dark" text="white" style={{height: totalHeight, width: '18rem', borderRadius: '0.5rem' }} className="mb-3">
            <Card.Header>{cardList.title}</Card.Header>
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