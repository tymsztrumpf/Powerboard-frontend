import {Card} from "react-bootstrap";
import HoverableCardText from "./HoverableCardText";
import AddNewCard from "./AddNewCard";

interface Props {
    title: string;
}
const CardList = ({ title }: Props) => {
    return (
        <Card
            bg={"dark"}
            text={"white"}
            style={{ width: '18rem', borderRadius: '15px',  marginRight: '2em'}}
            className="mb-3"
        >
            <Card.Header>{ title }</Card.Header>
            <Card.Body>
                <HoverableCardText  text={"TESTTESTTEST"} />
                <HoverableCardText  text={"TESTTESTTEST"} />
                <AddNewCard />
            </Card.Body>
        </Card>
    )
}

export default CardList;