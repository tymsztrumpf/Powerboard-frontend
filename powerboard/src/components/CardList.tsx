import {Card} from "react-bootstrap";
import HoverableCardText from "./HoverableCardText";
import AddNewCard from "./AddNewCard";
import {CardResponse} from "../api/CardResponse";
import {CardListResponse} from "../api/CardListResponse";

interface Props {
    cardList: CardListResponse
    boardId: number | undefined
}


const CardList = ({ cardList, boardId }: Props) => {

    console.log(cardList)
    console.log("CARDLIST W CARDLIST ID TO" + cardList.Id)

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
                <AddNewCard cardListId={cardList.Id} boardId={boardId}/>
            </Card.Body>
        </Card>
    )
}

export default CardList;