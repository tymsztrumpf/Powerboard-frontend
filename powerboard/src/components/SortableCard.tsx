import {Card} from '@mui/material';
import {CSS} from '@dnd-kit/utilities';
import {useSortable} from '@dnd-kit/sortable';
import HoverableCardText from "./HoverableCardText";
import {DragStartEvent} from "@dnd-kit/core";
import {BoardContext} from "../context/BoardContext";
import {useContext} from "react";
import {CardListResponse} from "../api/models/CardListResponse";
import {CardResponse} from "../api/models/CardResponse";
interface SortableCardProps {
    id: string;
    cardList: CardListResponse
    card: CardResponse
}

const SortableCard: React.FC<SortableCardProps> = ({id, cardList, card}) => {
    const context = useContext(BoardContext);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({id});


    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 2 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} >
            <HoverableCardText cardList={cardList} card={card}></HoverableCardText>
        </div>
    );
};

export default SortableCard;