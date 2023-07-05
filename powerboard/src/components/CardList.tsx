import {Card} from "react-bootstrap";
import HoverableCardText from "./HoverableCardText";
import AddNewCard from "./AddNewCard";
import {CardResponse} from "../api/CardResponse";
import {CardListResponse} from "../api/CardListResponse";
import {useContext} from "react";
import {BoardContext} from "../context/BoardContext";

interface Props {
    cardList: CardListResponse
}


const CardList = ({ cardList }: Props) => {

    return (
        <Card
            bg={"dark"}
            text={"white"}
            style={{ width: '18rem', borderRadius: '15px',  marginRight: '2em'}}
            className="mb-3"
        >
            <Card.Header>{ cardList.title }</Card.Header>
            <Card.Body>
                {cardList.cards.map((card, index) => (
                    <HoverableCardText key={index} text={card.title}/>
                ))}
                <AddNewCard cardListId={cardList.Id}/>
            </Card.Body>
        </Card>
    )
}

export default CardList;